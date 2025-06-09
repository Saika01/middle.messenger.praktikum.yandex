const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

function queryStringify(data: Record<string, any>): string {
    if (typeof data !== 'object') {
        throw new Error('Data must be object');
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
    }, '?');
}

type HTTPTransportOptions = {
  headers?: Record<string, string>;
  data?: any;
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

            xhr.open(
                method,
                isGet && data ? `${url}${queryStringify(data)}` : url
            );

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
                xhr.send(data);
            }
        });
    }
}
