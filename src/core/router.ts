import { Route } from './route.ts';
import { setupFormValidation } from './validation.ts';
import { Block } from './block.ts';

export interface RouteInterface {
  render: () => void;
  match: (path: string) => boolean;
  leave: () => void;
}

export class Router {
    private static __instance: Router;
    private routes: Route[] = [];
    private history: History = window.history;
    private _currentRoute: Route | null = null;
    private readonly _rootQuery: string = '';

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = rootQuery;

        Router.__instance = this;
    }

    use<P>(pathname: string, block: new (props?: P) => Block, props?: P): Router {
        const fullProps = {
            ...props,
            rootQuery: this._rootQuery
        };
        const route = new Route(pathname, block, fullProps);
        this.routes.push(route);
        return this;
    }

    start() {
        window.onpopstate = ((event: PopStateEvent) => {
            if (!(event.currentTarget instanceof Window)) {
                return;
            }

            this._onRoute(event.currentTarget.location.pathname);
        }).bind(this);

        this._onRoute(window.location.pathname);
    }

    _onRoute(pathname: string) {
        const route = this.getRoute(pathname);
        if (!route) {
            return;
        }

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render();

        this._afterRender();
    }

    private _afterRender() {
        const root = document.querySelector(this._rootQuery);
        if (!root) return;

        const form = root.querySelector('form');
        if (form) {
            setupFormValidation(form as HTMLFormElement);
        }
    }

    go(pathname: string) {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    getRoute(pathname: string) {
        return this.routes.find(route => route.match(pathname));
    }
}
