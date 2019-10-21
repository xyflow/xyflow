/// <reference types="react" />
import { ElementId } from '../types';
declare type ContextProps = ElementId | null;
export declare const NodeIdContext: import("react").Context<ContextProps>;
export declare const Provider: import("react").ProviderExoticComponent<import("react").ProviderProps<ContextProps>>;
export declare const Consumer: import("react").ExoticComponent<import("react").ConsumerProps<ContextProps>>;
export default NodeIdContext;
