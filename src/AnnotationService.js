// Function to add annotations to the map using custom SVG icons in divIcon
function addAnnotations() {
	ANNOTATION_DB.forEach((point) => {
		const labelClass = point.type === 'place' ? 'place-label' : 'person-label';

		// Create the marker with custom SVG icon
		const icon = L.divIcon({
			className: 'marker',
			html: SVG_ICON_DB[point.icon], // Load the SVG from your icon database
			iconSize: [40, 40], // Default icon size
			iconAnchor: [20, 40], // Anchor to bottom center
			popupAnchor: [7, -16], // Position of popup relative to the icon
		});

		const marker = L.marker([point.lat, point.lng], { icon: icon }).addTo(map).bindPopup(point.label);

		// Add your custom class for styling
		marker._icon.classList.add(labelClass);

		// Store the marker reference for later use in resizing
		point.marker = marker;
	});
}

// Function to update marker sizes based on zoom level
function updateMarkerSizes() {
	const zoom = map.getZoom();
	let iconSize;

	if (zoom > 3) {
		iconSize = [40, 40]; // Default size at higher zoom levels
	} else if (zoom > 0) {
		iconSize = [20, 20]; // Medium size at moderate zoom levels
	} else {
		iconSize = [10, 10]; // Smaller size at lower zoom levels
	}

	ANNOTATION_DB.forEach((point) => {
		if (point.marker) {
			// Create a new divIcon with updated size
			const updatedIcon = L.divIcon({
				className: 'marker',
				html: SVG_ICON_DB[point.icon], // Keep the original SVG content
				iconSize: iconSize, // Apply new size
				iconAnchor: [iconSize[0] / 2, iconSize[1]], // Recalculate anchor to bottom center
				popupAnchor: [7, -iconSize[1] / 2], // Adjust popup position based on new size
			});

			// Update the marker with the new icon size
			point.marker.setIcon(updatedIcon);
		}
	});
}

// Call the function to add annotations
addAnnotations();

// Listen to zoom events to resize markers dynamically
map.on('zoomend', updateMarkerSizes);

// Optionally, call the size update function initially to set correct size
updateMarkerSizes();
