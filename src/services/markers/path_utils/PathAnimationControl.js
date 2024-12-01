// Handles the animation marker appearance and effects
class PathAnimationMarker {
	constructor() {
		this.domCache = new Map();
	}

	createMarkerIcon() {
		return L.divIcon({
			className: 'animated-marker',
			html: `
                <div class="marker-container" style="
                    width: 32px;
                    height: 32px;
                    position: relative;
                    transform-origin: center;
                ">
                    <img src="images/pageicon.png" style="
                        width: 32px;
                        transition: all 0.3s ease;
                        transform-origin: center;
                    " />
                    <div class="effect-container" style="
                        position: absolute;
                        top: -40px;
                        left: 50%;
                        transform: translateX(-50%) scale(0);
                        text-align: center;
                        font-size: 24px;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        opacity: 0;
                    "></div>
                </div>
            `,
			iconSize: [40, 40],
			iconAnchor: [20, 20],
		});
	}

	createMarker(position) {
		return L.marker(position, {
			icon: this.createMarkerIcon(),
			interactive: false,
			zIndexOffset: 1000,
		});
	}

	showEffect(marker, type) {
		const cacheKey = marker._leaflet_id;
		let elements = this.domCache.get(cacheKey);

		if (!elements) {
			elements = {
				container: marker.getElement().querySelector('.effect-container'),
				markerImg: marker.getElement().querySelector('img'),
			};
			this.domCache.set(cacheKey, elements);
		}

		const { container, markerImg } = elements;

		markerImg.style.transform = 'scale3d(1.2, 1.2, 1)';

		requestAnimationFrame(() => {
			container.textContent = this.getEffectContent(type);
			container.style.display = 'block';

			requestAnimationFrame(() => {
				container.style.transform = 'translate3d(-50%, 0, 0) scale3d(1, 1, 1)';
				container.style.opacity = '1';

				setTimeout(() => {
					markerImg.style.transform = 'scale3d(1, 1, 1)';
				}, 300);
			});
		});
	}

	hideEffect(marker) {
		const container = marker.getElement().querySelector('.effect-container');
		const markerImg = marker.getElement().querySelector('img');

		container.style.transform = 'translateX(-50%) scale(0)';
		container.style.opacity = '0';

		markerImg.style.transform = 'scale(0.8)';
		setTimeout(() => {
			markerImg.style.transform = 'scale(1)';
		}, 300);

		setTimeout(() => {
			container.style.display = 'none';
		}, 300);
	}

	getEffectContent(type) {
		const effectMap = {
			fight: '⚔️',
			merchant: '💰',
			rest: '💤',
			conversation: '💬',
			loot: '💎',
			walk: '👣',
			question: '❓',
		};
		return effectMap[type] || '👣';
	}
}

// Handles the text recap modal
class PathAnimationRecap {
	constructor() {
		this.isModalCollapsed = window.innerWidth < 768;
		// Create the modal but don't update state yet
		this.textModal = null;
		this.initialize();
	}

	initialize() {
		this.textModal = this.createTextModal();
		// Now that the DOM elements exist, we can update the state
		this.updateModalState();
	}

	createTextModal() {
		const modal = L.DomUtil.create('div', 'path-text-modal');
		const header = L.DomUtil.create('div', 'path-text-header', modal);

		const title = L.DomUtil.create('span', 'path-text-title', header);
		title.textContent = 'Recap so far';

		const toggleButton = L.DomUtil.create('button', 'path-text-toggle', header);
		toggleButton.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 9l6 6l6 -6"></path></svg>';

		const listContainer = L.DomUtil.create('div', 'path-text-list-container', modal);
		const list = L.DomUtil.create('ul', 'path-text-list', listContainer);

		header.addEventListener('click', () => this.toggleModal());

		// Make sure the leaflet container exists
		const leafletContainer = document.querySelector('.leaflet-container');
		if (!leafletContainer) {
			console.error('Leaflet container not found');
			return modal;
		}

		leafletContainer.appendChild(modal);
		return modal;
	}

	toggleModal() {
		if (!this.textModal) return;
		this.isModalCollapsed = !this.isModalCollapsed;
		this.updateModalState();
	}

	updateModalState() {
		if (!this.textModal) return;
		const listContainer = this.textModal.querySelector('.path-text-list-container');
		const toggleButton = this.textModal.querySelector('.path-text-toggle');

		if (!listContainer || !toggleButton) return;

		if (this.isModalCollapsed) {
			toggleButton.style.transform = 'rotate(-90deg)';
			this.textModal.style.transform = 'translateY(calc(100% - 45px))';
			listContainer.style.display = 'none';
		} else {
			toggleButton.style.transform = 'rotate(0deg)';
			this.textModal.style.transform = 'translateY(0)';
			listContainer.style.display = 'block';
		}
	}

