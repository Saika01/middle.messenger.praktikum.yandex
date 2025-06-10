import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';
import { EventBus } from './event';

type Props = Record<string, unknown>;
export abstract class Block {
    static EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render',
    } as const;

    protected props: Props;
    protected children: Record<string, Block | Block[]>;
    private eventBus: () => EventBus;
    private _element: HTMLElement | null = null;
    private _meta: { tagName: string, propsAndChildren: Props };
    private _id: string = '';
    private _listeners: Array<{
        element: HTMLElement,
        event: string,
        handler: EventListener,
    }> = [];

    constructor(propsAndChildren = {}, tagName = 'div') {
        const { children, props } = this._getChildrenAndProps(propsAndChildren);
        this.children = children;

        const eventBus = new EventBus();
        this.eventBus = () => eventBus;

        this._meta = {
            tagName,
            propsAndChildren,
        };

        this._id = makeUUID();
        this.props = this._makePropsProxy({ ...props, __id: this._id });

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    _registerEvents(eventBus: EventBus): void {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    _createResources() {
        const { tagName } = this._meta;
        this._element = this._createDocumentElement(tagName);
        if (typeof this.props.className === 'string') {
            const classes = this.props.className.split(' ');
            this._element.classList.add(...classes);
        }

        if (typeof this.props.attr === 'object') {
            if (this.props.attr === null) return;
            Object.entries(this.props.attr).forEach(([attrName, attrValue]) => {
                (this._element as HTMLElement).setAttribute(attrName, attrValue as string);
            });
        }
    }

    init() {
        this._createResources();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    _getChildrenAndProps(propsAndChildren: Props) {
        const children: Record<string, Block | Block[]> = {};
        const props: Props = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.every((item) => item instanceof Block)) {
                    children[key] = value;
                } else {
                    props[key] = value;
                }
            } else if (value instanceof Block) {
                children[key] = value;
            } else {
                props[key] = value;
            }
        });

        return { children, props };
    }

    dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    _componentDidMount(): void {
        this.componentDidMount();
        Object.values(this.children).forEach((child) => {
            if (Array.isArray(child)) {
                child.forEach((c) => c.dispatchComponentDidMount());
            } else {
                child.dispatchComponentDidMount();
            }
        });
    }

    componentDidMount() {}

    _componentDidUpdate(oldProps: Props, newProps: Props) {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (!response) {
            return;
        }
        this._render();
    }

    componentDidUpdate(oldProps: Props, newProps: Props) {
        void oldProps;
        void newProps;
        return true;
    }

    setProps = (nextProps: Props) => {
        if (!nextProps) {
            return;
        }

        Object.assign(this.props, nextProps);
    };

    get element() {
        return this._element;
    }

    _compile(template: string, props: Props) {
        const original = this._meta.propsAndChildren;
        const propsAndStubs = this._buildPropsWithStubs(original);

        const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
        const templator = Handlebars.compile(template, props);
        fragment.innerHTML = templator(propsAndStubs);

        this._replaceStubsWithContent(fragment);

        return fragment.content;
    }

    _buildPropsWithStubs(obj: unknown): unknown {
        if (obj instanceof Block) {
            return `<div data-id="${obj._id}" class="wrapper"></div>`;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this._buildPropsWithStubs(item));
        }

        if (typeof obj === 'object' && obj !== null) {
            const result: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(obj)) {
                result[key] = this._buildPropsWithStubs(value);
            }
            return result;
        }

        return obj;
    }

    private _replaceStubsWithContent(fragment: HTMLTemplateElement) {
        const replace = (obj: unknown) => {
            if (obj instanceof Block) {
                const stub = fragment.content.querySelector(`[data-id="${obj._id}"]`);
                const content = obj.getContent();
                if (stub && content) {
                    stub.replaceWith(content);
                }
            } else if (Array.isArray(obj)) {
                obj.forEach(replace);
            } else if (typeof obj === 'object' && obj !== null) {
                Object.values(obj).forEach(replace);
            }
        };

        replace(this.children);
        replace(this.props);
    }

    _render() {
        const block = this.render();
        this._removeEvents();

        if (this._element) {
            this._element.innerHTML = '';
            this._element.appendChild(block);
            this._addEvents();
        }
    }

    _addEvents() {
        const events = this.props.events as Record<string, (e: Event) => void> | undefined;
        if (!events) return;

        Object.entries(events).forEach(([eventSelector, handler]) => {
            const [event, ...selectorParts] = eventSelector.split(' ');
            const selector = selectorParts.join(' ');

            const targetElements = selector
                ? this._element?.querySelectorAll(selector)
                : [this._element];

            if (!targetElements) return;

            targetElements.forEach((el) => {
                if (el) {
                    el.addEventListener(event, handler);
                    this._listeners.push({ element: el as HTMLElement, event, handler });
                }
            });
        });
    }

    _removeEvents() {
        this._listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this._listeners = [];
    }

    protected abstract render(): DocumentFragment;

    getContent() {
        return this.element;
    }

    _makePropsProxy(props: Props) {
        const self = this;

        return new Proxy(props, {
            get(target, prop: string) {
                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },
            set(target, prop: string, value) {
                target[prop] = value;
                self.eventBus().emit(Block.EVENTS.FLOW_CDU, [{ ...target }, target]);
                return true;
            },
            deleteProperty() {
                throw new Error('Нет доступа');
            },
        });
    }

    _createDocumentElement(tagName: string) {
        const element = document.createElement(tagName);
        element.classList.add('wrapper');
        element.setAttribute('data-id', this._id);
        return element;
    }

    show() {
        this.getContent()!.style.display = 'block';
    }

    hide() {
        this.getContent()!.style.display = 'none';
    }
}
