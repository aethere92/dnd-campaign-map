class LoadingManager {
	#indicator;
	#parent;

	constructor(parent) {
		this.#parent = parent;
		this.#indicator = this.#createIndicator();
	}

	#createIndicator() {
		const div = document.createElement('div');
		div.className = 'map-loading-indicator';
		div.innerHTML = 'Loading map...';
		div.style.cssText = `
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 10px 20px;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		z-index: 1000;
		font-family: system-ui;
	  `;
		return div;
	}

	show() {
		const element = document.getElementById(this.#parent);
		if (element && this.#indicator) {
			element.appendChild(this.#indicator);
			this.#indicator.style.display = 'block';
		}
	}

	hide() {
		if (this.#indicator) {
			this.#indicator.style.display = 'none';
			this.#indicator.remove();
		}
	}

	updateProgress(message) {
		if (this.#indicator) {
			this.#indicator.innerHTML = message;
		}
	}
}
