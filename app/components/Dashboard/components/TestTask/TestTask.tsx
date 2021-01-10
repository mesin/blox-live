import React, {useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
// import { saveImages, showImages } from './actions';
import { ProcessLoader } from '../../../../common/components';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';

const TestTaskButtonsPanel = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
`;

const TestTaskButton = styled.button`
  width: 300px;
  height: 32px;
  background-color: ${({ theme }) => theme.primary700};
  color: ${({ theme }) => theme.gray50};
  margin-right: 20px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.accent2200};
  }
`;

const TestTask = () => {
  const dispatch = useDispatch();

  const {
    startProcess,
    isLoading,
    processMessage,
    isDone,
    error,
    isServerActive,
    clearProcessState,
    loaderPrecentage
  } = useProcessRunner();

  const onSuccess = () => {
    console.log('Done with success!');
  };

  const onFailure = () => {
    console.log('Done with error:', error);
  };

  useEffect(() => {
    if (isDone) {
      clearProcessState();
      isServerActive ? onSuccess() : onFailure();
    }
  }, [isLoading, isDone, processMessage]);

  const saveImagesCallback = async () => {
    await startProcess(
      'sendImages',
      'Sending images to KeyVault..',
      null
    );
  };

  const showImagesCallback = async () => {
    console.log('Retrieving images from KeyVault..');
    // await startProcess('get-images', null, {});
    // await dispatch(showImages());
    // console.log('Retrieving images from KeyVault.. done!');
  };

  return (
    <div>
      { isServerActive && isLoading && !isDone && !error && (
        <TestTaskButtonsPanel>
          <ProcessLoader text={processMessage} precentage={loaderPrecentage} />
        </TestTaskButtonsPanel>
      )}
      <TestTaskButtonsPanel>
        <TestTaskButton onClick={() => saveImagesCallback()}>Process A: Send Images JSON to KeyVault</TestTaskButton>
        <TestTaskButton onClick={() => showImagesCallback()}>Process B: Show stored images in dialog</TestTaskButton>
      </TestTaskButtonsPanel>
    </div>
  );
};

export default TestTask;
