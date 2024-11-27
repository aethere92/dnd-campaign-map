// Define filter configurations separately for better maintainability
const FILTER_CONFIGS = {
	night: {
		filter: 'brightness(0.6) saturate(0.7)',
		background: 'linear-gradient(to bottom, rgb(0 0 73 / 44%) 0%, rgb(0 0 81 / 44%) 100%)',
	},
	'night-half': {
		filter: 'brightness(0.6) saturate(0.7)',
		background: 'linear-gradient(to bottom, rgb(0 0 73 / 30%) 0%, rgb(0 0 81 / 30%) 100%)',
	},
	dusk: {
		filter: 'brightness(0.6) saturate(0.7)',
		background: 'linear-gradient(to bottom, rgb(139 52 0 / 61%) 0%, rgb(159 155 0 / 28%) 100%)',
	},
	rain: {
		filter: 'brightness(0.9) saturate(0.9) invert(0.7)',
		background: 'url("images/assets/rain_texture.png")',
		animation: 'rain 0.6s linear infinite',
	},
	snow: {
		filter: 'brightness(1.1) contrast(0.95)',
		background: 'rgba(255, 255, 255, 0.3)',
		backgroundImage: 'url("images/assets/snow_texture.png")',
		backgroundSize: '7%',
		animation: 'snow 1s linear infinite',
	},
	fog: {
		filter: 'contrast(0.9) brightness(0.95)',
		background: 'linear-gradient(45deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)',
		pseudo: {
			content: '""',
			background:
				"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
			opacity: 0.4,
			animation: 'fog 20s linear infinite',
			transform: 'scale(1.5)',
		},
	},
};

class MapFilterManager {
	static ANIMATIONS = `
        @keyframes rain {
            0% { background-position: 0px 0px; }
            100% { background-position: -50px 50px; }
        }
        @keyframes snow {
            0% { background-position: 0px 0px; }
            100% { background-position: -24px 24px; }
        }
        @keyframes fog {
            0% { transform: translate(0%, 0%) scale(1.5); }
            100% { transform: translate(-50%, -50%) scale(1.5); }
        }
    `;

	constructor(map) {
		this.map = map;
		this.activeFilters = new Map();
		this.filterContainer = null;
		this.styleSheet = null;

		this.init();
	}

	init() {
		this._createStyleSheet();
		this._createFilterContainer();
	}

	_createStyleSheet() {
		const style = document.createElement('style');
		style.id = 'map-filter-styles';
		style.textContent = MapFilterManager.ANIMATIONS;
		document.head.appendChild(style);
		this.styleSheet = style;
	}

	_createFilterContainer() {
		const container = document.createElement('div');
		container.className = 'map-filter-container';
		Object.assign(container.style, {
			position: 'absolute',
			top: '0',
			left: '0',
			right: '0',
			bottom: '0',
			pointerEvents: 'none',
			zIndex: '400',
		});

		this.map.getContainer().appendChild(container);
		this.filterContainer = container;
	}

	_createFilterElement(mode) {
		const config = FILTER_CONFIGS[mode];
		if (!config) return null;

		const element = document.createElement('div');
		element.className = `map-filter map-filter-${mode}`;

		Object.assign(element.style, {
			position: 'absolute',
			top: '0',
			left: '0',
			right: '0',
			bottom: '0',
			opacity: '0',
			transition: 'opacity 0.5s ease',
			filter: config.filter,
			background: config.background,
			animation: config.animation,
			backgroundImage: config?.backgroundImage,
			backgroundSize: config?.backgroundSize,
		});

		if (config.pseudo) {
			const pseudoStyles = `
                .map-filter-${mode}::before {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    ${Object.entries(config.pseudo)
											.map(([key, value]) => `${key}: ${value};`)
											.join('\n')}
                }
            `;
			this.styleSheet.textContent += pseudoStyles;
		}

		return element;
	}

	async applyFilter(filterConfig) {
		const { mode, enabled } = filterConfig;

		if (enabled) {
			if (!this.activeFilters.has(mode)) {
				const element = this._createFilterElement(mode);
				if (!element) return;

				this.filterContainer.appendChild(element);
				this.activeFilters.set(mode, element);

				// Force reflow and fade in
				await new Promise((resolve) => {
					requestAnimationFrame(() => {
						element.style.opacity = '1';
						setTimeout(resolve, 500);
					});
				});
			}
		} else {
			await this.removeFilter(mode);
		}
	}

	async removeFilter(mode) {
		const element = this.activeFilters.get(mode);
		if (!element) return;

		element.style.opacity = '0';
		await new Promise((resolve) => setTimeout(resolve, 500));

		if (element.parentNode) {
			element.remove();
		}
		this.activeFilters.delete(mode);
	}

	async clearFilters() {
		const removePromises = Array.from(this.activeFilters.keys()).map((mode) => this.removeFilter(mode));

		await Promise.all(removePromises);
		this.activeFilters.clear();
	}

	destroy() {
		this.clearFilters();
		this.styleSheet?.remove();
		this.filterContainer?.remove();
	}

	toggleAllFilters() {
		// Toggle the state of all active filters
		this.activeFilters.forEach((filter) => {
			filter.enabled = !filter.enabled;
			this.applyFilter(filter);
		});
	}
}
