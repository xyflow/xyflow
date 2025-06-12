<script lang="ts">
	import { useConnection, useViewport } from '@xyflow/svelte';

	const connection = useConnection();
	const viewport = useViewport();
	let blockMouseUp = true;

	// Replace this with the flowId of your flow (default is 1)
	const flowId = 1;

	/** Replace this selector with the handle of your choice.
	 * Take a look at the DOM structure to see what how the data-*
	 * attributes are structured for handles
	 */
	const fromHandleSelector = '[data-nodeid="1"].svelte-flow__handle';

	function createPointerEvent(type: string, element: HTMLElement) {
		const { left, top } = element.getBoundingClientRect();

		return new PointerEvent(type, {
			bubbles: true,
			cancelable: true,
			pointerId: 1,
			pointerType: 'mouse',
			clientX: left + element.offsetWidth / 2,
			clientY: top + element.offsetHeight / 2,
			button: 0,
			buttons: 1
		});
	}

	function mouseDownBlocker(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
	}

	function mouseUpBlocker(event: MouseEvent) {
		// we only want to block the original mouseUpEvent
		if (!blockMouseUp) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		connectionFinish();
	}

	function addEventListeners() {
		document.addEventListener('mousedown', mouseDownBlocker, true);
		document.addEventListener('mouseup', mouseUpBlocker, true);
	}

	function removeEventListeners() {
		document.removeEventListener('mousedown', mouseDownBlocker, true);
		document.removeEventListener('mouseup', mouseUpBlocker, true);
	}

	function connectionFinish() {
		blockMouseUp = false;
		const { inProgress, isValid, toHandle } = connection.current;
		if (inProgress && isValid && toHandle) {
			const toHandleElement = document.querySelector(
				`[data-id="${flowId}-${toHandle.nodeId}-${toHandle.id ?? null}-${toHandle.type}"].svelte-flow__handle`
			) as HTMLElement | null;

			if (toHandleElement) {
				const mouseupEvent = createPointerEvent('mouseup', toHandleElement);
				const success = toHandleElement.dispatchEvent(mouseupEvent);

				if (success) {
					removeEventListeners();
					return;
				}
			}
		}

		connectionCancel();
	}

	function connectionStart() {
		const fromHandle = document.querySelector(fromHandleSelector) as HTMLElement | null;

		if (fromHandle) {
			const mousedownEvent = createPointerEvent('mousedown', fromHandle);
			const success = fromHandle.dispatchEvent(mousedownEvent);

			if (success) {
				blockMouseUp = true;
				addEventListeners();
			}
		}
	}

	function connectionCancel() {
		const fromHandle = document.querySelector(fromHandleSelector) as HTMLElement | null;

		if (fromHandle) {
			const mouseUpEvent = createPointerEvent('mouseup', fromHandle);
			fromHandle.dispatchEvent(mouseUpEvent);
		}
		removeEventListeners();
	}
</script>

<!-- onclick works as well -->
<button onpointerdown={connectionStart}>trigger-connection</button>
