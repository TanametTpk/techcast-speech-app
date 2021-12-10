import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useAtom } from 'jotai';
import { socketAtom } from '../state/socket';
import TeachableMachinePublisher from '../services/clients/TeachableMachinePublisher';
import { Settings } from '../utils/ConfigWriter';
import Chat from '../models/chat';

const Home = () => {
  const [socket] = useAtom(socketAtom);
  const [isStart, setStart] = useState<boolean>(false);
  const [canStart, setCanStart] = useState<boolean>(true);
  const [waitInference, setWaitInference] = useState<boolean>(false);
  const [isShowNotify, setNotify] = useState<boolean>(false);
  const [recognizer, setRecognizer] = useState<
    TeachableMachinePublisher | undefined
  >(undefined);
  const history = useHistory();
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    getSetting();

    socket.on('notification:message', (chat: Chat) => {
      notify(`Transcriptions from ${chat.source || "unknow"}`, chat.message);
    });

    socket.on('inference:stopped', () => {
      setCanStart(true);
    });

    socket.on('inference:ready', () => {
      setWaitInference(false);
    });

    return () => {
      socket.removeAllListeners('notification:message');
    };
  }, [isShowNotify]);

  const getSetting = () => {
    let settings = ipcRenderer.sendSync('settings:get');
    setSettings(settings);
  };

  const isNotHaveSource = () => {
    if (!settings) return true;
    if (settings.sources.googlespeech.allow || settings.sources.wav2vec.allow || settings.sources.teachable.allow) return false

    return true
  }

  const toggleStart = () => {
    if (isStart) {
      ipcRenderer.send('livechat:stop');
      shouldTeachable(stopTeachable);
    } else {
      setWaitInference(true);
      ipcRenderer.send('livechat:start');
      shouldTeachable(startTeachable);
      setCanStart(false);
    }
    setStart(!isStart);
  };

  const notify = (title: string, description: string) => {
    if (isShowNotify)
      notification.open({
        message: title,
        description: description,
      });
  };

  const goto = (path: string) => {
    if (!isStart) history.push(path);
  };

  const canClickStartBtn = (): boolean => {
    if (waitInference) return false;

    if (!isStart) {
      return canStart;
    }

    return true;
  };

  const shouldTeachable = (callback: Function) => {
    if (settings && settings.sources.teachable.allow) callback();
    if (
      settings &&
      !(settings.sources.wav2vec.allow || settings.sources.googlespeech.allow)
    )
      setWaitInference(false);
  };

  const startTeachable = () => {
    if (!settings) return;
    let recognizer = new TeachableMachinePublisher(settings.sources.teachable);
    setRecognizer(recognizer);
    recognizer.start(handleTeachableMachine);
  };

  const stopTeachable = () => {
    if (recognizer) recognizer.stop();
    setRecognizer(undefined);
    setCanStart(true);
  };

  const handleTeachableMachine = (
    className: string,
    probability: number | Float32Array
  ) => {
    if (settings && probability > settings.sources.teachable.overlapFactor) {
      ipcRenderer.send('teachable:message', { message: className });
      notify(`Teachable Machine (${probability})`, className);
    }
  };

  return (
    <div className="home-container">
      <div className="header-title">Techcast Speech App</div>
      <Checkbox
        style={{ color: 'white' }}
        onChange={(e) => setNotify(e.target.checked)}
        checked={isShowNotify}
      >
        show message
      </Checkbox>
      <div>
        <button
          type="button"
          onClick={toggleStart}
          className={canClickStartBtn() && !isNotHaveSource() ? 'mainBtn' : 'disableBtn'}
          disabled={!canClickStartBtn() || waitInference || isNotHaveSource()}
        >
          {!isStart ? (
            <>
              <span role="img" aria-label="books">
                ⭐
              </span>
              {canClickStartBtn() ? 'Start' : 'พูดอะไรหน่อย เพื่อปิด model'}
            </>
          ) : (
            <>Stop</>
          )}
        </button>
      </div>
      <div>
        <button
          type="button"
          className={isStart || !canClickStartBtn() ? 'disableBtn' : 'mainBtn'}
          onClick={() => goto('/macros')}
          disabled={isStart || !canClickStartBtn()}
        >
          <span role="img" aria-label="books">
            ⌨️
          </span>
          Macros
        </button>
        <button
          type="button"
          className={isStart || !canClickStartBtn() ? 'disableBtn' : 'mainBtn'}
          disabled={isStart || !canClickStartBtn()}
          onClick={() => goto('/settings')}
        >
          <span role="img" aria-label="books">
            ⚙️
          </span>
          Settings
        </button>
        <a href="https://bit.ly/3m3uH5p" target="_blank" rel="noreferrer">
          <button className="mainBtn" type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default Home;
