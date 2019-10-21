import { Elements } from '../types';
interface HookParams {
    deleteKeyCode: number;
    onElementsRemove: (elements: Elements) => void;
}
declare const _default: ({ deleteKeyCode, onElementsRemove }: HookParams) => void;
export default _default;
