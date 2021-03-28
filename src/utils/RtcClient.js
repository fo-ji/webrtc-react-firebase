import FirebaseSignallingClient from './FirebaseSignallingClient'

export default class RtcClient {
  constructor(remoteVideoRef, setRtcClient) {
    const config = {
      iceServers: [{ urls: 'stun:stun.stunprotocol.org' }],
    }
    this.rtcPeerConnection = new RTCPeerConnection(config)
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
    this.rtcPeerConnection.addTrack(this.audioTrack, this.mediaStream)
  }

  addVideoTrack() {
    this.rtcPeerConnection.addTrack(this.videoTrack, this.mediaStream)
  }

  get audioTrack() {
    return this.mediaStream.getAudioTracks()[0]
  }

  get videoTrack() {
    return this.mediaStream.getVideoTracks()[0]
  }

  async offer() {
    const sessionDescription = await this.createOffer()
    await this.setLocalDescription(sessionDescription)
    await this.sendOffer()
  }

  async createOffer() {
    try {
      return await this.rtcPeerConnection.createOffer()
    } catch (e) {
      console.error(e)
    }
  }

  async setLocalDescription(sessionDescription) {
    try {
      await this.rtcPeerConnection.setLocalDescription(sessionDescription)
    } catch (e) {
      console.error(e)
    }
  }

  async sendOffer() {
    this.firebaseSignallingClient.setPeerNames(
      this.localPeerName,
      this.remotePeerName
    )

    await this.firebaseSignallingClient.sendOffer(this.localDescription)
  }

  setOntrack() {
    this.rtcPeerConnection.ontrack = (rtcTrackEvent) => {
      if (rtcTrackEvent.track.kind !== 'video') return

      const remoteMediaStream = rtcTrackEvent.streams[0]
      this.remoteVideoRef.current.srcObject = remoteMediaStream
      this.setRtcClient()
    }

    this.setRtcClient()
  }

  async connect(remotePeerName) {
    this.remotePeerName = remotePeerName
    this.setOnicecandidateCallback()
    this.setOntrack()
    await this.offer()
    this.setRtcClient()
  }

  get localDescription() {
    return this.rtcPeerConnection.localDescription.toJSON()
  }

  setOnicecandidateCallback() {
    this.rtcPeerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.log('candidate: ', candidate)
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
