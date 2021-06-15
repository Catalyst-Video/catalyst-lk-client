import { EventEmitter } from 'events';
import log from 'loglevel';
import { SignalClient, SignalOptions } from '../api/SignalClient';
import {
  ParticipantInfo,
  ParticipantInfo_State,
  SubscribedTrack,
} from '../proto/livekit_models';
import { DataPacket_Kind, SpeakerInfo, UserPacket } from '../proto/livekit_rtc';
import { protocolSubscriptionMap } from '../version';
import { ConnectionError, UnsupportedServer } from './errors';
import { EngineEvent, ParticipantEvent, RoomEvent } from './events';
import LocalParticipant from './participant/LocalParticipant';
import Participant from './participant/Participant';
import RemoteParticipant from './participant/RemoteParticipant';
import RTCEngine from './RTCEngine';
import RemoteTrackPublication from './track/RemoteTrackPublication';
import TrackPublication from './track/TrackPublication';
import { RemoteTrack } from './track/types';
import { unpackStreamId } from './utils';

export enum RoomState {
  Disconnected = 'disconnected',
  Connected = 'connected',
  Reconnecting = 'reconnecting',
}

const maxSubscribeAttempts = 20;

/**
 * In LiveKit, a room is the logical grouping for a list of participants.
 * Participants in a room can publish tracks, and subscribe to others' tracks.
 *
 * a Room fires [[RoomEvent | RoomEvents]].
 *
 * @noInheritDoc
 */
class Room extends EventEmitter {
  state: RoomState = RoomState.Disconnected;

  /** map of sid: [[RemoteParticipant]] */
  participants: Map<string, RemoteParticipant>;

  /**
   * list of participants that are actively speaking. when this changes
   * a [[RoomEvent.ActiveSpeakersChanged]] event is fired
   */
  activeSpeakers: Participant[] = [];

  /** @internal */
  engine!: RTCEngine;

  // available after connected
  /** server assigned unique room id */
  sid!: string;

  /** user assigned name, derived from JWT token */
  name!: string;

  /** the current participant */
  localParticipant!: LocalParticipant;

  /** protocol that the client & server is using */
  protocolVersion!: number;

  /** version of the server */
  serverVersion!: string;

  private subscribedTracks: Map<string, SubscribedTrack>;

  private subscriptionUpdateTimeout?: ReturnType<typeof setTimeout>;

  /** @internal */
  constructor(client: SignalClient, config?: RTCConfiguration) {
    super();
    this.participants = new Map();
    this.subscribedTracks = new Map();
    this.engine = new RTCEngine(client, config);

    this.engine.on(
      EngineEvent.MediaTrackAdded,
      (
        mediaTrack: MediaStreamTrack,
        stream: MediaStream,
        receiver?: RTCRtpReceiver,
      ) => {
        this.onTrackAdded(mediaTrack, stream, receiver);
      },
    );

    this.engine.on(EngineEvent.Disconnected, () => {
      this.handleDisconnect();
    });

    this.engine.on(EngineEvent.ParticipantUpdate, this.handleParticipantUpdates);

    this.engine.on(EngineEvent.SubscriptionUpdate, this.handleSubscriptionUpdate);

    this.engine.on(EngineEvent.SpeakersUpdate, this.handleSpeakerUpdate);

    this.engine.on(EngineEvent.DataPacketReceived, this.handleDataPacket);
  }

  /** @internal */
  connect = async (url: string, token: string, opts?: SignalOptions): Promise<Room> => {
    // guard against calling connect
    if (this.localParticipant) {
      log.warn('already connected to room', this.name);
      return this;
    }

    try {
      const joinResponse = await this.engine.join(url, token, opts);
      log.debug('connected to Livekit Server', joinResponse.serverVersion);

      if (!joinResponse.serverVersion) {
        throw new UnsupportedServer('unknown server version');
      }

      this.protocolVersion = joinResponse.protocolVersion;
      this.serverVersion = joinResponse.serverVersion;
      this.state = RoomState.Connected;
      const pi = joinResponse.participant!;
      this.localParticipant = new LocalParticipant(
        pi.sid,
        pi.identity,
        this.engine,
      );
      this.localParticipant.updateInfo(pi);
      // forward metadata changed for the local participant
      this.localParticipant.on(
        ParticipantEvent.MetadataChanged,
        (metadata: object, p: Participant) => {
          this.emit(RoomEvent.MetadataChanged, metadata, p);
        },
      );

      // populate remote participants, these should not trigger new events
      joinResponse.otherParticipants.forEach((info) => {
        this.getOrCreateParticipant(info.sid, info);
      });

      this.name = joinResponse.room!.name;
      this.sid = joinResponse.room!.sid;
    } catch (err) {
      this.engine.close();
      throw err;
    }

    // don't return until ICE connected
    return new Promise<Room>((resolve, reject) => {
      const connectTimeout = setTimeout(() => {
        // timeout
        this.engine.close();
        reject(new ConnectionError('could not connect after timeout'));
      }, 5 * 1000);

      this.engine.once(EngineEvent.Connected, () => {
        clearTimeout(connectTimeout);
        resolve(this);
      });
    });
  };

