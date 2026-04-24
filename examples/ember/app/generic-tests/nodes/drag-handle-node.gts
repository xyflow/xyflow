import type { TOC } from '@ember/component/template-only';

interface Signature {
  Args: {
    data: {
      label?: string;
    };
  };
}

const DragHandleNode: TOC<Signature> = <template>
  <div class='container' aria-label={{@data.label}}>
    <div class='drag-handle custom-drag-handle'></div>
  </div>
</template>;

export default DragHandleNode;
