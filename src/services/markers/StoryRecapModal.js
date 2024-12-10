class StoryRecapModal {
	static instance = null;

	static getInstance(campaignData, mapAliases) {
		if (!StoryRecapModal.instance) {
			StoryRecapModal.instance = new StoryRecapModal(campaignData, mapAliases);
		} else if (campaignData && mapAliases) {
			// Update existing instance with new data if provided
			StoryRecapModal.instance.updateData(campaignData, mapAliases);
		}
		return StoryRecapModal.instance;
	}

	constructor(campaignData, mapAliases) {
		// Prevent direct construction
		if (StoryRecapModal.instance) {
			return StoryRecapModal.instance;
		}

		this.campaignData = campaignData;
		this.mapAliases = mapAliases;
		this.sessions = this.extractSessions();
		this.currentSession = null;
		this.modal = null;
		this.sidebar = null;
		this.mainContent = null;
		this.isVisible = false; // Add this line

		this.initialize();
		StoryRecapModal.instance = this;
	}

	updateData(campaignData, mapAliases) {
		this.campaignData = campaignData;
		this.mapAliases = mapAliases;
		this.sessions = this.extractSessions();
		this.populateSidebar();

		// Reload current session if it exists
		if (this.currentSession) {
			const updatedSession = this.sessions.find((s) => s.sessionId === this.currentSession.sessionId);
			if (updatedSession) {
				this.loadSession(updatedSession);
			} else {
				this.currentSession = null;
			}
		}
	}

	initialize() {
		// Create modal structure
		this.modal = document.createElement('div');
		this.modal.className = 'story-recap-modal';
		this.modal.style.display = 'none';

		// Create close button
		const closeButton = document.createElement('button');
		closeButton.className = 'story-recap-close';
		closeButton.innerHTML = '×';
		closeButton.onclick = () => this.hide();

		// Create modal content container
		const modalContent = document.createElement('div');
		modalContent.className = 'story-recap-content';

		// Create sidebar
		this.sidebar = document.createElement('div');
		this.sidebar.className = 'story-recap-sidebar';

		// Create main content area
		this.mainContent = document.createElement('div');
		this.mainContent.className = 'story-recap-main';

		// Assemble modal
		modalContent.appendChild(this.sidebar);
		modalContent.appendChild(this.mainContent);
		this.modal.appendChild(closeButton);
		this.modal.appendChild(modalContent);

		// Populate sidebar
		this.populateSidebar();

		// Add modal to document
		document.body.appendChild(this.modal);
	}

	// Get the correct map alias from a path
	getMapAliasFromPath(mapPath) {
		if (!mapPath) return 'world_map';

		// Remove leading slash if present
		mapPath = mapPath.replace(/^\//, '');

		// Find the matching alias
		const aliasEntry = Object.entries(this.mapAliases).find(([alias, path]) => {
			// Convert the dot notation path to regex pattern
			const pathPattern = path.replace(/\./g, '\\.').replace(/world_maps/, 'world_maps(?:\\.submaps)?');
			const regex = new RegExp(pathPattern + '$');
			return regex.test(mapPath);
		});

		return aliasEntry ? aliasEntry[0] : 'world_map';
	}

	extractSessions() {
		const sessions = [];

		const processSubmaps = (data, mapPath = '') => {
			if (data.paths) {
				data.paths.forEach((path) => {
					if (path.sessionId !== undefined) {
						sessions.push({
							name: path.name,
							sessionId: path.sessionId,
							mapPath: data.metadata.mapId,
							points: path.points,
						});
					}
				});
			}

			if (data.submaps) {
				Object.entries(data.submaps).forEach(([key, submap]) => {
					Object.values(submap).forEach((submapData) => {
						processSubmaps(submapData, submapData.metadata.mapId);
					});
				});
			}
		};

		processSubmaps(this.campaignData.world_maps);

		return sessions.sort((a, b) => a.sessionId - b.sessionId);
	}

	populateSidebar() {
		this.sidebar.innerHTML = '';
		this.sessions.forEach((session) => {
			const sessionElement = document.createElement('div');
			sessionElement.className = 'session-item';
			sessionElement.innerHTML = `
                <div>${session.name}</div>
                <div class="session-map">${session.mapPath || 'World Map'}</div>
            `;

			sessionElement.onclick = () => this.loadSession(session);

			this.sidebar.appendChild(sessionElement);
		});
	}

	loadSession(session) {
		// Update active session in sidebar
		const sessionItems = this.sidebar.querySelectorAll('.session-item');
		sessionItems.forEach((item) => item.classList.remove('active'));
		sessionItems[this.sessions.indexOf(session)].classList.add('active');

		// Clear and populate main content
		this.mainContent.innerHTML = '';

		// Add session title
		const title = document.createElement('h2');
		title.textContent = session.name;
		this.mainContent.appendChild(title);

		// Add recap points
		const recapSection = document.createElement('div');
		recapSection.className = 'recap-section';

		session.points.forEach((point, index) => {
			if (point.text) {
				const pointElement = document.createElement('div');
				pointElement.className = 'recap-point';
				if (point.coordinates) {
					pointElement.classList.add('has-location');
				}
				pointElement.textContent = point.text;

				// Add click handler if coordinates exist
				if (point.coordinates) {
					pointElement.onclick = () => {
						const target = {
							type: 'recap',
							id: `${session.sessionId}-${index}`,
							coordinates: point.coordinates,
						};

						// Get the correct map alias from the session's mapPath
						const mapKey = session.mapPath;

						// Update the URL with the new location
						UrlManager.updateUrl(mapKey, true, target);

						// Hide the modal after clicking
						// this.hide();
					};
				}

				recapSection.appendChild(pointElement);
			}

			// Add loot section if exists
			if (point.loot) {
				const lootSection = document.createElement('div');
				lootSection.className = 'loot-section';
				lootSection.innerHTML = `
                    <h3>Loot Acquired</h3>
                    <ul>
                        ${point.loot
													.map(
														(item) => `
                            <li>
                                <strong>${item.name}</strong> (${item.rarity})
                                <p>${item.description}</p>
                            </li>
                        `
													)
													.join('')}
                    </ul>
                `;
				recapSection.appendChild(lootSection);
			}

			// Add level up section if exists
			if (point.level) {
				const levelSection = document.createElement('div');
				levelSection.className = 'level-up';
				levelSection.innerHTML = `
                    <h3>Level Up!</h3>
                    <p>The party reached level ${point.level}</p>
                `;
				recapSection.appendChild(levelSection);
			}
		});

		this.mainContent.appendChild(recapSection);
		this.currentSession = session;
	}

	show() {
		this.modal.style.display = 'block';
		this.isVisible = true; // Add this line
		// Load first session by default if none is selected
		if (!this.currentSession && this.sessions.length > 0) {
			this.loadSession(this.sessions[0]);
		}
	}

	hide() {
		this.modal.style.display = 'none';
		this.isVisible = false; // Add this line
	}
}

// class StoryRecapModal {
// 	static instance = null;

// 	static getInstance(sessionRecaps) {
// 		if (!StoryRecapModal.instance) {
// 			StoryRecapModal.instance = new StoryRecapModal(sessionRecaps);
// 		} else if (sessionRecaps) {
// 			StoryRecapModal.instance.updateData(sessionRecaps);
// 		}
// 		return StoryRecapModal.instance;
// 	}

// 	constructor(sessionRecaps) {
// 		if (StoryRecapModal.instance) {
// 			return StoryRecapModal.instance;
// 		}

// 		this.sessionRecaps = sessionRecaps;
// 		this.sessions = this.extractSessions();
// 		this.currentSession = null;
// 		this.modal = null;
// 		this.sidebar = null;
// 		this.mainContent = null;
// 		this.isVisible = false;

// 		this.initialize();
// 		StoryRecapModal.instance = this;
// 	}

// 	updateData(sessionRecaps) {
// 		this.sessionRecaps = sessionRecaps;
// 		this.sessions = this.extractSessions();
// 		this.populateSidebar();

// 		if (this.currentSession) {
// 			const updatedSession = this.sessions.find((s) => s.id === this.currentSession.id);
// 			if (updatedSession) {
// 				this.loadSession(updatedSession);
// 			} else {
// 				this.currentSession = null;
// 			}
// 		}
// 	}

// 	initialize() {
// 		this.modal = document.createElement('div');
// 		this.modal.className = 'story-recap-modal';
// 		this.modal.style.display = 'none';

// 		const closeButton = document.createElement('button');
// 		closeButton.className = 'story-recap-close';
// 		closeButton.innerHTML = '×';
// 		closeButton.onclick = () => this.hide();

// 		const modalContent = document.createElement('div');
// 		modalContent.className = 'story-recap-content';

// 		this.sidebar = document.createElement('div');
// 		this.sidebar.className = 'story-recap-sidebar';

// 		this.mainContent = document.createElement('div');
// 		this.mainContent.className = 'story-recap-main';

// 		modalContent.appendChild(this.sidebar);
// 		modalContent.appendChild(this.mainContent);
// 		this.modal.appendChild(closeButton);
// 		this.modal.appendChild(modalContent);

// 		this.populateSidebar();

// 		document.body.appendChild(this.modal);
// 	}

// 	extractSessions() {
// 		return Object.entries(this.sessionRecaps).map(([id, session]) => ({
// 			id,
// 			name: session.name,
// 			map: session.map,
// 			chapters: session.chapters,
// 		}));
// 	}

// 	populateSidebar() {
// 		this.sidebar.innerHTML = '';
// 		this.sessions.forEach((session) => {
// 			const sessionElement = document.createElement('div');
// 			sessionElement.className = 'session-item';
// 			sessionElement.innerHTML = `
//                 <div>${session.name}</div>
//                 <div class="session-map">${session.map}</div>
//             `;

// 			sessionElement.onclick = () => this.loadSession(session);

// 			this.sidebar.appendChild(sessionElement);
// 		});
// 	}

// 	loadSession(session) {
// 		const sessionItems = this.sidebar.querySelectorAll('.session-item');
// 		sessionItems.forEach((item) => item.classList.remove('active'));
// 		sessionItems[this.sessions.indexOf(session)].classList.add('active');

// 		this.mainContent.innerHTML = '';

// 		const title = document.createElement('h2');
// 		title.textContent = session.name;
// 		this.mainContent.appendChild(title);

// 		const mapInfo = document.createElement('div');
// 		mapInfo.className = 'map-info';
// 		mapInfo.textContent = `Location: ${session.map}`;
// 		this.mainContent.appendChild(mapInfo);

// 		session.chapters.forEach((chapter) => {
// 			const chapterSection = document.createElement('div');
// 			chapterSection.className = 'chapter-section';

// 			const chapterTitle = document.createElement('h3');
// 			chapterTitle.className = 'chapter-title';
// 			chapterTitle.textContent = chapter.name;
// 			chapterSection.appendChild(chapterTitle);

// 			chapter.items.forEach((item) => {
// 				if (item.text) {
// 					const itemElement = document.createElement('div');
// 					itemElement.className = 'recap-point';
// 					itemElement.textContent = item.text;
// 					chapterSection.appendChild(itemElement);
// 				}

// 				if (item.loot) {
// 					const lootSection = document.createElement('div');
// 					lootSection.className = 'loot-section';
// 					lootSection.innerHTML = `
//                         <h4>Loot Acquired</h4>
//                         <ul>
//                             ${item.loot
// 															.map(
// 																(lootItem) => `
//                                 <li>
//                                     <strong>${lootItem.name}</strong> (${lootItem.rarity})
//                                     <p>${lootItem.description}</p>
//                                 </li>
//                             `
// 															)
// 															.join('')}
//                         </ul>
//                     `;
// 					chapterSection.appendChild(lootSection);
// 				}
// 			});

// 			this.mainContent.appendChild(chapterSection);
// 		});

// 		this.currentSession = session;
// 	}

// 	show() {
// 		this.modal.style.display = 'block';
// 		this.isVisible = true;
// 		if (!this.currentSession && this.sessions.length > 0) {
// 			this.loadSession(this.sessions[0]);
// 		}
// 	}

// 	hide() {
// 		this.modal.style.display = 'none';
// 		this.isVisible = false;
// 	}
// }
