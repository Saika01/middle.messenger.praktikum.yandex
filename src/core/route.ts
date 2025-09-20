import type { Block } from './block';
import type { RouteInterface } from './router';

function isEqual(lhs: string, rhs: string) {
    return lhs === rhs;
}

function render(query: string, block: Block) {
    const root = document.querySelector(query);
    if (root) {
        root.innerHTML = '';
        const content = block.getContent();
        content && root.appendChild(content);
    }
    return root as HTMLElement;
}

type RouteOptions = Record<string, unknown>;

export class Route implements RouteInterface {
    private _pathname: string;
    private _blockClass: new (props?: Record<string, unknown>) => Block;
    private _block: Block | null;
    private _props: RouteOptions;

    constructor(pathname: string, view: new () => Block, props: RouteOptions) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            this._block.hide();
        }
    }

    match(pathname: string) {
        return isEqual(pathname, this._pathname);
    }

    render() {
        this._block = new this._blockClass(this._props);
        render(this._props.rootQuery as string, this._block);
        this._block.dispatchComponentDidMount();
    }
}
