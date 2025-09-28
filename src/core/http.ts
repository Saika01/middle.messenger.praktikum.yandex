const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

const BASE_API_URL = 'https://ya-praktikum.tech/api/v2';

function queryStringify(data: Record<string, string | number | boolean>): string {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Data must be object');
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(data[key]);
        return `${result}${encodedKey}=${encodedValue}${index < keys.length - 1 ? '&' : ''}`;
    }, '?');
}

export type HTTPTransportOptions = {
  headers?: Record<string, string>;
  data?: XMLHttpRequestBodyInit | Record<string, unknown> | null;
  timeout?: number;
};

export class HTTPTransport {
    endpoint: string;
    
    constructor(endpoint: string) {
        this.endpoint = BASE_API_URL + endpoint;
    }

    get(url: string, options: HTTPTransportOptions = {}): Promise<XMLHttpRequest> {
        return this.request(
            url,
            { ...options, method: METHODS.GET },
            options.timeout
        );
    }

    post(url: string, options: HTTPTransportOptions = {}): Promise<XMLHttpRequest> {
        return this.request(
            url,
            { ...options, method: METHODS.POST },
            options.timeout
        );
    }

    put(url: string, options: HTTPTransportOptions = {}): Promise<XMLHttpRequest> {
        return this.request(
            url,
            { ...options, method: METHODS.PUT },
            options.timeout
        );
    }

    delete(url: string, options: HTTPTransportOptions = {}): Promise<XMLHttpRequest> {
        return this.request(
            url,
            { ...options, method: METHODS.DELETE },
            options.timeout
        );
    }

    isPlainObject(data: unknown): data is Record<string, unknown> {
        return typeof data === 'object' && data !== null && !(data instanceof FormData) && !(data instanceof URLSearchParams);
    }

    request(
        url: string,
        options: HTTPTransportOptions & { method: string },
        timeout = 5000
    ): Promise<XMLHttpRequest> {
        const { headers = {}, method, data } = options;

        return new Promise((resolve, reject) => {
            if (!method) {
                reject('No method');
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;

            let requestUrl = `${this.endpoint}${url}`;

            if (isGet && data) {
                if (this.isPlainObject(data)) {
                    requestUrl = `${requestUrl}${queryStringify(data as Record<string, string | number | boolean>)}`;
                } else if (typeof data === 'string') {
                    requestUrl = `${requestUrl}?${data}`;
                }
            }

            xhr.open(method, requestUrl);
            xhr.withCredentials = true;

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                } else {
                    console.error('Ошибка:', xhr.status, xhr.statusText);
                }
                resolve(xhr)
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            xhr.timeout = timeout;

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else if (this.isPlainObject(data)) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send(data as XMLHttpRequestBodyInit);
            }
        });
    }
}
