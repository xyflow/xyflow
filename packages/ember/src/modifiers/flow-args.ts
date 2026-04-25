import { modifier } from 'ember-modifier';

type FlowArgsOwner = {
  syncArgs(): void;
};

export default modifier<HTMLDivElement, [FlowArgsOwner, ...unknown[]]>((_, [owner]) => {
  owner.syncArgs();
});
