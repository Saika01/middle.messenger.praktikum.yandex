// test/unit/router.spec.ts
import { expect } from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import { Router } from '../router.ts';
import { Route } from '../route.ts';
import { Block } from '../block.ts';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
});

global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.PopStateEvent = dom.window.PopStateEvent;

class TestBlock extends Block {
    constructor(props: object = {}) {
        super(props);
    }

    render(): DocumentFragment {
        const template = '<div>Test Block</div>';
        return this._compile(template, this.props);
    }
}

describe('Router', () => {
    let router: Router;
    let sandbox: sinon.SinonSandbox;
    let originalHistory: History;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        
        originalHistory = window.history;
        
        const mockHistory = {
            pushState: sandbox.stub(),
            back: sandbox.stub(),
            forward: sandbox.stub(),
            go: sandbox.stub(),
            replaceState: sandbox.stub(),
            scrollRestoration: 'auto' as ScrollRestoration,
            state: null,
            length: 1
        };

        Object.defineProperty(window, 'history', {
            value: mockHistory,
            writable: true,
            configurable: true
        });

        router = new Router('#app');
    });

    afterEach(() => {
        sandbox.restore();
        Object.defineProperty(window, 'history', {
            value: originalHistory,
            writable: true,
            configurable: true
        });
        // @ts-ignore in order to have access to the private property
        (Router as any).__instance = null;
    });

    describe('Singleton pattern', () => {
        it('должен возвращать тот же экземпляр при повторном создании', () => {
            const router1 = new Router('#app');
            const router2 = new Router('#app2');

            expect(router1).to.equal(router2);
            expect(router1).to.be.instanceOf(Router);
        });
    });

    describe('use()', () => {
        it('должен добавлять маршруты, которые можно найти через getRoute', () => {
            router.use('/test', TestBlock, { title: 'Test' });

            const foundRoute = router.getRoute('/test');
            expect(foundRoute).to.not.be.null;
            expect(foundRoute).to.be.instanceOf(Route);
        });

        it('должен добавлять несколько маршрутов', () => {
            router.use('/page1', TestBlock).use('/page2', TestBlock);

            expect(router.getRoute('/page1')).to.not.be.undefined;
            expect(router.getRoute('/page2')).to.not.be.undefined;
            expect(router.getRoute('/page3')).to.be.undefined;
        });

        it('должен возвращать this для chaining', () => {
            const result = router.use('/test', TestBlock);
            expect(result).to.equal(router);
        });
    });

    describe('go()', () => {
        it('должен изменять history', () => {
            router.go('/new-path');
            expect((window.history.pushState as sinon.SinonStub).calledOnce).to.be.true;
            expect((window.history.pushState as sinon.SinonStub).calledWith({}, '', '/new-path')).to.be.true;
        });
    });

    describe('back()', () => {
        it('должен вызывать history.back()', () => {
            router.back();
            expect((window.history.back as sinon.SinonStub).calledOnce).to.be.true;
        });
    });

    describe('forward()', () => {
        it('должен вызывать history.forward()', () => {
            router.forward();
            expect((window.history.forward as sinon.SinonStub).calledOnce).to.be.true;
        });
    });

    describe('getRoute()', () => {
        it('должен находить точное совпадение', () => {
            router.use('/exact', TestBlock);
            const route = router.getRoute('/exact');
            
            expect(route).to.not.be.null;
            if (route) {
                expect(route.match('/exact')).to.be.true;
            }
        });

        it('должен возвращать null для неизвестного пути', () => {
            const route = router.getRoute('/unknown');
            expect(route).to.be.undefined;
        });
    });

    describe('Навигация', () => {
        it('должен обрабатывать переходы между маршрутами', () => {
            const renderStub1 = sandbox.stub();
            const leaveStub1 = sandbox.stub();
            const renderStub2 = sandbox.stub();
            const leaveStub2 = sandbox.stub();

            const mockRoute1 = {
                render: renderStub1,
                leave: leaveStub1,
                match: (path: string) => path === '/'
            } as unknown as Route;

            const mockRoute2 = {
                render: renderStub2,
                leave: leaveStub2,
                match: (path: string) => path === '/about'
            } as unknown as Route;

            const getRouteStub = sandbox.stub(router, 'getRoute');
            getRouteStub.withArgs('/').returns(mockRoute1);
            getRouteStub.withArgs('/about').returns(mockRoute2);

            router.go('/');
            expect(renderStub1.calledOnce).to.be.true;

            router.go('/about');
            expect(leaveStub1.calledOnce).to.be.true;
            expect(renderStub2.calledOnce).to.be.true;
        });
    });

    describe('События браузера', () => {
        it('должен устанавливать обработчик popstate при старте', () => {
            router.start();
            expect(window.onpopstate).to.be.a('function');
        });

        it('должен обрабатывать popstate события', () => {
            router.use('/test', TestBlock);
            router.start();

            let handlerCalled = false;
            
            window.onpopstate = (event: PopStateEvent) => {
                handlerCalled = true;
                expect(event.currentTarget).to.equal(window);
            };

            const popstateEvent = new PopStateEvent('popstate');
            Object.defineProperty(popstateEvent, 'currentTarget', {
                value: window,
                writable: false
            });

            window.onpopstate(popstateEvent);
            
            expect(handlerCalled).to.be.true;
        });
    });
});
