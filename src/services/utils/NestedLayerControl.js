class NestedLayerControl extends L.Control.Layers {
	constructor(baseLayers, overlays, options = {}) {
		super(baseLayers, null, {
			...options,
			collapsed: true,
			sortLayers: true,
		});

		this._groups = new Map();
		this._layers = new Map();
		this._layerControlInputs = [];
		this._lastZIndex = 0;
		this._icons = {
			toggled: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>`,
			notToggled: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></svg>`,
			// toggled: `<svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 9l3 3l-3 3" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /></svg>`,
			// notToggled: `<svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 11l-3 3l-3 -3" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /></svg>`,
		};
	}

	addGroup(groupId, options = {}) {
		const {
			label,
			collapsed = true,
			exclusive = false,
			parentId = null,
			sortLayers = true,
			defaultVisible = true, // New option for default visibility
		} = options;

		this._groups.set(groupId, {
			id: groupId,
			label,
			collapsed,
			exclusive,
			parentId,
			sortLayers,
			defaultVisible,
			layers: new Map(),
			subgroups: new Set(),
		});

		if (parentId && this._groups.has(parentId)) {
			this._groups.get(parentId).subgroups.add(groupId);
		}

		this._update();
		return this;
	}

	addLayerToGroup(layer, name, groupId) {
		if (!this._groups.has(groupId)) {
			console.warn(`Group ${groupId} does not exist`);
			return this;
		}

		const group = this._groups.get(groupId);
		const id = L.Util.stamp(layer);

		this._layers.set(id, {
			layer,
			name,
			groupId,
			overlay: true,
		});

		group.layers.set(id, layer);

		if (this._map) {
			// Only add layer to map if group's defaultVisible is true
			if (group.defaultVisible) {
				this._map.addLayer(layer);
			} else {
				// If the layer was already added, remove it
				if (this._map.hasLayer(layer)) {
					this._map.removeLayer(layer);
				}
			}
		}

		this._update();
		return this;
	}

	_isGroupEmpty(group) {
		// Check if group has any layers
		if (group.layers.size > 0) return false;

		// Recursively check if any subgroups have layers
		for (const subgroupId of group.subgroups) {
			const subgroup = this._groups.get(subgroupId);
			if (!this._isGroupEmpty(subgroup)) return false;
		}

		return true;
	}

	_addItem(obj) {
		const layerInfo = this._layers.get(obj.layer._leaflet_id);
		if (!layerInfo) return super._addItem(obj);

		const group = this._groups.get(layerInfo.groupId);
		if (!group) return super._addItem(obj);

		const container = document.createElement('div');
		container.className = 'leaflet-control-layers-item';

		const row = this._createItemRow(obj, layerInfo, group);
		container.appendChild(row);

		return container;
	}

	_createItemRow(obj, layerInfo, group) {
		const row = document.createElement('div');
		row.className = 'leaflet-control-layers-row';

		const input = document.createElement('input');
		input.type = group.exclusive ? 'radio' : 'checkbox';
		input.className = 'leaflet-control-layers-selector';
		input.name = group.exclusive ? `leaflet-radio-${group.id}` : undefined;
		input.checked = this._map.hasLayer(obj.layer);

		input.addEventListener('change', () => {
			if (input.checked) {
				if (group.exclusive) {
					// Uncheck other layers in exclusive group
					group.layers.forEach((layer, layerId) => {
						if (layerId !== obj.layer._leaflet_id) {
							this._map.removeLayer(layer);
						}
					});
				}
				this._map.addLayer(obj.layer);
			} else {
				this._map.removeLayer(obj.layer);
			}
		});

		const label = document.createElement('label');
		label.innerHTML = `<span>${layerInfo.name}</span>`;

		// Add click handler for zooming to marker
		if (obj.layer.getLatLng) {
			label.style.cursor = 'pointer';
			label.title = 'Click to zoom to marker';

			label.addEventListener('click', (e) => {
				if (e.target.tagName.toLowerCase() === 'span') {
					e.preventDefault();
					e.stopPropagation();

					const pos = obj.layer.getLatLng();
					const targetZoom = this._map.getMaxZoom() - 1;
					const currentZoom = this._map.getZoom();

					if (currentZoom >= targetZoom - 1) {
						this._map.once('zoomend', () => {
							setTimeout(() => {
								this._map.setView(pos, targetZoom, {
									animate: true,
									duration: 1,
								});
								if (obj.layer.openPopup) {
									obj.layer.openPopup();
								}
							}, 50);
						});

						this._map.setZoom(targetZoom - 2, {
							animate: true,
							duration: 1,
						});
					} else {
						this._map.setView(pos, targetZoom, {
							animate: true,
							duration: 1,
						});
						if (obj.layer.openPopup) {
							obj.layer.openPopup();
						}
					}
				}
			});
		}

		row.appendChild(label);
		row.appendChild(input);

		return row;
	}

	_update() {
		if (!this._container) return this;

		this._baseLayersList.innerHTML = '';
		this._overlaysList.innerHTML = '';

		const fragment = document.createDocumentFragment();
		this._addGroups(fragment);
		this._overlaysList.appendChild(fragment);

		return this;
	}

	_addGroups(container, parentId = null, level = 0) {
		const groups = Array.from(this._groups.values())
			.filter((group) => group.parentId === parentId)
			.sort((a, b) => a.label.localeCompare(b.label));

		groups.forEach((group) => {
			// Skip empty groups
			if (this._isGroupEmpty(group)) return;

			const groupContainer = this._createGroupContainer(group, level);
			container.appendChild(groupContainer);

			const layersContainer = document.createElement('div');
			layersContainer.className = 'leaflet-control-layers-group-layers';
			layersContainer.style.marginLeft = `${(level + 1) * 7.5}px`;
			layersContainer.dataset.level = level;

			if (group.collapsed) {
				layersContainer.classList.add('item-hidden');
			}

			// Add layers
			if (group.sortLayers) {
				const sortedLayers = Array.from(group.layers.entries()).sort((a, b) => {
					const nameA = this._layers.get(a[0]).name;
					const nameB = this._layers.get(b[0]).name;
					return nameA.localeCompare(nameB);
				});

				sortedLayers.forEach(([id]) => {
					const layerInfo = this._layers.get(id);
					const item = this._addItem({
						layer: layerInfo.layer,
						name: layerInfo.name,
						overlay: true,
					});
					layersContainer.appendChild(item);
				});
			}

			groupContainer.appendChild(layersContainer);

			// Recursively add subgroups
			if (group.subgroups.size > 0) {
				this._addGroups(layersContainer, group.id, level + 1);
			}
		});
	}

	_createGroupContainer(group, level) {
		const container = document.createElement('div');
		container.className = 'leaflet-control-layers-group';
		container.style.marginLeft = `${level * 2}px`;
		container.dataset.level = level;

		const header = document.createElement('div');
		header.className = 'leaflet-control-layers-group-header';

		// Add group checkbox
		const groupCheckbox = document.createElement('input');
		groupCheckbox.type = 'checkbox';
		groupCheckbox.className = 'leaflet-control-layers-group-selector';

		// Set initial state based on whether all layers are visible
		let allVisible = true;
		group.layers.forEach((layer) => {
			if (!this._map.hasLayer(layer)) {
				allVisible = false;
			}
		});
		groupCheckbox.checked = group.defaultVisible;

		// Add change handler for group checkbox
		groupCheckbox.addEventListener('change', () => {
			const isChecked = groupCheckbox.checked;

			// Toggle all layers in this group
			group.layers.forEach((layer) => {
				if (isChecked) {
					this._map.addLayer(layer);
				} else {
					this._map.removeLayer(layer);
				}
			});

			// Update all layer checkboxes
			const layerInputs = container.querySelectorAll('.leaflet-control-layers-selector');
			layerInputs.forEach((input) => {
				input.checked = isChecked;
			});

			// Recursively handle subgroups
			group.subgroups.forEach((subgroupId) => {
				const subgroup = this._groups.get(subgroupId);
				const subgroupCheckbox = container.querySelector(`[data-group-id="${subgroupId}"]`);
				if (subgroupCheckbox) {
					subgroupCheckbox.checked = isChecked;
					this._toggleGroupLayers(subgroup, isChecked);
				}
			});
		});

		const toggle = document.createElement('span');
		toggle.className = 'leaflet-control-layers-group-toggle';
		toggle.innerHTML = group.collapsed ? this._icons.toggled : this._icons.notToggled;
		toggle.style.cursor = 'pointer';

		const label = document.createElement('span');
		label.className = 'leaflet-control-layers-group-label';
		label.innerHTML = group.label;

		header.appendChild(groupCheckbox);
		header.appendChild(label);

		if (Array.from(group.subgroups).length === 0) {
			const counter = document.createElement('span');
			counter.className = 'leaflet-control-layers-group-counter';
			counter.innerHTML = group.layers.size;
			header.appendChild(counter);
		}

		header.appendChild(toggle);
		container.appendChild(header);

		// Add click handler for toggle
		toggle.addEventListener('click', (e) => {
			e.stopPropagation();
			group.collapsed = !group.collapsed;
			toggle.innerHTML = group.collapsed ? this._icons.toggled : this._icons.notToggled;

			const layersContainer = container.querySelector('.leaflet-control-layers-group-layers');
			if (layersContainer) {
				// layersContainer.style.display = group.collapsed ? 'none' : 'block';

				if (group.collapsed) {
					layersContainer.classList.add('item-hidden');
				} else {
					layersContainer.classList.remove('item-hidden');
				}
			}
		});

		// Set data attribute for group identification
		groupCheckbox.setAttribute('data-group-id', group.id);

		return container;
	}

	_toggleGroupLayers(group, show) {
		// Toggle all layers in the group
		group.layers.forEach((layer) => {
			if (show) {
				this._map.addLayer(layer);
			} else {
				this._map.removeLayer(layer);
			}
		});

		// Recursively handle subgroups
		group.subgroups.forEach((subgroupId) => {
			const subgroup = this._groups.get(subgroupId);
			this._toggleGroupLayers(subgroup, show);
		});
	}
}
