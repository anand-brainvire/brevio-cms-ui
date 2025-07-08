import React from 'react';

type AudioPlayerProps = {
  audioUrl: string;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  if (!audioUrl) {
    return null;
  }

  return (
    <audio controls className='w-[250px]'>
      <source src={audioUrl} type='audio/mpeg' />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
