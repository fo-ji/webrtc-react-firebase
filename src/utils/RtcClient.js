export default class RtcClient {
  constructor() {
    const config = {
      iceServers: [{ urls: 'stun:stun.stunprotocol.org' }],
    }
    this.rtcPeerConection = new RTCPeerConnection(config)
    this.localPeerName = ''
    this.RemotePeerName = ''
  }
}
