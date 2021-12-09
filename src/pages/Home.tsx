import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useAtom } from 'jotai';
import { socketAtom } from '../state/socket';

const Home = () => {
  const [socket] = useAtom(socketAtom);
  const [isStart, setStart] = useState<boolean>(false);
  const [canStart, setCanStart] = useState<boolean>(true);
  const [isShowNotify, setNotify] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    socket.on('notification:message', (message: string) => {
      notification.open({
        message: `Transcriptions`,
        description: message,
      });
    });

    socket.on('inference:stopped', () => {
      setCanStart(true);
    });

    return () => {
      socket.removeAllListeners('notification:message');
    };
  }, [isShowNotify]);

  const toggleStart = () => {
    if (isStart) {
      ipcRenderer.send('livechat:stop');
    } else {
      ipcRenderer.send('livechat:start');
      setCanStart(false);
    }
    setStart(!isStart);
  };

  const goto = (path: string) => {
    if (!isStart) history.push(path);
  };

  const canClickStartBtn = (): boolean => {
    if (!isStart) {
      return canStart;
    }

    return true;
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
              {
                  canClickStartBtn() ? "Start"
                  :
                  "พูดอะไรหน่อย เพื่อปิด model"
              }
            </>
          ) : (
            <>Stop</>
          )}
        </button>
      </div>
      <div>
        <button
          type="button"
          className={isStart ? 'disableBtn' : 'mainBtn'}
          onClick={() => goto('/macros')}
        >
          <span role="img" aria-label="books">
            ⌨️
          </span>
          Macros
        </button>
        <button
          type="button"
          className={isStart ? 'disableBtn' : 'mainBtn'}
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
