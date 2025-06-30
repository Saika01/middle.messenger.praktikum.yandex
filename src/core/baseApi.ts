import { HTTPTransport, type HTTPTransportOptions } from './http';

export class BaseAPI {
    // На случай, если забудете переопределить метод и используете его, — выстрелит ошибка
    protected http: HTTPTransport;
    
    constructor(baseUrl: string) {
        this.http = new HTTPTransport(baseUrl);
    }

    create(data: unknown, options?: HTTPTransportOptions) { throw new Error('Not implemented'); }

    request(options?: HTTPTransportOptions) { throw new Error('Not implemented'); }

    update(data: unknown, options?: HTTPTransportOptions) { throw new Error('Not implemented'); }

    delete(data: unknown, options?: HTTPTransportOptions) { throw new Error('Not implemented'); }
}
  