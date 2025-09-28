import { expect } from 'chai';
import { Block } from '../block.ts';

class TestBlock extends Block {
    constructor(props: any = {}) {
        super(props);
    }

    render(): DocumentFragment {
        const template = '<div class="test-block">{{text}}</div>';
        return this._compile(template, this.props);
    }
}

describe('Block', () => {
    describe('Создание экземпляра', () => {
        beforeEach(() => {
            document.body.innerHTML = '<div id="app"></div>';
        });

        it('должен создавать экземпляр с правильными свойствами', () => {
            const props = { text: 'Hello', count: 42 };
            const block = new TestBlock(props);

            expect(block).to.be.instanceOf(Block);
            expect(block.getProps()).to.have.property('text', 'Hello');
            expect(block.getProps()).to.have.property('count', 42);
            expect(block.getProps()).to.have.property('__id');
        });

        it('должен генерировать уникальный ID для каждого экземпляра', () => {
            const block1 = new TestBlock();
            const block2 = new TestBlock();

            expect(block1.getProps().__id).to.not.equal(block2.getProps().__id);
        });
    });

    describe('Работа с props', () => {
        let block: TestBlock;

        beforeEach(() => {
            block = new TestBlock({ initial: 'value' });
        });

        it('должен устанавливать новые props через setProps', () => {
            block.setProps({ newProp: 'newValue', count: 100 });

            expect(block.getProps()).to.have.property('newProp', 'newValue');
            expect(block.getProps()).to.have.property('count', 100);
            expect(block.getProps()).to.have.property('initial', 'value');
        });

        it('должен вызывать componentDidUpdate при изменении props', (done) => {
            let updateCalled = false;
            
            const UpdatingBlock = class extends TestBlock {
                componentDidUpdate(oldProps: any, newProps: any) {
                    updateCalled = true;
                    expect(oldProps).to.have.property('initial', 'value');
                    expect(newProps).to.have.property('updated', true);
                    return true;
                }
            };

            const updatingBlock = new UpdatingBlock({ initial: 'value' });
            
            setTimeout(() => {
                updatingBlock.setProps({ updated: true });
                expect(updateCalled).to.be.true;
                done();
            }, 10);
        });
    });

    describe('Работа с DOM', () => {
        let block: TestBlock;

        beforeEach(() => {
            block = new TestBlock({ text: 'Test Content' });
        });

        afterEach(() => {
            const content = block.getContent();
            if (content && content.parentNode) {
                content.parentNode.removeChild(content);
            }
        });

        it('должен создавать DOM элемент', () => {
            const element = block.getContent();
            
            expect(element).to.not.be.null;
            expect(element!.tagName).to.equal('DIV');
            expect(element!.classList.contains('wrapper')).to.be.true;
        });

        it('должен применять классы из props.className', () => {
            const blockWithClasses = new TestBlock({ 
                className: 'test-class another-class' 
            });
        
            const element = blockWithClasses.getContent();
            expect(element!.classList.contains('test-class')).to.be.true;
            expect(element!.classList.contains('another-class')).to.be.true;
        });

        it('должен применять атрибуты из props.attr', () => {
            const blockWithAttr = new TestBlock({ 
                attr: { 'data-test': 'value', id: 'test-id' } 
            });
            
            const element = blockWithAttr.getContent();
            expect(element!.getAttribute('data-test')).to.equal('value');
            expect(element!.getAttribute('id')).to.equal('test-id');
        });
    });

    describe('Работа с событиями', () => {
        it('должен добавлять обработчики событий', () => {
            let clickCount = 0;
            
            const block = new TestBlock({
                events: {
                    'click': () => { clickCount++; },
                    'click .button': () => { clickCount += 2; }
                }
            });

            const element = block.getContent();
            const button = document.createElement('button');
            button.className = 'button';
        element!.appendChild(button);
        block._addEvents();

        element!.dispatchEvent(new Event('click'));
        button.dispatchEvent(new Event('click'));

        expect(clickCount).to.equal(3);
        });
    });

    describe('Работа с детьми', () => {
        it('должен правильно разделять children и props', () => {
            const childBlock = new TestBlock();
            const childBlock2 = new TestBlock();
            
            const parentBlock = new TestBlock({
                text: 'parent',
                child: childBlock,
                childrenArray: [childBlock, childBlock2],
                simpleProp: 'value'
            });

            const props = parentBlock.getProps();
            
            expect(props).to.have.property('text', 'parent');
            expect(props).to.have.property('simpleProp', 'value');
            expect(props).to.not.have.property('child');
            expect(props).to.not.have.property('childrenArray');
        });
    });

    describe('Методы show/hide', () => {
        it('должен показывать и скрывать элемент', () => {
            const block = new TestBlock();
            const element = block.getContent()!;

            block.hide();
            expect(element.style.display).to.equal('none');

            block.show();
            expect(element.style.display).to.equal('block');
        });
    });
});