import React, { useEffect, useRef } from 'react';

interface Props {
  audioUrl: string;
}

const AudioPlayerOnHover: React.FC<Props> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load(); // force reload of audio when URL changes
    }
  }, [audioUrl]);

  return (
    <audio ref={audioRef} controls className="max-w-full">
      <source src={audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayerOnHover;
