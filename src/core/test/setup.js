import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

globalThis.document = dom.window.document;
globalThis.window = dom.window;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.DocumentFragment = dom.window.DocumentFragment;
globalThis.Event = dom.window.Event;
globalThis.MouseEvent = dom.window.MouseEvent;

Object.keys(dom.window).forEach((property) => {
  if (typeof globalThis[property] === 'undefined') {
    globalThis[property] = dom.window[property];
  }
});

globalThis.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

globalThis.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};
