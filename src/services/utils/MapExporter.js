class ExportModal {
	#modal;

	constructor() {
		this.#modal = this.#createModal();
	}

	#createModal() {
		const modal = document.createElement('div');
		modal.style.cssText = `
		  position: fixed;
		  top: 50%;
		  left: 50%;
		  transform: translate(-50%, -50%);
		  background: white;
		  padding: 20px;
		  border-radius: 5px;
		  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
		  z-index: 1000;
		  display: none;
		  font-family: system-ui;
		  font-size: 10pt;
		`;
		document.body.appendChild(modal);
		return modal;
	}

	show(message) {
		this.#modal.textContent = message;
		this.#modal.style.display = 'block';
	}

	hide() {
		this.#modal.style.display = 'none';
	}

	destroy() {
		this.#modal.remove();
	}
}

class MapExporter {
	static async exportMap(map, config) {
		const exportModal = new ExportModal();
		const currentState = {
			zoom: map.getZoom(),
			center: map.getCenter(),
		};

		try {
			exportModal.show('Preparing map for export...');
			await this.#setMapForExport(map, config.exportZoom);
			const canvas = await this.#captureMap(map, config, exportModal);
			this.#downloadImage(canvas);
		} catch (error) {
			console.error('Error exporting map:', error);
			alert('Failed to export map. Please try again.');
		} finally {
			map.setView(currentState.center, currentState.zoom);
			exportModal.hide();
			exportModal.destroy();
		}
	}

