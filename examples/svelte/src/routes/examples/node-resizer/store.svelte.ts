function createStore() {
	let keepAspectRatio = $state(false);

	return {
		get keepAspectRatio() {
			return keepAspectRatio;
		},
		set keepAspectRatio(value: boolean) {
			keepAspectRatio = value;
		}
	};
}

export const store = createStore();