	addText(text, type, loot, level) {
		if (!this.textModal) return;
		const list = this.textModal.querySelector('.path-text-list');
		if (!list) return;

		const listItem = document.createElement('li');
		listItem.classList.add('path-text-item');

		let icon = '';
		switch (type) {
			case 'fight':
				icon = '⚔️';
				break;
			case 'merchant':
				icon = '💰';
				break;
			case 'rest':
				icon = '💤';
				break;
			case 'conversation':
				icon = '💬';
				break;
			case 'loot':
				icon = '💎';
				break;
			case 'question':
				icon = '❓';
				break;
			default:
				icon = '👣';
		}

		listItem.innerHTML = `<div class="path-item-row">
            <span class="path-text">${text}</span>
            <span class="path-event-icon">${icon}</span>
        </div>`;

		if (loot || level) {
			const itemRow = document.createElement('div');
			itemRow.className = 'path-item-column';

			if (loot) {
				const lootContainer = document.createElement('div');
				lootContainer.className = 'path-item-loot-container';
				lootContainer.innerHTML = '<span class="path-item-loot-title">New loot</span>';

				loot.forEach((item) => {
					const itemContainer = document.createElement('div');
					itemContainer.className = 'path-item-loot-container-item';
					itemContainer.innerHTML = `<div class="loot-item-icon icon-${item?.rarity ?? 'common'}"></div>
                        <span class='loot-item rarity-${item?.rarity ?? 'common'}' title='${
						item?.description ?? 'No description.'
					}'>${item.name}</span>`;
					lootContainer.append(itemContainer);
				});

				itemRow.append(lootContainer);
			}

			if (level) {
				itemRow.insertAdjacentHTML(
					'beforeEnd',
					`<span class="path-item-level">Reached <strong>level ${level}!</strong></span>`
				);
			}

			listItem.append(itemRow);
		}

		list.appendChild(listItem);

		if (list.children.length === 1) {
			this.textModal.style.display = 'block';
		}

		list.scrollTo({ left: 0, top: list.scrollHeight, behavior: 'smooth' });
	}

	clear() {
		if (!this.textModal) return;
		const list = this.textModal.querySelector('.path-text-list');
		if (!list) return;

		list.innerHTML = '';
		this.textModal.style.display = 'none';
	}
}

// Handles position interpolation
class PathAnimationInterpolator {
	constructor() {
		this.pathDistanceCache = new Map();
	}

	calculatePathDistance(points) {
		const cacheKey = points.map((p) => p.toString()).join('|');
		if (this.pathDistanceCache.has(cacheKey)) {
			return this.pathDistanceCache.get(cacheKey);
		}

		let distance = 0;
		for (let i = 0; i < points.length - 1; i++) {
			const p1 = L.latLng(points[i]);
			const p2 = L.latLng(points[i + 1]);
			distance += p1.distanceTo(p2);
		}

		this.pathDistanceCache.set(cacheKey, distance);
		return distance;
	}

	interpolatePosition(points, percentage) {
		if (percentage >= 0.99) {
			const lastPoint = points[points.length - 1];
			return {
				position: lastPoint.coordinates,
				animation: lastPoint.animation,
				text: lastPoint.text,
				filter: lastPoint.filter,
				level: lastPoint.level,
				loot: lastPoint.loot,
				lights: lastPoint.lights,
				overlays: lastPoint.overlays,
			};
		}

		const totalDistance = this.calculatePathDistance(points.map((p) => p.coordinates));
		const targetDistance = totalDistance * percentage;

		let currentDistance = 0;
		let lastPassedPoint = points[0];
		let currentOverlays = lastPassedPoint.overlays; // Add this line

		const len = points.length - 1;
		for (let i = 0; i < len; i++) {
			const p1 = L.latLng(points[i].coordinates);
			const p2 = L.latLng(points[i + 1].coordinates);
			const segmentDistance = p1.distanceTo(p2);

			if (currentDistance + segmentDistance >= targetDistance) {
				const ratio = (targetDistance - currentDistance) / segmentDistance;

				return {
					position: [p1.lat + (p2.lat - p1.lat) * ratio, p1.lng + (p2.lng - p1.lng) * ratio],
					animation: ratio < 0.01 ? points[i].animation : ratio > 0.99 ? points[i + 1].animation : points[i].animation,
					text: points[i].text,
					filter: points[i].filter || lastPassedPoint.filter,
					loot: points[i]?.loot ?? null,
					level: points[i]?.level ?? null,
					lights: points[i].lights || lastPassedPoint.lights,
					overlays: currentOverlays, // Add this line
				};
			}

			currentDistance += segmentDistance;
			if (points[i].filter !== undefined) {
				lastPassedPoint = points[i];
			}

			if (points[i].lights !== undefined) {
				lastPassedPoint = points[i];
			}

			if (points[i].overlays !== undefined) {
				currentOverlays = points[i].overlays;
			}
		}

		const lastPoint = points[points.length - 1];
		return {
			position: lastPoint.coordinates,
			animation: lastPoint.animation,
			text: lastPoint.text,
			filter: lastPoint.filter,
			level: lastPoint.level,
			loot: lastPoint.loot,
			lights: lastPoint.lights,
			overlays: lastPoint.overlays,
		};
	}
}

