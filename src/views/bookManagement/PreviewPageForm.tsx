import React from 'react';
import { AngleDown, AngleUp } from '@components/icons/icons';
import AudioPlayerOnHover from '@components/audio/AudioPlayerOnHoverProps';

type PreviewPageFormProps = {
  index: number;
  isOpen: boolean;
  toggle: () => void;
  initialData: {
    pageNumber: number;
    keyPoint: string;
    richText: string;
    audioMale?: string;
    audioFemale?: string;
    insights: { key: string; value: string }[];
  };
};

const PreviewPageForm = ({ index, isOpen, toggle, initialData }: PreviewPageFormProps) => {
  const {
    keyPoint = '',
    richText = '',
    insights = [],
    audioMale,
    audioFemale,
  } = initialData || {};

  return (
    <div className='border mb-6 rounded shadow-sm'>
      <div
        className='flex justify-between items-center px-4 py-2 bg-gray-100 cursor-pointer'
        onClick={toggle}
      >
        <h3 className='text-lg font-semibold'>Page {index + 1}</h3>
        <div>{isOpen ? <AngleUp /> : <AngleDown />}</div>
      </div>

      {isOpen && (
        <div className='p-4 space-y-6'>
          <div>
            <label className='block mb-2 font-medium'>Page Content</label>
            <div
              className='prose max-w-none border rounded p-4 bg-gray-50 text-sm'
              dangerouslySetInnerHTML={{ __html: richText }}
            />
          </div>

          <div>
            <label className='block mb-2 font-medium'>Key Point</label>
            <p className='border border-gray-300 p-2 rounded bg-white text-sm'>
              {keyPoint || '—'}
            </p>
          </div>

          <div>
            <label className='block mb-2 font-medium'>Insights</label>
            <ul className='list-disc ml-6 space-y-1 text-sm'>
              {insights.map((insight, i) => (
                <li key={i}>{insight.value || '—'}</li>
              ))}
            </ul>
          </div>

          {(audioMale || audioFemale) && (
            <div>
              <label className='block mb-2 font-medium'>Audio</label>
              <AudioPlayerOnHover audioUrl={audioMale || audioFemale || ''} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviewPageForm;
