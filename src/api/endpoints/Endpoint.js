class Endpoint {
    static baseUrl = 'https://eun1.api.riotgames.com';

    constructor(config) {
        this.config = config;
    }

    request = async (url) => fetch(`${Endpoint.baseUrl}${url}?api_key=${this.config.token}`, {
        method: 'GET'
    }).then(async resp => [
        {
            statusCode: resp.status,
            statusText: resp.statusText
        },
        await resp.json()
    ]);
}

export default Endpoint;