// eslint-disable-next-line max-classes-per-file
import React, { useState } from 'react';
import { notification } from 'antd';
import styled from 'styled-components';

import ShowImagesModal from './ShowImagesModal';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';
import { Subject } from '../../../../backend/proccess-manager/subject.interface';
import { Observer } from '../../../../backend/proccess-manager/observer.interface';
import RetrieveImagesProcess from '../../../../backend/proccess-manager/retrieve-images.process';
import SendImagesProcess, { ImagesType } from '../../../../backend/proccess-manager/send-images.process';

const TestTaskError = styled.div`
  color: red;
  width: 100%;
  font-size: 18px;
`;

const TestTaskPanel = styled.div`
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

class SaveImagesProcessListener implements Observer {
  private readonly logFunc: any;

  constructor(func: any) {
    this.logFunc = func;
  }

  public update(_subject: Subject, payload: any) {
    switch (payload.state) {
      case 'fallback':
        notification.error({ message: 'Error', description: 'Can not save images!' });
        break;
      case 'completed':
        notification.success({ message: 'Succeeded', description: 'Images saved successfully' });
        break;
    }
    console.log(`${payload.step?.num}/${payload.step?.numOf}`, payload);
    this.logFunc(`${payload.step?.num}/${payload.step?.numOf}`, payload);
  }
}

class GetImagesProcessListener implements Observer {
  private readonly setLoadedImages: any;
  private images: ImagesType = [];

  constructor(func: Function) {
    this.setLoadedImages = func;
  }

  public update(_subject: Subject, payload: any) {
    switch (payload.state) {
      case 'fallback':
        notification.error({ message: 'Error', description: 'Can not get images!' });
        break;
      case 'running':
        this.images = payload.images || this.images;
        notification.success({ message: 'Succeeded', description: `Successfully retrieved ${this.images.length || 0} image(s)` });
        break;
      case 'completed':
        this.setLoadedImages(this.images);
        break;
    }
    console.log(`${payload.step?.num}/${payload.step?.numOf}`, payload);
  }
}

const TestTask = () => {
  const [loadedImages, setLoadedImages] = useState([]);
  const processStateArray = useState('');
  const setProcessStatus = processStateArray[1];

  const {
    isDone,
    isLoading,
    error,
    clearProcessState
  } = useProcessRunner();

  const saveImagesCallback = async () => {
    const images: ImagesType = [
      {
        url: 'https://bit.ly/3ozqA3e'
      }
    ];
    const accountCreateProcess = new SendImagesProcess(images);
    const listener = new SaveImagesProcessListener(setProcessStatus);
    accountCreateProcess.subscribe(listener);
    try {
      await accountCreateProcess.run();
      clearProcessState();
    } catch (e) {
      setProcessStatus(e);
    }
  };

  const showImagesCallback = async () => {
    const accountCreateProcess = new RetrieveImagesProcess();
    const listener = new GetImagesProcessListener(setLoadedImages);
    accountCreateProcess.subscribe(listener);
    try {
      await accountCreateProcess.run();
      await clearProcessState();
      console.log({ loadedImages });
    } catch (e) {
      setProcessStatus(e);
    }
  };

  return (
    <div>
      { error && !isLoading && <TestTaskError>{error}</TestTaskError> }

      <TestTaskPanel>
        <TestTaskButton onClick={() => saveImagesCallback()}>Process A: Send Images JSON to KeyVault</TestTaskButton>
        <TestTaskButton onClick={() => showImagesCallback()}>Process B: Show stored images in dialog</TestTaskButton>
      </TestTaskPanel>

      {!isLoading && !error && loadedImages.length &&
        <ShowImagesModal onClose={() => { setLoadedImages([]); }} images={loadedImages} />
      }
    </div>
  );
};

export default TestTask;
