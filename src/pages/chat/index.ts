import './chat.css';
import { Block } from '../../core/block.ts';
import template from './chat.hbs?raw';
import { connect } from '../../utils/connect';
import { ChatController } from './chat-controller.ts';
import type { DialogueLine } from 'components/index.ts';

const chatController = new ChatController();

class ChatBase extends Block {
    constructor(props?: Record<string, unknown>) {
        super(props || {});
    }

    private async loadChats() {
        try {
            type BlockClass = new (props?: Record<string, unknown>) => Block;
            interface ChatConfig {
                dialogues?: (DialogueLine | DialogueLine[] | undefined)[];
            }
            type ChatData = [BlockClass, { [key: string]: Object | Block; }];

            const chats = await chatController.allChats();
            const currentState = window.store.getState();
            const updatedProps = {...currentState.props};
            const chatData : ChatData = [...updatedProps.chat];
            const chatConfig : ChatConfig = { ...chatData[1] };
            const updatedDialogues = [
                ...(chatConfig.dialogues || []),
                chats
            ];
            chatConfig.dialogues = updatedDialogues;
            chatData[1] = chatConfig as { [key: string]: Object | Block; };
            updatedProps.chat = chatData;
            window.store.set({props : updatedProps});
        } catch (error) {
            this.setProps({
                error: 'Ошибка загрузки чатов',
            });
        }
    }

    render(): DocumentFragment {
        return this._compile(template, this.props);
    }

    componentDidMount() {
        super.componentDidMount?.();
        this.loadChats();
    }
}

type BlockClass = new (props?: Record<string, unknown>) => Block;
const mapStateToProps = (props: Record<string, [BlockClass, { [key: string]: Block | Object }]>) => {
    return {
        dialogues: props.chat[1].dialogues,
        talkingArea: props.chat[1].talkingArea,
        isMock: props.chat[1].isMock,
        talkingAreaInfo: props.chat[1].talkingAreaInfo
    };
};

export const Chat = connect(mapStateToProps)(ChatBase);
