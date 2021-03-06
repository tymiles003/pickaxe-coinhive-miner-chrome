/* global chrome:true */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["coinhiveOffline"] }] */
export default class Notification {
  constructor() {
    this.ids = {
      minerErrors: [],
    };

    this.addOnClickedListener();
  }

  addOnClickedListener() {
    chrome.notifications.onClicked.addListener((notificationId) => {
      if (this.ids.minerErrors.includes(notificationId)) {
        chrome.runtime.openOptionsPage();
      }
    });
  }

  minerError(siteKey, {
    error,
  }) {
    const id = `pickaxe-miner-error-${siteKey}-${error}`;

    if (this.ids.minerErrors.includes(id)) {
      return;
    }

    this.ids.minerErrors.push(id);

    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: `Error: ${error}`,
      message: `Pickaxe Miner ${siteKey}`,
      requireInteraction: ['invalid_site_key', 'invalid_user_name'].includes(error),
    });
  }

  coinhiveOffline() {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Unable to download Coinhive JS library',
      message: 'Pickaxe will restart itself when internet connection is back',
    });
  }

  reset() {
    chrome.notifications.getAll((notifications) => {
      Object.keys(notifications).forEach((id) => {
        chrome.notifications.clear(id);
      });
    });

    this.ids.minerErrors = [];
  }
}
