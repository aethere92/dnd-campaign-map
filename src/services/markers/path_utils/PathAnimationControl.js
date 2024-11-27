class PathAnimationControl {
	constructor(map) {
		this.map = map;
		this.animations = new Map();
		this.markers = new Map();
		this.currentPoints = new Map();
		this.pathVisibility = new Map();
		this.isAnimating = new Map();
		this.effects = new Map();
		this.passedPoints = new Map(); // Track points that have been passed
		this.textModal = this.createTextModal();
		this.isModalCollapsed = window.innerWidth < 768; // Collapsed by default on mobile
		this.filterManager = new MapFilterManager(map);
		this.currentFilter = null;

		// Cache for path distance calculations
		this.pathDistanceCache = new Map();
		// Cache for DOM elements to avoid repeated queries
		this.domCache = new Map();
		// Use performance.now() for more precise timing
		this.performanceOffset = performance.timing.navigationStart + performance.now();
	}

	createMarker() {
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

	createTextModal() {
		// Create modal container
		const modal = L.DomUtil.create('div', 'path-text-modal');
		const header = L.DomUtil.create('div', 'path-text-header', modal);

		const title = L.DomUtil.create('span', 'path-text-title', header);
		title.textContent = 'Recap so far';

		const toggleButton = L.DomUtil.create('button', 'path-text-toggle', header);
		toggleButton.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 9l6 6l6 -6"></path></svg>';

		// Create list container
		const listContainer = L.DomUtil.create('div', 'path-text-list-container', modal);

		// Create list container
		const list = L.DomUtil.create('ul', 'path-text-list', listContainer);

		// Add click handler for toggle
		header.addEventListener('click', () => this.toggleModal());

		document.querySelector('.leaflet-container').appendChild(modal);

		// Initialize the state after the modal is fully created
		if (this.isModalCollapsed) {
			toggleButton.style.transform = 'rotate(-90deg)';
		} else {
			toggleButton.style.transform = 'rotate(0deg)';
		}

		return modal;
	}

	toggleModal() {
		this.isModalCollapsed = !this.isModalCollapsed;
		const listContainer = this.textModal.querySelector('.path-text-list-container');
		const toggleButton = this.textModal.querySelector('.path-text-toggle');

		if (this.isModalCollapsed) {
			toggleButton.style.transform = 'rotate(-90deg)';
			listContainer.style.display = 'none';
		} else {
			toggleButton.style.transform = 'rotate(0deg)';
			listContainer.style.display = 'block';
		}
	}

	updateModalState() {
		const listContainer = this.textModal.querySelector('.path-text-list-container');
		const toggleButton = this.textModal.querySelector('.path-text-toggle');

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

	addTextToModal(text, pathId, type, loot, level) {
		const list = this.textModal.querySelector('.path-text-list');
		const listItem = document.createElement('li');
		listItem.classList.add('path-text-item');

		// Add icon based on animation type
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
						<span class='loot-item rarity-${item?.rarity ?? 'common'}' title='${item?.description ?? 'No description.'}'>${
						item.name
					}</span>`;

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

		// Show modal if it's the first item
		if (list.children.length === 1) {
			this.textModal.style.display = 'block';
		}

		list.scrollTo({ left: 0, top: list.scrollHeight, behavior: 'smooth' });
	}

	clearTextModal(pathId) {
		const list = this.textModal.querySelector('.path-text-list');
		list.innerHTML = '';
		this.passedPoints.set(pathId, new Set());
		this.textModal.style.display = 'none';
	}

	showEffect(marker, type) {
		// Cache DOM elements
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

		// Use CSS transform instead of scale for better performance
		markerImg.style.transform = 'scale3d(1.2, 1.2, 1)';

		// Use requestAnimationFrame for smoother animations
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

	// Cache effect content
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

	hideEffect(marker) {
		const container = marker.getElement().querySelector('.effect-container');
		const markerImg = marker.getElement().querySelector('img');

		// Fade out animation
		container.style.transform = 'translateX(-50%) scale(0)';
		container.style.opacity = '0';

		// Bounce animation for marker
		markerImg.style.transform = 'scale(0.8)';
		setTimeout(() => {
			markerImg.style.transform = 'scale(1)';
		}, 300);

		// Clean up after animation
		setTimeout(() => {
			container.style.display = 'none';
		}, 300);
	}

	calculatePathDistance(points) {
		// Cache path distance calculations
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
		// Quick return for end points
		if (percentage >= 0.99) {
			const lastPoint = points[points.length - 1];
			return {
				position: lastPoint.coordinates,
				animation: lastPoint.animation,
				text: lastPoint.text,
				filter: lastPoint.filter,
				level: lastPoint.level,
				loot: lastPoint.loot,
			};
		}

		const totalDistance = this.calculatePathDistance(points.map((p) => p.coordinates));
		const targetDistance = totalDistance * percentage;

		let currentDistance = 0;
		let lastPassedPoint = points[0];

		// Use a more efficient loop
		const len = points.length - 1;
		for (let i = 0; i < len; i++) {
			const p1 = L.latLng(points[i].coordinates);
			const p2 = L.latLng(points[i + 1].coordinates);
			const segmentDistance = p1.distanceTo(p2);

			if (currentDistance + segmentDistance >= targetDistance) {
				const ratio = (targetDistance - currentDistance) / segmentDistance;

				// Use more efficient calculations
				return {
					position: [p1.lat + (p2.lat - p1.lat) * ratio, p1.lng + (p2.lng - p1.lng) * ratio],
					animation: ratio < 0.01 ? points[i].animation : ratio > 0.99 ? points[i + 1].animation : points[i].animation,
					text: points[i].text,
					filter: points[i].filter || lastPassedPoint.filter,
					loot: points[i]?.loot ?? null,
					level: points[i]?.level ?? null,
				};
			}

			currentDistance += segmentDistance;
			if (points[i].filter !== undefined) {
				lastPassedPoint = points[i];
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
		};
	}

	createAnimation(pathId, points, duration = 5000) {
		const marker = L.marker([points[0].coordinates[0], points[0].coordinates[1]], {
			icon: this.createMarker(),
			interactive: false,
			zIndexOffset: 1000,
		});

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
		let currentFilter = null;

		if (!this.passedPoints.has(pathId)) {
			this.passedPoints.set(pathId, new Set());
		}

		if (marker && !this.map.hasLayer(marker)) {
			marker.addTo(this.map);
		}

		let startTime = null;
		let pauseStartTime = null;
		let totalPausedTime = 0;
		let currentanimation = null;
		let hasReachedEnd = false;
		let lastFrameTime = 0;

		const animate = (timestamp) => {
			// Throttle to 60fps
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

			// Fixed pause timing logic
			if (pauseStartTime !== null) {
				const pauseDuration = (currentanimation?.timer || 0) * 1000;
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

			const interpolated = this.interpolatePosition(points, progress);

			if (marker) {
				marker.setLatLng(interpolated.position);

				if (interpolated.filter !== currentFilter) {
					this.updateFilter(currentFilter, interpolated.filter);
					currentFilter = interpolated.filter;
				}

				// Check for new animation info and handle pausing
				if (interpolated.animation && interpolated.animation !== currentanimation) {
					if (interpolated.animation.timer && pauseStartTime === null) {
						pauseStartTime = timestamp;
					}

					if (interpolated.animation.type) {
						this.showEffect(marker, interpolated.animation.type);
						setTimeout(() => {
							this.hideEffect(marker);
						}, (interpolated.animation.timer || 1) * 1000);
					}

					currentanimation = interpolated.animation;
				}

				// Handle text updates
				if (interpolated.text && !this.passedPoints.get(pathId).has(interpolated.text)) {
					this.passedPoints.get(pathId).add(interpolated.text);
					this.addTextToModal(
						interpolated.text,
						pathId,
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

		// Clear any active filters
		this.filterManager.clearFilters();
	}

	updateFilter(currentFilter, newFilter) {
		if (currentFilter) {
			this.filterManager.applyFilter({
				mode: currentFilter,
				enabled: false,
			});
		}
		if (newFilter) {
			this.filterManager.applyFilter({
				mode: newFilter,
				enabled: true,
			});
		}
	}

	updateTextAndEffects(pathId, marker, interpolated, currentanimation, timestamp) {
		const { text, animation } = interpolated;
		const passedPoints = this.passedPoints.get(pathId);

		if (text && !passedPoints.has(text)) {
			passedPoints.add(text);
			this.addTextToModal(text, pathId, animation?.type);
		}

		if (animation && animation !== currentanimation) {
			if (animation.timer) {
				this.pauseStartTime = timestamp;
			}

			if (animation.type) {
				this.showEffect(marker, animation.type);
				setTimeout(() => {
					this.hideEffect(marker);
				}, (animation.timer || 1) * 1000);
			}
		}
	}

	updateAnimationVisibility(pathId, visible) {
		this.pathVisibility.set(pathId, visible);

		if (visible) {
			const points = this.currentPoints.get(pathId);
			if (points) {
				const duration = Math.max(5000, points.length * 1000);
				if (this.markers.has(pathId)) {
					this.clearTextModal(pathId); // Clear modal when starting new animation
					this.startAnimation(pathId, points, duration);
				} else {
					this.createAnimation(pathId, points, duration);
				}
			}
		} else {
			this.stopAnimation(pathId);
			this.clearTextModal(pathId); // Clear modal when hiding animation
		}
	}
}
