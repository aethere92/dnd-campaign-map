const PREDEFINED_SCHEMAS = {
	label: {
		type: 'object',
		properties: {
			lat: { type: 'number', default: 0 },
			lng: { type: 'number', default: 0 },
			label: { type: 'string', default: '' },
			type: { type: 'string', default: 'place' },
			icon: { type: 'string', default: 'poiGenericNPC' },
			iconType: { type: 'string', default: 'png' },
			mapLink: { type: 'string', default: '' },
		},
	},
	metadata: {
		type: 'object',
		properties: {
			path: { type: 'string', default: '' },
			sizes: {
				type: 'object',
				properties: {
					maxZoom: { type: 'number', default: 3 },
					imageWidth: { type: 'number', default: 0 },
					imageHeight: { type: 'number', default: 0 },
				},
			},
			backgroundColor: { type: 'string', default: '#ffffff' },
		},
	},
	path: {
		type: 'object',
		properties: {
			name: { type: 'string', default: '' },
			lineColor: { type: 'string', default: '#000000' },
			points: { type: 'array', default: null },
		},
	},
	// Add more schemas as needed
};
