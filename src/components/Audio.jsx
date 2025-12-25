import React, { useEffect, useRef } from "react";

function AudioSound() {
  const audioRef = useRef(null);
  const backgroundRef = useRef(null);
  useEffect(() => {
    audioRef.current = new Audio("/audio/waves.mp3");
    backgroundRef.current = new Audio("/audio/theme.mp3");
    backgroundRef.current.loop = true;
    backgroundRef.current.volume = 0.2;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.02;
    audioRef.current.preload = "none";
    backgroundRef.current.preload = "none";

    const startAudio = () => {
      audioRef.current?.play();
      backgroundRef.current?.play();
      window.removeEventListener("click", startAudio);
    };

    window.addEventListener("click", startAudio);

    return () => {
      window.removeEventListener("click", startAudio);
      audioRef.current?.pause();
    };
  }, []);
  return <div></div>;
}

export default AudioSound;
