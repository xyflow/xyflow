import { modifier } from 'ember-modifier';

type PanZoomOwner = {
  installPanZoom(element: HTMLDivElement): void;
  uninstallPanZoom(): void;
};

export default modifier<HTMLDivElement, [PanZoomOwner]>(
  (element, [owner]) => {
    owner.installPanZoom(element);

    return () => {
      owner.uninstallPanZoom();
    };
  },
);
