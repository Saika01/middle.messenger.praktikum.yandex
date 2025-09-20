// import './talking-area.css';
// import { Block } from '../../core/block.ts';
// import template from './talking-area.hbs?raw';
// import { connect } from '../../utils/connect.ts';

// export class TalkingAreaBase extends Block {
//     render() {
//         return this._compile(template, this.props);
//     }
// }

// type BlockClass = new (props?: Record<string, unknown>) => Block;
// const mapStateToProps = (props: Record<string, [BlockClass, { [key: string]: Block | Object }]>) => {
//     return {
//         user: props.chat[1].talkingAreaInfo.user,
//         messages: props.chat[1].talkingAreaInfo.messages,
//         isMock: props.chat[1].talkingAreaInfo.isMock
//     };
// };

// export const TalkingArea = connect(mapStateToProps)(TalkingAreaBase);
