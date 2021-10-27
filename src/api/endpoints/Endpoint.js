class Endpoint {
    constructor(config) {
        this.config = config;

        this.headers = new Headers();
        this.headers.append("X-Riot-Token", this.config.token);
    }

    request = async (url) => fetch(`${url}`, {
        method: 'GET',
        redirect: 'follow',
        headers: this.headers
    }).then(async resp => [
        {
            statusCode: resp.status,
            statusText: resp.statusText
        },
        await resp.json()
    ]);
}

export default Endpoint;