// Main controller class that coordinates everything
class PathAnimationControl {
	constructor(map) {
		this.map = map;
		this.animations = new Map();
		this.markers = new Map();
		this.currentPoints = new Map();
		this.pathVisibility = new Map();
		this.isAnimating = new Map();
		this.passedPoints = new Map();
		this.initialFilters = new Map(); // Store initial filters for reset
		this.currentLights = new Map(); // Track current lights for each path

		this.markerManager = new PathAnimationMarker();
		this.recapManager = new PathAnimationRecap();
		this.interpolator = new PathAnimationInterpolator();
		this.filterManager = new MapFilterManager(map);

		this.currentOverlays = new Map(); // Track current overlays for each path
	}

	updateOverlays(overlayNames) {
		if (!this.map.layerGroups?.overlays?.layers) return;

		// Get all overlay layers
		const overlayLayers = this.map.layerGroups.overlays.layers;

		// Hide all overlays first
		Object.entries(overlayLayers).forEach(([name, layer]) => {
			if (this.map.hasLayer(layer)) {
				this.map.removeLayer(layer);
			}
		});

		// Show requested overlays
		if (Array.isArray(overlayNames) && overlayNames.length > 0) {
			overlayNames.forEach((name) => {
				const layer = overlayLayers[name];
				if (layer && !this.map.hasLayer(layer)) {
					this.map.addLayer(layer);
				}
			});
		}
	}

	createAnimation(pathId, points, duration = 5000) {
		const marker = this.markerManager.createMarker([points[0].coordinates[0], points[0].coordinates[1]]);

		// Store initial filters if present in first point
		if (points[0].filter) {
			this.initialFilters.set(pathId, Array.isArray(points[0].filter) ? points[0].filter : [points[0].filter]);
		}

		this.markers.set(pathId, marker);
		this.currentPoints.set(pathId, points);

		if (this.pathVisibility.get(pathId)) {
			this.startAnimation(pathId, points, duration);
		}

		return marker;
	}