  /**
   * disconnects the room, emits [[RoomEvent.Disconnected]]
   */
  disconnect() {
    // send leave
    this.engine.client.sendLeave();
    this.engine.close();
    this.handleDisconnect();
  }

  private onTrackAdded(
    mediaTrack: MediaStreamTrack,
    stream: MediaStream,
    receiver?: RTCRtpReceiver,
  ) {
    if (this.protocolVersion >= protocolSubscriptionMap) {
      // do nothing, and wait for explicit events
      return;
    }

    const parts = unpackStreamId(stream.id);
    const participantId = parts[0];
    let trackId = parts[1];
    if (!trackId || trackId === '') trackId = mediaTrack.id;

    const participant = this.getOrCreateParticipant(participantId);
    participant.addSubscribedMediaTrack(mediaTrack, trackId, receiver);
  }

  private handleDisconnect() {
    this.participants.clear();
    this.activeSpeakers = [];
    this.emit(RoomEvent.Disconnected);
    this.state = RoomState.Disconnected;
  }

  private handleParticipantUpdates = (participantInfos: ParticipantInfo[]) => {
    // handle changes to participant state, and send events
    participantInfos.forEach((info) => {
      if (info.sid === this.localParticipant.sid) {
        this.localParticipant.updateInfo(info);
        return;
      }

      let remoteParticipant = this.participants.get(info.sid);
      const isNewParticipant = !remoteParticipant;

      // create participant if doesn't exist
      remoteParticipant = this.getOrCreateParticipant(info.sid, info);

      // when it's disconnected, send updates
      if (info.state === ParticipantInfo_State.DISCONNECTED) {
        this.handleParticipantDisconnected(info.sid, remoteParticipant);
      } else if (isNewParticipant) {
        // fire connected event
        this.emit(RoomEvent.ParticipantConnected, remoteParticipant);
      } else {
        // just update, no events
        remoteParticipant.updateInfo(info);
      }
    });
  };

  private handleSubscriptionUpdate = (tracks: SubscribedTrack[], attempt: number = 0) => {
    const current: { [key: string]: SubscribedTrack } = {};
    // build map of current tracks
    tracks.forEach((track) => {
      current[track.trackSid] = track;
    });

    // update removed tracks
    this.subscribedTracks.forEach((track, sid) => {
      if (current[sid]) {
        return;
      }
      // delete from array and trigger unsubscribe
      this.subscribedTracks.delete(sid);

      const participant = this.participants.get(track.participantSid);
      if (participant) {
        participant.removeSubscribedMediaTrack(sid);
      }
    });

    // add new tracks, if either metadata or transceiver isn't ready
    // abort and retry later
    let retryNeeded = false;
    for (let i = 0; i < tracks.length; i += 1) {
      const track = tracks[i];
      const participant = this.participants.get(track.participantSid);
      if (!participant) {
        retryNeeded = true;
        break;
      }

      const pub = participant.getTrackPublication(track.trackSid);
      if (!pub) {
        retryNeeded = true;
        break;
      }

      let transceiver: RTCRtpTransceiver | undefined;
      this.engine.subscriber?.pc.getTransceivers().forEach((item) => {
        if (item.mid === track.mid) {
          transceiver = item;
        }
      });

      if (!transceiver || !transceiver.receiver.track) {
        retryNeeded = true;
        break;
      }

      // success, fire off
      this.subscribedTracks.set(track.trackSid, track);
      participant.addSubscribedMediaTrack(transceiver.receiver.track,
        track.trackSid, transceiver.receiver);
    }

    if (retryNeeded) {
      if (attempt > maxSubscribeAttempts) {
        this.emit(RoomEvent.TrackSubscriptionFailed);
        return;
      }

      if (this.subscriptionUpdateTimeout) {
        clearTimeout(this.subscriptionUpdateTimeout);
        this.subscriptionUpdateTimeout = undefined;
      }

      let delay = attempt * attempt * 100;
      if (delay > 2000) {
        delay = 2000;
      }

      // clear other updates and schedule this one
      this.subscriptionUpdateTimeout = setTimeout(() => {
        this.handleSubscriptionUpdate(tracks, attempt + 1);
      }, delay);
    }
  };

