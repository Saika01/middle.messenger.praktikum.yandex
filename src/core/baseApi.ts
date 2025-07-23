import { HTTPTransport, type HTTPTransportOptions } from './http';

export class BaseAPI {
    // На случай, если забудете переопределить метод и используете его, — выстрелит ошибка
    protected baseUrl: string;
    protected http: HTTPTransport;
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.http = new HTTPTransport(baseUrl);
    }

    // create(data: unknown, options?: HTTPTransportOptions) { throw new Error('Not implemented'); }
    public create(data: unknown): Promise<unknown> {
        return this.http.post(`${this.baseUrl}`, { data });
    }

    // request(options?: HTTPTransportOptions) { throw new Error('Not implemented'); }
    public request(): Promise<unknown> {
        return this.http.get(`${this.baseUrl}`);
    }

    // update(data: unknown, options?: HTTPTransportOptions) { throw new Error('Not implemented'); }
    public update(id: string, data: unknown): Promise<unknown> {
        return this.http.put(`${this.baseUrl}/${id}`, { data });
    }

    // delete(data: unknown, options?: HTTPTransportOptions) { throw new Error('Not implemented'); }
    public delete(id: string): Promise<unknown> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
  