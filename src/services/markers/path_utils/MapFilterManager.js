class MapFilterManager {
	constructor(map) {
		this.map = map;
		this.activeFilters = new Set();
		this.filterStyles = {
			night: {
				className: 'night-filter',
				css: `
                    .night-filter {
                        filter: brightness(0.6) saturate(0.7);
                        background: linear-gradient(to bottom, rgb(0 0 26 / 44%) 0%, rgb(0 0 81 / 44%) 100%);
                        transition: all 0.5s ease;
                    }
                `,
			},
			'night-half': {
				className: 'night-half-filter',
				css: `
                    .night-half-filter {
                        filter: brightness(0.6) saturate(0.7);
                        background: linear-gradient(to bottom, rgb(0 0 26 / 30%) 0%, rgb(0 0 81 / 30%) 100%);
                        transition: all 0.5s ease;
                    }
                `,
			},
			dusk: {
				className: 'dusk-filter',
				css: `
                    .dusk-filter {
                        filter: brightness(0.6) saturate(0.7);
                        background: linear-gradient(to bottom, rgb(139 52 0 / 61%) 0%, rgb(159 155 0 / 28%) 100%);
                        transition: all 0.5s ease;
                    }
                `,
			},
			rain: {
				className: 'rain-filter',
				css: `
                    .rain-filter {
                        position: relative;
                        filter: brightness(0.9) saturate(0.9);
                        background: linear-gradient(to bottom, 
                            rgba(100,100,100,0.2) 0%,
                            rgba(50,50,50,0.4) 100%);
                    }
                    .rain-filter::before {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: repeating-linear-gradient(transparent 0%,
                            rgba(155,155,155,0.3) 90%,
                            transparent 100%),
                            repeating-linear-gradient(90deg,
                            transparent 0%,
                            rgba(155,155,155,0.3) 90%,
                            transparent 100%);
                        background-size: 50px 50px;
                        animation: rain 0.5s linear infinite;
                        opacity: 0.5;
                    }
                    @keyframes rain {
                        0% { background-position: 0px 0px; }
                        100% { background-position: -50px 50px; }
                    }
                `,
			},
			snow: {
				className: 'snow-filter',
				css: `
                    .snow-filter {
                        filter: brightness(1.1) contrast(0.95);
                        background-color: rgba(255, 255, 255, 0.3);
                        transition: all 0.5s ease;
                    }
                    .snow-filter::before {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: radial-gradient(circle at 50% 50%,
                            rgba(255, 255, 255, 0.8) 0%,
                            rgba(255, 255, 255, 0) 60%);
                        background-size: 24px 24px;
                        animation: snow 8s linear infinite;
                        opacity: 0.4;
                    }
                    @keyframes snow {
                        0% { background-position: 0px 0px; }
                        100% { background-position: 24px 24px; }
                    }
                `,
			},
			fog: {
				className: 'fog-filter',
				css: `
                    .fog-filter {
                        filter: contrast(0.9) brightness(0.95);
                        background: linear-gradient(45deg,
                            rgba(255,255,255,0.4) 0%,
                            rgba(255,255,255,0.2) 100%);
                        transition: opacity 1s ease;
                    }
                    .fog-filter::before {
                        content: '';
                        position: absolute;
                        width: 200%;
                        height: 200%;
                        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                        opacity: 0.4;
                        animation: fog 20s linear infinite;
                        transform: scale(1.5);
                    }
                    @keyframes fog {
                        0% { transform: translate(0%, 0%) scale(1.5); }
                        100% { transform: translate(-50%, -50%) scale(1.5); }
                    }
                `,
			},
		};
		this.init();
	}

	init() {
		this._injectStyles();
		this._setupFilterContainer();
	}

	_injectStyles() {
		// Remove any existing styles first
		const existingStyle = document.getElementById('map-filter-styles');
		if (existingStyle) {
			existingStyle.remove();
		}

		const style = document.createElement('style');
		style.id = 'map-filter-styles';
		style.textContent = Object.values(this.filterStyles)
			.map((filter) => filter.css)
			.join('\n');
		document.head.appendChild(style);
	}

	_setupFilterContainer() {
		// Remove existing container if it exists
		const existingContainer = document.querySelector('.map-filter-container');
		if (existingContainer) {
			existingContainer.innerHTML = null;
		} else {
			const mapContainer = this.map.getContainer();
			const filterContainer = document.createElement('div');
			filterContainer.className = 'map-filter-container';
			filterContainer.style.cssText = `
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				pointer-events: none;
				z-index: 400;
			`;
			mapContainer.appendChild(filterContainer);
			this.filterContainer = filterContainer;
		}
	}

	applyFilter(filter) {
		if (!filter || !filter.mode || !this.filterStyles[filter.mode]) {
			return;
		}

		const className = this.filterStyles[filter.mode].className;
		const existingFilter = this.filterContainer.querySelector(`.${className}`);

		if (filter.enabled) {
			if (!existingFilter) {
				const filterElement = document.createElement('div');
				filterElement.className = `map-filter ${className}`;
				filterElement.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                `;
				this.filterContainer.appendChild(filterElement);

				// Force reflow before adding opacity
				filterElement.offsetHeight;
				filterElement.style.opacity = '1';

				this.activeFilters.add(filter.mode);
			}
		} else if (existingFilter) {
			existingFilter.style.opacity = '0';
			setTimeout(() => {
				if (existingFilter.parentNode) {
					existingFilter.remove();
				}
			}, 500);
			this.activeFilters.delete(filter.mode);
		}
	}

	removeFilter(mode) {
		const filterElement = this.filterContainer.querySelector(`.${this.filterStyles[mode].className}`);
		if (filterElement) {
			filterElement.style.opacity = '0';
			setTimeout(() => {
				if (filterElement.parentNode) {
					filterElement.remove();
				}
			}, 500);
			this.activeFilters.delete(mode);
		}
	}

	clearFilters() {
		const filters = this.filterContainer.querySelectorAll('.map-filter');
		filters.forEach((filter) => {
			filter.style.opacity = '0';
			setTimeout(() => {
				if (filter.parentNode) {
					filter.remove();
				}
			}, 500);
		});
		this.activeFilters.clear();
	}
}
