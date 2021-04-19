class CustomCache {
    static #ApiCacheKey = "_api_cache";
    static #STORAGE = {}
    constructor() {
        let data = localStorage.getItem(CustomCache.#ApiCacheKey);

        if (data) {
            CustomCache.#STORAGE = data;
        }

        console.log('t')
    }

    static add(url, response) {
        CustomCache.#STORAGE[url] = response;
        localStorage.setItem(CustomCache.#ApiCacheKey, JSON.stringify(CustomCache.#STORAGE));
    }

    static get(url) {
        let data = CustomCache.#STORAGE[url];
        
        if (data) {
            return data;
        }

        return null;
    }
}

