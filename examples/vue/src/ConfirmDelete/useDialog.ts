import { ref } from 'vue';

const isVisible = ref(false);
const message = ref('');
let resolveCallback: (value: boolean) => void;

export function useDialogState() {
  return {
    isVisible,
    message,
    resolve: (value: boolean) => {
      if (resolveCallback) {
        resolveCallback(value);
      }
    },
  };
}

export function useDialog(opts: { message?: string }) {
  message.value = opts.message || 'Are you sure?';

  return {
    confirm(): Promise<boolean> {
      isVisible.value = true;
      return new Promise<boolean>((resolve) => {
        resolveCallback = resolve;
      });
    },
  };
}
