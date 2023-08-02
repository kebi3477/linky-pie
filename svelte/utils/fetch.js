export default class Fetch {

    static getFirstStatusCode(status) {
        return parseInt(status / 100);
    }

    static async post(url, data={}) {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json());

        if (Fetch.getFirstStatusCode(response.statusCode) !== 2) {
            throw new Error(response.message);
        }

        return response;
    }

    static async get(url) {
        return await fetch(url).then(res => res.json());
    }
    
}