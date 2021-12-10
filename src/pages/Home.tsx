import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useAtom } from 'jotai';
import { socketAtom } from '../state/socket';
import TeachableMachinePublisher from '../services/clients/TeachableMachinePublisher';
import { Settings } from '../utils/ConfigWriter';

const Home = () => {
  const [socket] = useAtom(socketAtom);
  const [isStart, setStart] = useState<boolean>(false);
  const [canStart, setCanStart] = useState<boolean>(true);
  const [isShowNotify, setNotify] = useState<boolean>(false);
  const [recognizer, setRecognizer] = useState<
    TeachableMachinePublisher | undefined
  >(undefined);
  const history = useHistory();
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    getSetting();

    socket.on('notification:message', (message: string) => {
      notify(`Transcriptions`, message);
    });

    socket.on('inference:stopped', () => {
      setCanStart(true);
    });

    return () => {
      socket.removeAllListeners('notification:message');
    };
  }, [isShowNotify]);

  const getSetting = () => {
    let settings = ipcRenderer.sendSync('settings:get');
    setSettings(settings);
  };

  const toggleStart = () => {
    if (isStart) {
      ipcRenderer.send('livechat:stop');
      shouldTeachable(stopTeachable)
    } else {
      ipcRenderer.send('livechat:start');
      shouldTeachable(startTeachable);
      setCanStart(false);
    }
    setStart(!isStart);
  };

  const notify = (title: string, description: string) => {
    if (isShowNotify) notification.open({
      message: title,
      description: description,
    });
  }

  const goto = (path: string) => {
    if (!isStart) history.push(path);
  };

  const canClickStartBtn = (): boolean => {
    if (!isStart) {
      return canStart;
    }

    return true;
  };

  const shouldTeachable = (callback: Function) => {
    if (settings && settings.sources.teachable.allow) callback();
  }

  const startTeachable = () => {
    if (!settings) return;
    let recognizer = new TeachableMachinePublisher(
      settings.sources.teachable,
    );
    setRecognizer(recognizer)
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
          className={canClickStartBtn() ? 'mainBtn' : 'disableBtn'}
          disabled={!canClickStartBtn()}
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
