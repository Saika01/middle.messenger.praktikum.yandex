const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

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

type HTTPTransportOptions = {
  headers?: Record<string, string>;
  data?: Record<string, unknown> | FormData | URLSearchParams | string;
  timeout?: number;
};

export class HTTPTransport {
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

            let requestUrl = url;
            if (isGet && data) {
                if (this.isPlainObject(data)) {
                    requestUrl = `${url}${queryStringify(data as Record<string, string | number | boolean>)}`;
                } else if (typeof data === 'string') {
                    requestUrl = `${url}?${data}`;
                }
            }

            xhr.open(method, requestUrl);

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function () {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            xhr.timeout = timeout;

            if (isGet || !data) {
                xhr.send();
            } else {
                xhr.send(data as XMLHttpRequestBodyInit);
            }
        });
    }
}
