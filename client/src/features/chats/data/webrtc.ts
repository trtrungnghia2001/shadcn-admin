export const createPeer = (
  onTrack: (stream: MediaStream) => void,
  onIceCandidate: (candidate: RTCIceCandidateInit) => void
) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) onIceCandidate(event.candidate);
  };

  pc.ontrack = (event) => {
    onTrack(event.streams[0]);
  };

  return pc;
};
