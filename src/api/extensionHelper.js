import extension from 'extensionizer';
const extensionStorage = extension.storage && extension.storage.local;
import {internalMessageListener, externalMessageListener, onConnectListener} from "./messageListener";
import {ADDONS_MSG, WALLET_GET_ALL_ACCOUNTS} from "../constant/types";

class ExtensionHelper {
    constructor() {

    }
    /**
     * Send message to listener
     * @param {string} type
     * @param {string} action
     * @returns
     */
    sendMessage = (type, action) => {
        extension.runtime.sendMessage({
            type: type,
            action: action,
        }
        );
    }

    onMessage = () => {
        extension.runtime.onMessage.addListener((action) => {
            switch (action.type) {
                case 'filter-by-duration': {
                    break
                }
                default:
                    break
            }

            return action;
        });
    }

    /**
     * Set element by key
     * @param {string} key
     * @param {*} value
     */
    saveLocal = (key,value) => {
        return localStorage.setItem(key, value);
    }

    /**
     * Get element by key
     * @param {*} key
     */
    getLocal = (key) => {
        return localStorage.getItem(key);
    }

    /**
     * Remove by key
     * @param {string} key
     */
    removeLocal = (key) => {
        localStorage.removeItem(key);
    }

    /**
     * Remove all storage
     */
    clearLocal = () => {
        localStorage.clear();
    }

    /**
     * Save
     */
    save = (value) => {
        return new Promise((resolve, reject) => {
            extensionStorage.set(value, () => {
                let error = extension.runtime.lastError
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    /**
     * Get
     */
    get = (value) => {
        return new Promise((resolve, reject) => {
            extensionStorage.get(value, items => {
                let error = extension.runtime.lastError
                if (error) {
                    reject(error);
                }
                resolve(items);
            });
        });
    }
    /**
     * Remove value
     */
    removeValue = (value) => {
        return new Promise((resolve, reject) => {
            extensionStorage.remove(value, () => {
                let error = extension.runtime.lastError
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }
    /**
     * Clear
     */
    clear = () => {
        extensionStorage.clear();
    }

    /**
     * Encapsulation class for sending messages from views
     * @param {*} message
     * @param {*} sendResponse
     */
    sendMsg = (message, sendResponse) => {
        const { messageSource, action, payload } = message

        extension.runtime.sendMessage(
            {
                messageSource, action, payload
            },
            async (params) => {
                sendResponse && sendResponse(params)
            }
        );
    }
    /**
     * open the Web page
     * @param {*} url
     */
    openTab = (url) => {
        extension.tabs.create({
            url: url,
        });
    }
    /**
     * open addon in new tab
     * @param {*} url
     */
    openAddonTab = (url) => {

        extension.tabs.create({url: chrome.extension.getURL(url)}, (tab) => {
            // Tab opened.
            this.sendMsg({
                action: 'OPEN_TAB',
                payload: {
                    data: 'test send data to tab',
                }
            }, (result) => {
                return result
            });
        });
    }
    /**
     * Open Addon in new tab
     * @param {*} url
     */
    OpenAddon = (addon) => {
        // Open addon in new tab
        // Check if already exists the addon tab
        const browserApi = chrome || browser; // chrome or firefox
        browserApi.tabs.query({currentWindow: true}, (tabs) => {
            if(tabs.length){
                const tab = tabs.find(t => t.title === "Boost Wallet");
                if (tab){
                    extension.tabs.update(tab.id, {url: 'addons.html', active: true}, function (tab1) {
                        const tabLocal = {
                            id: addon.id,
                            name: addon.name,
                            description: addon.description,
                            icon: addon.icon,
                            tabId: tab1.id,
                            url: tab1.url
                        }
                        extensionHelper.saveLocal(ADDONS_MSG, JSON.stringify(tabLocal));
                    });
                } else {
                    extension.tabs.create({url: 'addons.html'}, (tab) => {
                        const tabLocal = {
                            id: addon.id,
                            name: addon.name,
                            description: addon.description,
                            icon: addon.icon,
                            tabId: tab.id,
                            url: tab.url
                        }
                        // Save current addon as message
                        extensionHelper.saveLocal(ADDONS_MSG, JSON.stringify(tabLocal));
                    });
                }
            }
        });
    }
    /**
     * Get all open tabs
     * @param {*} url
     */
    getAllTabs = async () => {
        return await extension.windows.getAll({populate: true}, function (tabs) {
            return tabs;
        })
    }

}
export function setupMessageListeners() {
    extension.runtime.onMessage.addListener(internalMessageListener);
    extension.runtime.onMessage.addListener(externalMessageListener);
    extension.runtime.onConnect.addListener(onConnectListener);
}
const extensionHelper = new ExtensionHelper();
export default extensionHelper;
