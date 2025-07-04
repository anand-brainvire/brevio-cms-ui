import React, { useState } from 'react';

type AudioPlayerOnHoverProps = {
  audioUrl: string;
  label?: string; // optional (Male/Female)
};

const AudioPlayerOnHover: React.FC<AudioPlayerOnHoverProps> = ({
  audioUrl,
  label,
}) => {
  const [hovered, setHovered] = useState(false);
    if (!audioUrl) {
    return null;
  }
  return (
    <div
      className='relative inline-block'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Display audio label/icon */}
      <span className='text-blue-600 underline cursor-pointer'>
        {label || 'Audio'}
      </span>

      {/* Show audio player on hover */}
      {hovered && (
        <div className='absolute top-6 left-0 z-10 bg-white p-2 shadow-lg border rounded'>
          <audio controls preload='none'>
            <source
              src={`https://leadtechadminapi.node.brainvire.dev/${audioUrl}`}
              type='audio/mpeg'
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioPlayerOnHover;
