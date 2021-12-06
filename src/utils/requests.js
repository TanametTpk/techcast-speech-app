// Electron Inter Process Communication and dialog
const { ipcRenderer } = window.require('electron');

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync('get-port-number');

/**
 * @namespace Requests
 * @description - Helper functions for network requests (e.g., get, post, put, delete, etc..)
 */

/**
* @description - Helper GET method for sending requests to and from the Python/Flask services.
* @param {string} route - Path of the Python/Flask service you want to use.
* @param {Function} callback - Callback function which uses the returned data as an argument.
* @return response data from Python/Flask service.
* @memberof Requests
*/
export const get = (route, callback, errorCallback) => {
  fetch(`http://localhost:${port}/${route}`)
    .then((response) => response.json())
    .then(callback)
    .catch((error) => (errorCallback ? errorCallback(error) : console.error(error)));
};


/**
* @description - Helper POST method for sending requests to and from the Python/Flask services.
* @param body - request body of data that you want to pass.
* @param route - URL route of the Python/Flask service you want to use.
* @param callback - optional callback function to be invoked if provided.
* @return response data from Python/Flask service.
* @memberof Requests
*/
export const post = (
  body,
  route,
  callback,
  errorCallback
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