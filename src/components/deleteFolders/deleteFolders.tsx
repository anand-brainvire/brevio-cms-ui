import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { CopyIcon } from '@components/icons/icons';
import TextArea from '@components/textarea/TextArea';
import { COMMAND_LIST } from '@config/permission';
import { GET_PERMISSIONS } from '@framework/graphql/queries/rolePermissions';
import { ModuleListType } from '@type/rolePermissions';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DeleteFoldersComponent = () => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<{ name: string; code: string }[]>([
    { name: 'Geo Location', code: 'Geo Location' },
    { name: 'Category', code: 'Category' },
    { name: 'Event Management', code: 'Event Management' },
    { name: 'Rule sets Management', code: 'Rule sets Management' },
    { name: 'Notification', code: 'Notification' },
    { name: 'Subscription Management', code: 'Subscription Management' },
  ]);
  const [selected, setSelected] = useState<{ name: string; code: string }[]>(
    []
  );
  const { data } = useQuery(GET_PERMISSIONS, { fetchPolicy: 'network-only' });
  const [command, setCommand] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  /**
   * Method used to set the values of selected
   */
  const onChange = (event: MultiSelectChangeEvent) => {
    setSelected(event.value);
  };

  useEffect(() => {
    if (data?.getModuleWisePermissions) {
      const newData = data?.getModuleWisePermissions?.data.map(
        (mappedModuleWisePermission: ModuleListType) => {
          return {
            code: mappedModuleWisePermission.id,
            name: mappedModuleWisePermission.module_name,
          };
        }
      );

      setOptions((prev) => {
        return [...prev, ...newData];
      });
    }
  }, [data?.getModuleWisePermissions]);

  /**
   * Method used to generate command
   */
  const onGenerate = async () => {
    let commandGenerated = '';
    if (!selected.length) {
      toast.error('Please select at least 1 module to generate the command.');
      return;
    }
    if (navigator.userAgent.includes('Linux')) {
      commandGenerated =
        'rm -rf ' +
        selected
          ?.reduce((acc: string, data: { name: string }) => {
            const value = COMMAND_LIST?.[data.name];
            if (value) {
              return acc + ` ${value}`;
            }
            return acc;
          }, '')
          .trim();
    } else if (navigator.userAgent.includes('Win')) {
      commandGenerated =
        'rmdir /s /q ' +
        selected
          ?.reduce((acc: string, data: { name: string }) => {
            const value = COMMAND_LIST?.[data.name];
            if (value) {
              return acc + ` ${value.split(' ').join(' del /q ')} `;
            }
            return acc;
          }, '')
          .trim();
    } else if (navigator.userAgent.includes('Mac')) {
      commandGenerated =
        'rm -r ' +
        selected
          ?.reduce((acc: string, data: { name: string }) => {
            const value = COMMAND_LIST?.[data.name];
            if (value) {
              return acc + ` ${value}`;
            }
            return acc;
          }, '')
          .trim();
    } else {
      toast.error('Unsupported operating system.');
    }
    setCommand(commandGenerated);
    copyToClipboard(commandGenerated);
  };

  /**
   * Method used to copy
   */
  const handleCopy = async () => {
    copyToClipboard(command);
    toast.success('Command copied to clipboard!');
  };

  /**
   * Method used to copy the commad to clipboard
   * @param command string
   */
  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopyStatus('COPIED');
      setTimeout(() => {
        setCopyStatus('');
      }, 1000);
    } catch (err) {
      if (err) {
        setCopyStatus('Failed to copy!');
      }
    }
  };

  return (
    <div className=' col-span-1 col-start-1 bg-default p-4 rounded border '>
      <div>
        <div>
          <label htmlFor='selectedMoudle' className='ml-1 text-gray-700'>
            {t(
              'Select Module to Generate the Command For Delete Code of Modules'
            )}
          </label>
          <div className='mt-3'>
            <MultiSelect
              id='selectedModule'
              value={selected}
              onChange={onChange}
              options={options}
              optionLabel='name'
              display='chip'
              placeholder={`${t('Select Module')} `}
              className='w-full md:w-20rem '
              filter
            />
          </div>
        </div>
        <div className='mt-[1.9rem] flex justify-between'>
          <Button
            title='Generate Command'
            onClick={onGenerate}
            type='button'
            className='btn-primary'
          >
            Generate Command
          </Button>
          {command && (
            <div className='relative'>
              <Button title='Copy' type='button' onClick={handleCopy}>
                <span className='svg-icon w-4 h-4'>
                  <CopyIcon />
                </span>
              </Button>
              {copyStatus && (
                <p className='absolute right-0 -top-2 -left-8 bg-black text-white p-2 rounded opacity-0 animate-slideInOut'>
                  {copyStatus}
                </p>
              )}
            </div>
          )}
        </div>
        <p className='text-gray-700 mt-1'>
          <span className='text-error'>Note:</span>Copy the Generated Command
          and run in you project terminal to remove selected modules
        </p>
        <TextArea
          value={command}
          placeholder='command'
          className='!bg-black !text-green-600 mt-3 !cursor-pointer !opacity-100 overflow-hidden'
          disabled={true}
        />
      </div>
    </div>
  );
};
export default DeleteFoldersComponent;
