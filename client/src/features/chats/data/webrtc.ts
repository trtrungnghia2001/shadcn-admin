export const pcConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const createPeer = (
  onTrack: (stream: MediaStream) => void,
  onIceCandidate: (candidate: RTCIceCandidate) => void
) => {
  const pc = new RTCPeerConnection(pcConfig);

  pc.ontrack = (e) => {
    onTrack(e.streams[0]);
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      onIceCandidate(e.candidate);
    }
  };

  return pc;
};
