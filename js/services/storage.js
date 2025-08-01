export default class Storage {
    static async get(keys) {
        return new Promise(resolve => chrome.storage.local.get(keys, resolve));
    }

    static async set(data) {
        return new Promise(resolve => chrome.storage.local.set(data, resolve));
    }
}
