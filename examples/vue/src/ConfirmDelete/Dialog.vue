<script setup lang="ts">
import { useDialogState } from './useDialog';

const { isVisible, message, resolve } = useDialogState();

function confirm() {
  resolve(true);
  isVisible.value = false;
}

function cancel() {
  resolve(false);
  isVisible.value = false;
}
</script>

<template>
  <div v-if="isVisible" class="dialog-overlay">
    <div class="dialog">
      <p>{{ message }}</p>

      <div class="dialog-actions">
        <button @click="confirm">
          Confirm
        </button>
        <button @click="cancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.dialog-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
