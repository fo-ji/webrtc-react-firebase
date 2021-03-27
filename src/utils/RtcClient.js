import FirebaseSignallingClient from './FirebaseSignallingClient'

export default class RtcClient {
  constructor(remoteVideoRef, setRtcClient) {
    const config = {
      iceServers: [{ urls: 'stun:stun.stunprotocol.org' }],
    }
    this.rtcPeerConection = new RTCPeerConnection(config)
    this.firebaseSignallingClient = new FirebaseSignallingClient()
    this.localPeerName = ''
    this.remotePeerName = ''
    this.remoteVideoRef = remoteVideoRef
    this._setRtcClient = setRtcClient
    this.mediaStream = null
  }

  setRtcClient() {
    this._setRtcClient(this)
  }

  async getUserMedia() {
    try {
      const constraints = { audio: true, video: true }
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  async setMediaStream() {
    await this.getUserMedia()
    this.addTracks()
    this.setRtcClient()
  }

  addTracks() {
    this.addAudioTrack()
    this.addVideoTrack()
  }

  addAudioTrack() {
    this.rtcPeerConection.addTrack(this.audioTrack, this.mediaStream)
  }

  addVideoTrack() {
    this.rtcPeerConection.addTrack(this.videoTrack, this.mediaStream)
  }

  get audioTrack() {
    return this.mediaStream.getAudioTracks()[0]
  }

  get videoTrack() {
    return this.mediaStream.getVideoTracks()[0]
  }

  setOnTrack() {
    this.rtcPeerConection.ontrack = (rtcTrackEvent) => {
      if (rtcTrackEvent.tarck.kind !== 'video') return

      const remoteMediaStream = rtcTrackEvent.streams[0]
      this.remoteVideoRef.current.srcObject = remoteMediaStream
      this.setRtcClient()
    }

    this.setRtcClient()
  }

  connect(remotePeerName) {
    this.remotePeerName = remotePeerName
    this.setOnicecandidateCallback()
    this.setOnTrack()
    this.setRtcClient()
  }

  setOnicecandidateCallback() {
    this.rtcPeerConection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        // TODO: remoteへcandidateを通知する
      }
    }
  }

  startListening(localPeerName) {
    this.localPeerName = localPeerName
    this.setRtcClient()
    this.firebaseSignallingClient.database
      .ref(localPeerName)
      .on('value', (snapshot) => {
        const data = snapshot.val()
      })
  }
}