	static async #setMapForExport(map, exportZoom) {
		return new Promise((resolve) => {
			map.setZoom(exportZoom);
			map.panTo(map.getBounds().getCenter());

			// Force a re-render of all tiles
			map.eachLayer((layer) => {
				if (layer instanceof L.TileLayer) {
					layer.redraw();
				}
			});

			// Wait for all tiles to load
			const checkTilesLoaded = setInterval(() => {
				if (this.#allTilesLoaded(map)) {
					clearInterval(checkTilesLoaded);
					resolve();
				}
			}, 100);
		});
	}

	static async #captureMap(map, config, exportModal) {
		const scale = Math.pow(2, config.metadata.sizes.maxZoom - config.exportZoom);
		let canvasWidth = config.metadata.sizes.imageWidth / scale;
		let canvasHeight = config.metadata.sizes.imageHeight / scale;

		const { width, height } = this.#calculateA4Dimensions(canvasWidth, canvasHeight);
		canvasWidth = width;
		canvasHeight = height;

		const canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		const ctx = canvas.getContext('2d');

		// Fill background
		ctx.fillStyle = document.getElementById('map').style.background || CONFIG.MAP.DEFAULT_BACKGROUND;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		const tileSize = CONFIG.TILE_SIZE;
		const tilesX = Math.ceil(config.metadata.sizes.imageWidth / scale / tileSize);
		const tilesY = Math.ceil(config.metadata.sizes.imageHeight / scale / tileSize);

		// Calculate offset to center the original content
		const offsetX = (canvasWidth - config.metadata.sizes.imageWidth / scale) / 2;
		const offsetY = (canvasHeight - config.metadata.sizes.imageHeight / scale) / 2;

		await this.#renderTiles(ctx, tilesX, tilesY, config, scale, offsetX, offsetY, exportModal);
		await this.#renderMarkers(ctx, map, scale, config.exportZoom, offsetX, offsetY);

		return canvas;
	}

	static #calculateA4Dimensions(width, height) {
		const isLandscape = width > height;
		const targetAspectRatio = isLandscape ? Math.sqrt(2) : 1 / Math.sqrt(2);
		const currentAspectRatio = width / height;

		if (isLandscape) {
			if (currentAspectRatio > targetAspectRatio) {
				height = width / targetAspectRatio;
			} else {
				width = height * targetAspectRatio;
			}
		} else {
			if (currentAspectRatio < targetAspectRatio) {
				width = height * targetAspectRatio;
			} else {
				height = width / targetAspectRatio;
			}
		}

		return {
			width: Math.round(width),
			height: Math.round(height),
		};
	}

	static async #renderTiles(ctx, tilesX, tilesY, config, scale, offsetX, offsetY, exportModal) {
		let loadedTiles = 0;
		const totalTiles = tilesX * tilesY;

		for (let y = 0; y < tilesY; y++) {
			for (let x = 0; x < tilesX; x++) {
				try {
					const tile = await this.#loadTile(x, y, config.exportZoom, config.metadata.path);
					ctx.drawImage(tile, x * CONFIG.TILE_SIZE + offsetX, y * CONFIG.TILE_SIZE + offsetY);
					loadedTiles++;
					exportModal.show(`Exporting map... ${((loadedTiles / totalTiles) * 100).toFixed(1)}% complete`);
				} catch (error) {
					console.error(`Failed to load tile at x: ${x}, y: ${y}`, error);
				}
			}
		}
	}

	static async #renderMarkers(ctx, map, scale, exportZoom, offsetX, offsetY) {
		const markers = [];
		map.eachLayer((layer) => {
			if (layer instanceof L.Marker) {
				markers.push(layer);
			}
		});

		await Promise.all(
			markers.map(async (marker) => {
				try {
					await this.#renderCustomMarker(ctx, marker, 1 / scale, exportZoom, offsetX, offsetY);
				} catch (error) {
					console.error('Failed to render marker:', error);
				}
			})
		);
	}

	static async #renderCustomMarker(ctx, marker, scale, exportZoom, offsetX, offsetY) {
		const markerLatLng = marker.getLatLng();
		const point = marker._map.project(markerLatLng, exportZoom);

		const x = Math.round(point.x) + offsetX;
		const y = Math.round(point.y) + offsetY;

		const icon = marker.options.icon;
		if (icon instanceof L.DivIcon) {
			const iconElement = document.createElement('div');
			iconElement.innerHTML = icon.options.html.trim();
			const imgElement = iconElement.querySelector('img');
			const iconText = iconElement.querySelector('.custom-icon-image');

			if (imgElement) {
				const iconImg = await this.#renderDivIconToImage(icon);

				if (iconImg) {
					const iconWidth = iconImg.width * scale;
					const iconHeight = iconImg.height * scale;
					const iconX = x - (icon.options.iconAnchor ? icon.options.iconAnchor[0] * scale : iconWidth / 2);
					const iconY = y - (icon.options.iconAnchor ? icon.options.iconAnchor[1] * scale : iconHeight / 2);

					ctx.drawImage(iconImg, iconX, iconY, iconWidth, iconHeight);

					if (iconText) {
						const label = iconText.getAttribute('data-label');
						if (label) {
							await this.#renderMarkerLabel(ctx, label, x, y, iconHeight, scale);
						}
					}
				}
			}
		}
	}

	static async #renderMarkerLabel(ctx, label, x, y, iconHeight, scale) {
		const fontSize = Math.max(16 * scale, CONFIG.EXPORT.MIN_FONT_SIZE);
		ctx.font = `${fontSize}pt Arial`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';

		const textMetrics = ctx.measureText(label);
		const textHeight = fontSize * 1.2;
		const padding = 4 * scale;

		const bgWidth = textMetrics.width + padding * 2;
		const bgHeight = textHeight + padding * 2;
		const textX = x;
		const textY = y + iconHeight / 2 + 6 * scale;
		const bgX = textX - bgWidth / 2;
		const bgY = textY;

		// Draw rounded rectangle background
		ctx.fillStyle = 'rgba(231, 218, 187, 0.9)';
		const radius = 4 * scale;
		ctx.beginPath();
		ctx.moveTo(bgX + radius, bgY);
		ctx.lineTo(bgX + bgWidth - radius, bgY);
		ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
		ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
		ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - radius, bgY + bgHeight);
		ctx.lineTo(bgX + radius, bgY + bgHeight);
		ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
		ctx.lineTo(bgX, bgY + radius);
		ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
		ctx.closePath();
		ctx.fill();

		// Draw text
		ctx.fillStyle = 'black';
		ctx.fillText(label, textX, textY + padding);
	}

	static async #renderDivIconToImage(icon) {
		return new Promise((resolve, reject) => {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = icon.options.html.trim();
			const iconElement = tempDiv.querySelector('img, svg');

			if (iconElement) {
				let img = new Image();

				if (iconElement.tagName.toLowerCase() === 'img') {
					const src = iconElement.src;
					if (src.startsWith('http://127.0.0.1:5500/') || src.startsWith('/')) {
						const basePath = window.location.origin;
						img.src = new URL(src.replace('http://127.0.0.1:5500/', '/'), basePath).href;
					} else {
						img.src = src;
					}
				} else if (iconElement.tagName.toLowerCase() === 'svg') {
					const svgData = new XMLSerializer().serializeToString(iconElement);
					const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
					img.src = URL.createObjectURL(svgBlob);
				}

				img.crossOrigin = 'anonymous';
				img.onload = () => {
					if (iconElement.tagName.toLowerCase() === 'svg') {
						URL.revokeObjectURL(img.src);
					}
					resolve(img);
				};

				img.onerror = (err) => {
					console.error('Failed to load icon:', err, img.src);
					if (iconElement.tagName.toLowerCase() === 'svg') {
						URL.revokeObjectURL(img.src);
					}
					resolve(this.#createFallbackIcon());
				};
			} else {
				resolve(this.#createFallbackIcon());
			}
		});
	}

	static #createFallbackIcon() {
		const canvas = document.createElement('canvas');
		canvas.width = 24;
		canvas.height = 24;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#FF0000';
		ctx.fillRect(0, 0, 24, 24);

		const fallbackImg = new Image();
		fallbackImg.src = canvas.toDataURL();
		return new Promise((resolve) => {
			fallbackImg.onload = () => resolve(fallbackImg);
		});
	}

	static async #loadTile(x, y, z, path) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.src = `${path}/${z}/${x}_${y}.png`;
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error(`Tile not found at ${x},${y},${z}`));
			setTimeout(() => reject(new Error('Tile load timeout')), CONFIG.EXPORT.TIMEOUT_MS);
		});
	}

	static #allTilesLoaded(map) {
		let allLoaded = true;
		map.eachLayer((layer) => {
			if (layer instanceof L.TileLayer) {
				const container = layer.getContainer();
				if (container) {
					const tiles = container.getElementsByTagName('img');
					for (let tile of tiles) {
						if (!tile.complete) {
							allLoaded = false;
							break;
						}
					}
				}
			}
		});
		return allLoaded;
	}

	static #downloadImage(canvas) {
		canvas.toBlob(
			(blob) => {
				const link = document.createElement('a');
				const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
				link.download = `map_${timestamp}.jpg`;
				link.href = URL.createObjectURL(blob);
				link.click();
				URL.revokeObjectURL(link.href);
			},
			'image/jpeg',
			CONFIG.EXPORT.QUALITY
		);
	}
}
