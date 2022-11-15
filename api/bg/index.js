
import { Messaging } from '../messaging';
import {
  APIError,
  METHOD,
  SENDER,
  TARGET,
} from '../config';

const app = Messaging.createBackgroundController();

/**
 * listens to requests from the web context
 */

app.add(METHOD.getRewardAddress, async (request, sendResponse) => {
  const address = [];
  if (address) {
    sendResponse({
      id: request.id,
      data: address,
      target: TARGET,
      sender: SENDER.extension,
    });
  } else {
    sendResponse({
      id: request.id,
      error: APIError.InternalError,
      target: TARGET,
      sender: SENDER.extension,
    });
  }
});

app.listen();

//delete localStorage globalModel
chrome.runtime.onStartup.addListener(function () {
  const entry = Object.keys(localStorage).find((l) =>
    l.includes('globalModel')
  );
  window.localStorage.removeItem(entry);
});
const entry = Object.keys(localStorage).find((l) => l.includes('globalModel'));
window.localStorage.removeItem(entry);
