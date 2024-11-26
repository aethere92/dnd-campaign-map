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
			listContainer.style.maxHeight = '0';
			toggleButton.style.transform = 'rotate(-90deg)';
		} else {
			listContainer.style.maxHeight = '350px';
			toggleButton.style.transform = 'rotate(0deg)';
		}

		return modal;
	}

	toggleModal() {
		this.isModalCollapsed = !this.isModalCollapsed;
		const listContainer = this.textModal.querySelector('.path-text-list-container');
		const toggleButton = this.textModal.querySelector('.path-text-toggle');

		if (this.isModalCollapsed) {
			listContainer.style.maxHeight = '0';
			toggleButton.style.transform = 'rotate(-90deg)';
			listContainer.style.display = 'none';
		} else {
			listContainer.style.maxHeight = '350px';
			toggleButton.style.transform = 'rotate(0deg)';
			listContainer.style.display = 'block';
		}
	}

	updateModalState() {
		const listContainer = this.textModal.querySelector('.path-text-list-container');
		const toggleButton = this.textModal.querySelector('.path-text-toggle');

		if (this.isModalCollapsed) {
			listContainer.style.maxHeight = '0';
			toggleButton.style.transform = 'rotate(-90deg)';
			this.textModal.style.transform = 'translateY(calc(100% - 45px))';
			listContainer.style.display = 'none';
		} else {
			listContainer.style.maxHeight = '350px';
			toggleButton.style.transform = 'rotate(0deg)';
			this.textModal.style.transform = 'translateY(0)';
			listContainer.style.display = 'block';
		}
	}

	addTextToModal(text, pathId, animationType) {
		const list = this.textModal.querySelector('.path-text-list');
		const listItem = document.createElement('li');
		listItem.classList.add('path-text-item');

		// Add icon based on animation type
		let icon = '';
		switch (animationType) {
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

		listItem.innerHTML = `<span class="path-text">${text}</span><span class="path-event-icon">${icon}</span>`;
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
		const container = marker.getElement().querySelector('.effect-container');
		const markerImg = marker.getElement().querySelector('img');

		// Bounce animation for marker
		markerImg.style.transform = 'scale(1.2)';
		setTimeout(() => {
			markerImg.style.transform = 'scale(1)';
		}, 300);

		let effectContent = '';
		switch (type) {
			case 'fight':
				effectContent = '⚔️';
				break;
			case 'merchant':
				effectContent = '💰';
				break;
			case 'rest':
				effectContent = '💤';
				break;
			case 'conversation':
				effectContent = '💬';
				break;
			case 'loot':
				effectContent = '💎';
				break;
			case 'walk':
				effectContent = '👣';
				break;
			case 'question':
				effectContent = '❓';
				break;
		}

		container.textContent = effectContent;
		container.style.display = 'block';

		// Animated appearance
		setTimeout(() => {
			container.style.transform = 'translateX(-50%) scale(1)';
			container.style.opacity = '1';
		}, 50);
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
		let distance = 0;
		for (let i = 0; i < points.length - 1; i++) {
			const p1 = L.latLng(points[i]);
			const p2 = L.latLng(points[i + 1]);
			distance += p1.distanceTo(p2);
		}
		return distance;
	}

	interpolatePosition(points, percentage) {
		// Handle exact end point
		if (Math.abs(percentage - 1) < 0.01) {
			const lastPoint = points[points.length - 1];
			return {
				position: lastPoint.coordinates,
				animationInfo: lastPoint.animationInfo,
				text: lastPoint.text,
				filter: lastPoint.filter,
			};
		}

		const totalDistance = this.calculatePathDistance(points.map((p) => p.coordinates));
		const targetDistance = totalDistance * percentage;

		let currentDistance = 0;
		let lastPassedPoint = points[0]; // Keep track of the last point we passed

		for (let i = 0; i < points.length - 1; i++) {
			const p1 = L.latLng(points[i].coordinates);
			const p2 = L.latLng(points[i + 1].coordinates);
			const segmentDistance = p1.distanceTo(p2);

			if (currentDistance + segmentDistance >= targetDistance) {
				const remainingDistance = targetDistance - currentDistance;
				const ratio = remainingDistance / segmentDistance;

				const lat = p1.lat + (p2.lat - p1.lat) * ratio;
				const lng = p1.lng + (p2.lng - p1.lng) * ratio;

				// Check if we're closer to the start or end of this segment
				const nearPoint =
					Math.abs(ratio - 0) < 0.01 ? points[i] : Math.abs(ratio - 1) < 0.01 ? points[i + 1] : points[i]; // Use the last passed point's filter

				return {
					position: [lat, lng],
					animationInfo: nearPoint?.animationInfo,
					text: nearPoint?.text,
					filter: nearPoint?.filter || lastPassedPoint.filter, // Use the last valid filter
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
			animationInfo: lastPoint.animationInfo,
			text: lastPoint.text,
			filter: lastPoint.filter,
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
		let currentAnimationInfo = null;
		let hasReachedEnd = false;

		const animate = (timestamp) => {
			if (!this.pathVisibility.get(pathId) || !this.isAnimating.get(pathId)) {
				this.stopAnimation(pathId);
				return;
			}

			if (!startTime) startTime = timestamp;

			if (pauseStartTime !== null) {
				const currentPauseTime = timestamp - pauseStartTime;
				if (currentPauseTime < (currentAnimationInfo?.waitTimer || 0) * 1000) {
					const animationId = requestAnimationFrame(animate);
					this.animations.set(pathId, animationId);
					return;
				} else {
					totalPausedTime += currentPauseTime;
					pauseStartTime = null;
				}
			}

			const effectiveTime = timestamp - startTime - totalPausedTime;
			let progress = (effectiveTime % duration) / duration;

			if (progress > 0.99 && !hasReachedEnd) {
				progress = 1.0;
				hasReachedEnd = true;
			}

			const { position, animationInfo, text, filter } = this.interpolatePosition(points, progress);

			if (marker) {
				marker.setLatLng(position);

				// Handle filter changes
				if (filter !== currentFilter) {
					console.log('Changing filter:', filter); // Debug log
					if (currentFilter) {
						this.filterManager.applyFilter({
							mode: currentFilter,
							enabled: false,
						});
					}
					if (filter) {
						this.filterManager.applyFilter({
							mode: filter,
							enabled: true,
						});
					}
					currentFilter = filter;
				}

				if (text && !this.passedPoints.get(pathId).has(text)) {
					this.passedPoints.get(pathId).add(text);
					this.addTextToModal(text, pathId, animationInfo?.animationType);
				}

				if (animationInfo && animationInfo !== currentAnimationInfo) {
					currentAnimationInfo = animationInfo;

					if (animationInfo.waitTimer) {
						pauseStartTime = timestamp;
					}

					if (animationInfo.animationType) {
						this.showEffect(marker, animationInfo.animationType);
						setTimeout(() => {
							this.hideEffect(marker);
						}, (animationInfo.waitTimer || 1) * 1000);
					}
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
