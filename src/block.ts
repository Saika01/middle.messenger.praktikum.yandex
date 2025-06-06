import Handlebars from 'vite-plugin-handlebars';
import {v4 as makeUUID} from 'uuid';

class EventBus {
    listeners: Record<string, Function[]>;

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
		if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback
    );
  }

	emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    
    this.listeners[event].forEach(function(listener) {
      listener(...args);
    });
  }
}

export abstract class Block {
    static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  };

    protected props: Record<string, any>;
  protected children: Record<string, Block | Block[]>;
  private eventBus: () => EventBus;
  private _element: HTMLElement | null = null;
  private _meta: { tagName: string, propsAndChildren: Record<string, any> };
  private _id: string = '';
    // props: {[key: string]: any};
    // eventBus: Function;
    // children: Record<string, Block | Block[]>;
// _element: any = null;
// _meta: { tagName: string, propsAndChildren: Record<string, any> };
// _id: string;

constructor(tagName: string = "div", propsAndChildren: Object = {}) {
  const { children, props } = this._getChildrenAndProps(propsAndChildren);
  this.children = children;

  const eventBus = new EventBus();
  this.eventBus = () => eventBus;

  this._meta = {
    tagName,
    propsAndChildren
  };

  if ((props as { settings?: { withInternalID?: boolean } }).settings?.withInternalID) {
    this._id = makeUUID();
  }
  this.props = this._makePropsProxy({...props, __id: this._id});

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
    const classes = this.props.classname.split(" ");
    this._element.classList.add(...classes);
  }

  if (typeof this.props.attr === 'object') {
    Object.entries(this.props.attr).forEach(([attrName, attrValue]) => {
      (this._element as HTMLElement).setAttribute(attrName, attrValue as string);
    });
  }
}

init() {
  this._createResources();
  this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
}

_getChildrenAndProps(propsAndChildren: Record<string, any>) {
  const children: Record<string, Block | Block[]> = {};
  const props: Record<string, any> = {};

  Object.entries(propsAndChildren).forEach(([key, value]) => {
    if (Array.isArray(value) && value.every(item => item instanceof Block)) {
      value.forEach((obj) => {
        if (obj instanceof Block) {
          children[key] = value;
        } else {
          props[key] = value;
        }
      });
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
  Object.values(this.children).forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(c => c.dispatchComponentDidMount());
      } else {
        child.dispatchComponentDidMount();
      }
  });
}

// Может переопределять пользователь, необязательно трогать
componentDidMount() {}

_componentDidUpdate(oldProps: Record<string, any>, newProps: Record<string, any>) {
  const response = this.componentDidUpdate(oldProps, newProps);
  if (!response) {
    return;
  }
  this._render();
}

// Может переопределять пользователь, необязательно трогать
componentDidUpdate(oldProps: Record<string, any>, newProps: Record<string, any>) {
  return true;
}

setProps = (nextProps: Record<string, any>) => {
  if (!nextProps) {
    return;
  }

  Object.assign(this.props, nextProps);
};

get element() {
  return this._element;
}

_compile(template: string, props: { [key: string] : any }) {
  const propsAndStubs = { ...props };

  Object.entries(this.children).forEach(([key, child]) => {
    if (Array.isArray(child)) {
      propsAndStubs[key] = child.map(component => `<div data-id="${component._id}"></div>`);
    } else {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`
    }
  });

  const fragment  = this._createDocumentElement('template') as HTMLTemplateElement;
  const templator = Handlebars.compile(template, props);
  fragment.innerHTML = templator(propsAndStubs);

  Object.values(this.children).forEach(child => {
    if (Array.isArray(child)) {
      child.forEach(component => {
        const stub = fragment.content.querySelector(`[data-id="${component._id}"]`);
        const content = component.getContent();
        if (stub && content) {
          stub.replaceWith(content);
        }
      });
    } else {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      const content = child.getContent();
      if (stub && content) {
        stub.replaceWith(content);
      }
    }
  });

  return fragment.content;
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
  const { events = {} } = this.props;
  Object.keys(events).forEach(eventName => {
    this._element && this._element.addEventListener(eventName, events[eventName]);
  });
}

_removeEvents() {
  const { events = {} } = this.props;
    Object.keys(events).forEach(eventName => {
      this._element && this._element.removeEventListener(eventName, events[eventName]);
    });
}

// Может переопределять пользователь, необязательно трогать
protected abstract render(): DocumentFragment;

getContent() {
  return this.element;
}

_makePropsProxy(props: Record<string, any>) {
  // Можно и так передать this
  // Такой способ больше не применяется с приходом ES6+
  const self = this;

  return new Proxy(props, {
    get(target, prop: string) {
      const value = target[prop];
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(target, prop: string, value) {
      target[prop] = value;
      self.eventBus().emit(Block.EVENTS.FLOW_CDU, [{...target}, target]);
      return true;
    },
    // apply(target){

    // },
    deleteProperty(target, prop: string) {
      // if (prop.indexOf('_') === 0) {
        throw new Error('Нет доступа');
      // }

      // delete target[prop];
    },
  });

  // return props;
}

_createDocumentElement(tagName: string) {
  // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
  const element = document.createElement(tagName);
  element.setAttribute('data-id', this._id);
  return element;
}

show() {
  this.getContent()!.style.display = "block";
}

hide() {
  this.getContent()!.style.display = "none";
}
}
