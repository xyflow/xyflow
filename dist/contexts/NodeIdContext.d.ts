/// <reference types="react" />
import { ElementId } from '../types';
declare type ContextProps = ElementId | null;
export declare const NodeIdContext: import("react").Context<ContextProps>;
export declare const Provider: import("react").Provider<ContextProps>;
export declare const Consumer: import("react").Consumer<ContextProps>;
export default NodeIdContext;
