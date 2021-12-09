const { ipcRenderer } = window.require('electron');

const port = ipcRenderer.sendSync('get-port-number');

export const get = (route:string, callback: any, errorCallback: Function) => {
  fetch(`http://localhost:${port}/${route}`)
    .then((response) => response.json())
    .then(callback)
    .catch((error) => (errorCallback ? errorCallback(error) : console.error(error)));
};

export const post = (
  body: any,
  route: string,
  callback: any,
  errorCallback: Function
) => {
  fetch(`http://localhost:${port}/${route}`, {
    body,
    method: 'POST',
    headers: { 'Content-type': 'application/json' }
  })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => (errorCallback ? errorCallback(error) : console.error(error)));
};

export const getServerAddress = () => `http://localhost:${port}`