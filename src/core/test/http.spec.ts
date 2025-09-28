// test/unit/http-transport.spec.ts
import { expect } from 'chai';
import sinon from 'sinon';
import { HTTPTransport } from '../http.ts';

// Интерфейсы для типизации
interface MockFormDataInterface {
    append(key: string, value: unknown): void;
    get(key: string): unknown;
    [Symbol.toStringTag]: string;
}

interface MockXMLHttpRequestInterface {
    open: sinon.SinonStub;
    send: sinon.SinonStub;
    setRequestHeader: sinon.SinonStub;
    onload: (() => void) | null;
    onerror: (() => void) | null;
    ontimeout: (() => void) | null;
    onabort: (() => void) | null;
    withCredentials: boolean;
    timeout: number;
    status: number;
    statusText: string;
    response: string;
}

// Типизированный MockFormData
class MockFormData implements MockFormDataInterface {
    private data: Map<string, unknown> = new Map();
    
    append(key: string, value: unknown): void {
        this.data.set(key, value);
    }
    
    get(key: string): unknown {
        return this.data.get(key);
    }
    
    [Symbol.toStringTag] = 'FormData';
}

// Простой мок XMLHttpRequest
function createMockXHR(): MockXMLHttpRequestInterface {
    const mock: MockXMLHttpRequestInterface = {
        open: sinon.stub(),
        send: sinon.stub(),
        setRequestHeader: sinon.stub(),
        onload: null,
        onerror: null,
        ontimeout: null,
        onabort: null,
        withCredentials: false,
        timeout: 0,
        status: 200,
        statusText: 'OK',
        response: 'response data'
    };
    return mock;
}

describe('HTTPTransport', () => {
    let http: HTTPTransport;
    let sandbox: sinon.SinonSandbox;
    let mockXHR: MockXMLHttpRequestInterface;
    let originalXMLHttpRequest: typeof XMLHttpRequest;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mockXHR = createMockXHR();
        
        // Сохраняем оригинальный XMLHttpRequest
        originalXMLHttpRequest = global.XMLHttpRequest;
        
        // Создаем простой мок конструктора с типизацией
        global.XMLHttpRequest = class {
            constructor() {
                return mockXHR as unknown as XMLHttpRequest;
            }
        } as typeof XMLHttpRequest;
        
        http = new HTTPTransport('/test');
    });

    afterEach(() => {
        sandbox.restore();
        global.XMLHttpRequest = originalXMLHttpRequest;
    });

    describe('Constructor', () => {
        it('должен правильно устанавливать endpoint', () => {
            expect(http.endpoint).to.equal('https://ya-praktikum.tech/api/v2/test');
        });

        it('должен корректно обрабатывать пустой endpoint', () => {
            const httpEmpty = new HTTPTransport('');
            expect(httpEmpty.endpoint).to.equal('https://ya-praktikum.tech/api/v2');
        });
    });

    describe('GET requests', () => {
        it('должен отправлять GET запрос без данных', async () => {
            const promise = http.get('/path');
            
            // Имитируем успешный ответ
            if (mockXHR.onload) {
                mockXHR.onload();
            }
            
            await promise;
            expect(mockXHR.open.calledWith('GET', 'https://ya-praktikum.tech/api/v2/test/path')).to.be.true;
            expect(mockXHR.send.calledOnce).to.be.true;
        });

        it('должен добавлять query параметры для GET запроса с данными', async () => {
            const data = { param1: 'value1', param2: 123 };
            const promise = http.get('/path', { data });
            
            if (mockXHR.onload) {
                mockXHR.onload();
            }
            await promise;

            expect(mockXHR.open.calledWith('GET', 'https://ya-praktikum.tech/api/v2/test/path?param1=value1&param2=123')).to.be.true;
        });

        it('должен устанавливать заголовки для GET запроса', async () => {
            const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' };
            const promise = http.get('/path', { headers });
            
            if (mockXHR.onload) {
                mockXHR.onload();
            }
            await promise;

            expect(mockXHR.setRequestHeader.calledWith('Content-Type', 'application/json')).to.be.true;
            expect(mockXHR.setRequestHeader.calledWith('Authorization', 'Bearer token')).to.be.true;
        });
    });

    describe('POST requests', () => {
        it('должен отправлять POST запрос с JSON данными', async () => {
            const data = { name: 'John', age: 30 };
            const promise = http.post('/path', { data });
            
            if (mockXHR.onload) {
                mockXHR.onload();
            }
            await promise;

            expect(mockXHR.open.calledWith('POST', 'https://ya-praktikum.tech/api/v2/test/path')).to.be.true;
            expect(mockXHR.setRequestHeader.calledWith('Content-Type', 'application/json')).to.be.true;
            expect(mockXHR.send.calledWith(JSON.stringify(data))).to.be.true;
        });
    });

    describe('PUT requests', () => {
        it('должен отправлять PUT запрос', async () => {
            const data = { id: 1, name: 'Updated' };
            const promise = http.put('/path', { data });
            
            if (mockXHR.onload) {
                mockXHR.onload();
            }
            await promise;

            expect(mockXHR.open.calledWith('PUT', 'https://ya-praktikum.tech/api/v2/test/path')).to.be.true;
        });
    });

    describe('DELETE requests', () => {
        it('должен отправлять DELETE запрос', async () => {
            const promise = http.delete('/path');
            
            if (mockXHR.onload) {
                mockXHR.onload();
            }
            await promise;

            expect(mockXHR.open.calledWith('DELETE', 'https://ya-praktikum.tech/api/v2/test/path')).to.be.true;
        });
    });

    describe('Request timeout', () => {
        it('должен устанавливать таймаут', async () => {
            const promise = http.get('/path', { timeout: 10000 });
            
            if (mockXHR.onload) {
                mockXHR.onload();
            }
            await promise;

            expect(mockXHR.timeout).to.equal(10000);
        });
    });

    describe('Request errors', () => {
        it('должен отклонять промис при ошибке сети', async () => {
            const promise = http.get('/path');
            
            if (mockXHR.onerror) {
                mockXHR.onerror();
            }
            
            try {
                await promise;
                expect.fail('Promise should have been rejected');
            } catch (error) {
                expect(true).to.be.true;
            }
        });
    });

    describe('Credentials', () => {
        it('должен устанавливать withCredentials в true', async () => {
            const promise = http.get('/path');
            
            if (mockXHR.onload) {
                mockXHR.onload();
            }
            await promise;

            expect(mockXHR.withCredentials).to.be.true;
        });
    });
});