  private handleParticipantDisconnected(
    sid: string,
    participant?: RemoteParticipant,
  ) {
    // remove and send event
    this.participants.delete(sid);
    if (!participant) {
      return;
    }

    participant.tracks.forEach((publication) => {
      participant.unpublishTrack(publication.trackSid);
    });
    this.emit(RoomEvent.ParticipantDisconnected, participant);
  }

  private handleSpeakerUpdate = (speakers: SpeakerInfo[]) => {
    const activeSpeakers: Participant[] = [];
    const seenSids: any = {};
    speakers.forEach((speaker) => {
      seenSids[speaker.sid] = true;
      if (speaker.sid === this.localParticipant.sid) {
        this.localParticipant.audioLevel = speaker.level;
        this.localParticipant.setIsSpeaking(true);
        activeSpeakers.push(this.localParticipant);
      } else {
        const p = this.participants.get(speaker.sid);
        if (p) {
          p.audioLevel = speaker.level;
          p.setIsSpeaking(true);
          activeSpeakers.push(p);
        }
      }
    });

    if (!seenSids[this.localParticipant.sid]) {
      this.localParticipant.audioLevel = 0;
      this.localParticipant.setIsSpeaking(false);
    }
    this.participants.forEach((p) => {
      if (!seenSids[p.sid]) {
        p.audioLevel = 0;
        p.setIsSpeaking(false);
      }
    });

    this.activeSpeakers = activeSpeakers;
    this.emit(RoomEvent.ActiveSpeakersChanged, activeSpeakers);
  };

  private handleDataPacket = (
    userPacket: UserPacket,
    kind: DataPacket_Kind,
  ) => {
    // find the participant
    const participant = this.participants.get(userPacket.participantSid);
    if (!participant) {
      return;
    }
    this.emit(RoomEvent.DataReceived, userPacket.payload, participant, kind);

    // also emit on the participant
    participant.emit(ParticipantEvent.DataReceived, userPacket.payload, kind);
  };

  private getOrCreateParticipant(
    id: string,
    info?: ParticipantInfo,
  ): RemoteParticipant {
    let participant = this.participants.get(id);
    if (!participant) {
      // it's possible for the RTC track to arrive before signaling data
      // when this happens, we'll create the participant and make the track work
      if (info) {
        participant = RemoteParticipant.fromParticipantInfo(
          this.engine.client,
          info,
        );
      } else {
        participant = new RemoteParticipant(this.engine.client, id, '');
      }
      this.participants.set(id, participant);
      // also forward events

      // trackPublished is only fired for tracks added after both local participant
      // and remote participant joined the room
      participant.on(
        ParticipantEvent.TrackPublished,
        (trackPublication: RemoteTrackPublication) => {
          this.emit(RoomEvent.TrackPublished, trackPublication, participant);
        },
      );

      participant.on(
        ParticipantEvent.TrackSubscribed,
        (track: RemoteTrack, publication: RemoteTrackPublication) => {
          this.emit(RoomEvent.TrackSubscribed, track, publication, participant);
        },
      );

      participant.on(
        ParticipantEvent.TrackUnpublished,
        (publication: RemoteTrackPublication) => {
          this.emit(RoomEvent.TrackUnpublished, publication, participant);
        },
      );

      participant.on(
        ParticipantEvent.TrackUnsubscribed,
        (track: RemoteTrack, publication: RemoteTrackPublication) => {
          this.emit(RoomEvent.TrackUnsubscribed, track, publication, participant);
        },
      );

      participant.on(
        ParticipantEvent.TrackSubscriptionFailed,
        (sid: string) => {
          this.emit(RoomEvent.TrackSubscriptionFailed, sid, participant);
        },
      );

      participant.on(ParticipantEvent.TrackMuted, (pub: TrackPublication) => {
        this.emit(RoomEvent.TrackMuted, pub, participant);
      });

      participant.on(ParticipantEvent.TrackUnmuted, (pub: TrackPublication) => {
        this.emit(RoomEvent.TrackUnmuted, pub, participant);
      });

      participant.on(
        ParticipantEvent.MetadataChanged,
        (metadata: object, p: Participant) => {
          this.emit(RoomEvent.MetadataChanged, metadata, p);
        },
      );
    }
    return participant;
  }

  /** @internal */
  emit(event: string | symbol, ...args: any[]): boolean {
    log.debug('room event', event, ...args);
    return super.emit(event, ...args);
  }
}

export default Room;
