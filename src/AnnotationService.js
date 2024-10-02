// Add custom markers (assuming MAP_DATA is defined elsewhere)
const addAnnotations = () => {
    const iconCache = {};
    const layers = {};
    const markers = [];

    Object.entries(MAP_DATA).forEach(([category, points]) => {
        layers[category] = L.layerGroup();

        points.forEach((point) => {
            const icon = getIcon(point.icon, point.iconColor, point.iconType);
            const marker = L.marker([point.lat, point.lng], { icon }).bindPopup(point.label);

            marker.on('add', () => {
                const markerElement = marker.getElement();
                if (markerElement) {
                    markerElement.classList.add('custom-marker-class');
                    markerElement.setAttribute('data-category', category);
                    markerElement.setAttribute('data-label', point.label);
                }
            });
            marker.addTo(layers[category]);
            markers.push(marker);
        });

        layers[category].addTo(map);
    });

    L.control.layers(null, layers).addTo(map);

    function getIcon(iconName, iconColor, iconType) {
        let iconContent;

        const cacheKey = `${iconName}-${iconColor}`;
        if (iconCache[cacheKey]) {
            return iconCache[cacheKey];
        }

        if (!iconType || iconType === 'png') {
            iconContent = `
            <div class="custom-marker-icon">
                <img width="24px" src="images/custom-icons/${iconName}.png" />
            </div>`;
        } else if (iconType === 'svg') {
            iconContent = `
            <div class="custom-marker-icon">
                ${SVG_ICON_DB[iconName]}
            </div>`;
        }

        const icon = L.divIcon({
            className: 'marker',
            html: iconContent,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        iconCache[cacheKey] = icon;
        return icon;
    }
};

// Call the function to add annotations
addAnnotations();
