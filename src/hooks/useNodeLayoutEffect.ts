import {MutableRefObject, useLayoutEffect} from "react";
import {useStoreActions} from "../store/hooks";
import {ElementId} from "../types";

export default (id: ElementId, nodeElement: MutableRefObject<HTMLDivElement | null>) => {
    const updateNodeDimensions = useStoreActions((actions) => actions.updateNodeDimensions);

    useLayoutEffect(() => {
        if (nodeElement.current) {
            updateNodeDimensions([{id, nodeElement: nodeElement.current, forceUpdate: true}]);
        }
    });
}
