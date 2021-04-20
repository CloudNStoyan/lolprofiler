class CustomCache {
    static storage = {}

    static add(url, response) {
        CustomCache.storage[url] = response;
    }

    static get(url) {
        let data = CustomCache.storage[url];
        
        if (data) {
            return data;
        }

        return null;
    }
}