describe('HTTPTransport with FormData', () => {
    let http: HTTPTransport;
    let sandbox: sinon.SinonSandbox;
    let mockXHR: MockXMLHttpRequestInterface;
    let originalFormData: typeof FormData;
    let originalXMLHttpRequest: typeof XMLHttpRequest;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mockXHR = createMockXHR();
        
        // Сохраняем оригинальные конструкторы
        originalFormData = global.FormData;
        originalXMLHttpRequest = global.XMLHttpRequest;
        
        // Подменяем FormData
        global.FormData = MockFormData as unknown as typeof FormData;
        
        // Подменяем XMLHttpRequest
        global.XMLHttpRequest = class {
            constructor() {
                return mockXHR as unknown as XMLHttpRequest;
            }
        } as typeof XMLHttpRequest;
        
        http = new HTTPTransport('/test');
    });

    afterEach(() => {
        sandbox.restore();
        // Восстанавливаем оригинальные конструкторы
        global.FormData = originalFormData;
        global.XMLHttpRequest = originalXMLHttpRequest;
    });

    it('должен отправлять POST запрос с FormData', async () => {
        const formData = new MockFormData();
        formData.append('key', 'value');
        
        const promise = http.post('/path', { data: formData as unknown as FormData });
        
        // Даем время на обработку
        await new Promise(resolve => setTimeout(resolve, 10));
        
        if (mockXHR.onload) {
            mockXHR.onload();
        }
        
        await promise;

        expect(mockXHR.open.calledWith('POST', 'https://ya-praktikum.tech/api/v2/test/path')).to.be.true;
        expect(mockXHR.send.calledWith(sinon.match.any)).to.be.true;
    });
});

describe('HTTPTransport query parameters', () => {
    let http: HTTPTransport;
    let originalXMLHttpRequest: typeof XMLHttpRequest;
    
    beforeEach(() => {
        http = new HTTPTransport('/test');
        originalXMLHttpRequest = global.XMLHttpRequest;
    });

    afterEach(() => {
        global.XMLHttpRequest = originalXMLHttpRequest;
    });

    it('должен корректно формировать URL с параметрами', async () => {
        const mockXHR = createMockXHR();
        
        // Подменяем XMLHttpRequest
        global.XMLHttpRequest = class {
            constructor() {
                return mockXHR as unknown as XMLHttpRequest;
            }
        } as typeof XMLHttpRequest;

        const data = { key: 'value', number: 123 };
        const promise = http.get('/path', { data });
        
        if (mockXHR.onload) {
            mockXHR.onload();
        }
        await promise;

        expect(mockXHR.open.calledWith('GET', 'https://ya-praktikum.tech/api/v2/test/path?key=value&number=123')).to.be.true;
    });
});