	startAnimation(pathId, points, duration) {
		if (this.isAnimating.get(pathId)) return;

		this.isAnimating.set(pathId, true);
		const marker = this.markers.get(pathId);
		let currentFilters = null;
		let currentOverlays = null;

		// Apply initial filters if they exist
		if (this.initialFilters.has(pathId)) {
			this.filterManager.setFilters(this.initialFilters.get(pathId));
			currentFilters = this.initialFilters.get(pathId);
		}

		if (!this.passedPoints.has(pathId)) {
			this.passedPoints.set(pathId, new Set());
		}

		if (marker && !this.map.hasLayer(marker)) {
			marker.addTo(this.map);
		}

		let startTime = null;
		let pauseStartTime = null;
		let totalPausedTime = 0;
		let currentAnimation = null;
		let hasReachedEnd = false;
		let lastFrameTime = 0;

		const animate = (timestamp) => {
			if (timestamp - lastFrameTime < 16.67) {
				const animationId = requestAnimationFrame(animate);
				this.animations.set(pathId, animationId);
				return;
			}
			lastFrameTime = timestamp;

			if (!this.pathVisibility.get(pathId) || !this.isAnimating.get(pathId)) {
				this.stopAnimation(pathId);
				return;
			}

			if (!startTime) startTime = timestamp;

			if (pauseStartTime !== null) {
				const pauseDuration = (currentAnimation?.timer || 0) * 1000;
				if (timestamp - pauseStartTime < pauseDuration) {
					const animationId = requestAnimationFrame(animate);
					this.animations.set(pathId, animationId);
					return;
				}
				totalPausedTime += timestamp - pauseStartTime;
				pauseStartTime = null;
			}

			const effectiveTime = timestamp - startTime - totalPausedTime;
			let progress = ((effectiveTime % duration) / duration) * 1;

			if (progress > 0.99 && !hasReachedEnd) {
				progress = 1.0;
				hasReachedEnd = true;
			}

			const interpolated = this.interpolator.interpolatePosition(points, progress);

			if (marker) {
				marker.setLatLng(interpolated.position);

				if (interpolated.filter !== undefined && !this.areFiltersEqual(currentFilters, interpolated.filter)) {
					this.updateFilter(currentFilters, interpolated.filter);
					currentFilters =
						interpolated.filter === null
							? null
							: Array.isArray(interpolated.filter)
							? interpolated.filter
							: [interpolated.filter];
				}

				this.updateLights(interpolated, pathId);

				// Handle overlay updates
				if (interpolated.overlays !== undefined && !this.areOverlaysEqual(currentOverlays, interpolated.overlays)) {
					this.updateOverlays(interpolated.overlays);
					currentOverlays = interpolated.overlays;
					this.currentOverlays.set(pathId, currentOverlays);
				}

				if (interpolated.animation && interpolated.animation !== currentAnimation) {
					if (interpolated.animation.timer && pauseStartTime === null) {
						pauseStartTime = timestamp;
					}

					if (interpolated.animation.type) {
						this.markerManager.showEffect(marker, interpolated.animation.type);
						setTimeout(() => {
							this.markerManager.hideEffect(marker);
						}, (interpolated.animation.timer || 1) * 1000);
					}

					currentAnimation = interpolated.animation;
				}

				if (interpolated.text && !this.passedPoints.get(pathId).has(interpolated.text)) {
					this.passedPoints.get(pathId).add(interpolated.text);
					this.recapManager.addText(
						interpolated.text,
						interpolated.animation?.type,
						interpolated?.loot,
						interpolated?.level
					);
				}
			}

			const animationId = requestAnimationFrame(animate);
			this.animations.set(pathId, animationId);
		};

		const animationId = requestAnimationFrame(animate);
		this.animations.set(pathId, animationId);
	}

	areOverlaysEqual(current, next) {
		if (!current && !next) return true;
		if (!current || !next) return false;
		return current.length === next.length && current.every((name) => next.includes(name));
	}

	areFiltersEqual(current, next) {
		if (current === next) return true;
		if (current === null || next === null) return false;

		const currentArray = Array.isArray(current) ? current : [current];
		const nextArray = Array.isArray(next) ? next : [next];

		return currentArray.length === nextArray.length && currentArray.every((filter) => nextArray.includes(filter));
	}

	updateFilter(currentFilters, newFilters) {
		if (newFilters === null) {
			this.filterManager.clearFilters();
		} else {
			const newFilterArray = Array.isArray(newFilters) ? newFilters : [newFilters];
			this.filterManager.setFilters(newFilterArray);
		}
	}

	updateLights(interpolated, pathId) {
		if (interpolated.lights !== undefined) {
			this.filterManager.updateLights(interpolated.lights);
			// Store current lights configuration
			this.currentLights.set(pathId, interpolated.lights);
		}
	}

	stopAnimation(pathId) {
		this.isAnimating.set(pathId, false);

		if (this.animations.has(pathId)) {
			cancelAnimationFrame(this.animations.get(pathId));
			this.animations.delete(pathId);
		}

		if (this.markers.has(pathId)) {
			const marker = this.markers.get(pathId);
			if (marker && this.map.hasLayer(marker)) {
				marker.remove();
			}
		}

		// Reset to initial filters if they exist, otherwise clear
		if (this.initialFilters.has(pathId)) {
			this.filterManager.setFilters(this.initialFilters.get(pathId));
		} else {
			this.filterManager.clearFilters();
		}

		// Clear lights associated with this path
		if (this.currentLights.has(pathId)) {
			this.filterManager.clearLights();
			this.currentLights.delete(pathId);
		}

		if (this.currentOverlays.has(pathId)) {
			this.updateOverlays([]);
			this.currentOverlays.delete(pathId);
		}
	}

	updateAnimationVisibility(pathId, visible) {
		this.pathVisibility.set(pathId, visible);

		if (visible) {
			const points = this.currentPoints.get(pathId);
			if (points) {
				const duration = Math.max(5000, points.length * 1000);
				if (this.markers.has(pathId)) {
					this.recapManager.clear();
					this.startAnimation(pathId, points, duration);
				} else {
					this.createAnimation(pathId, points, duration);
				}
			}
		} else {
			this.stopAnimation(pathId);
			this.recapManager.clear();
		}
	}
}
