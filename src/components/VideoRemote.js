import React from 'react'

import Video from './Video'

const VideoRemote = ({ rtcClient }) => {
  // TODO: videoRef は rtcClient に持たせる
  const videoRef = rtcClient.remoteVideoRef

  if (rtcClient.remotePeerName === '') return <></>

  return (
    <Video
      isLocal={false}
      name={rtcClient.remotePeerName}
      rtcClient={rtcClient}
      videoRef={videoRef}
    />
  )
}

export default VideoRemote
