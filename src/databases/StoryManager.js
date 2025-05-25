class StoryManager {
	#rootElement;
	#campaign;
	#currentSessionId;
	#currentView = 'session'; // 'session', 'character', 'timeline'
	#selectedCharacterName = null;
	#isDebugMode;
	#tooltipContainer;
	#isSidebarCollapsed = false;
	// #isTimelineVisible = false; // Replaced by #currentView
	#apiBaseUrl = 'https://www.dnd5eapi.co/api/2014/'; // Example API
	#supportedEntityTypes = [
		'spell',
		'monster',
		'class',
		'background',
		'race',
		'equipment',
		'magic-item',
		'feat',
		'condition',
		'character',
		'race',
		'npc',
	];
	#entityEndpoints = {
		spell: 'spells',
		monster: 'monsters',
		class: 'classes',
		background: 'backgrounds',
		race: 'races',
		equipment: 'equipment',
		'magic-item': 'magic-item',
		feat: 'feats',
		condition: 'conditions',
		character: 'character',
		race: 'race',
		npc: 'npc',
	};
	#customApiData;

	constructor(elementId, options = {}) {
		this.#rootElement = document.getElementById(elementId);
		this.#isDebugMode = options.isDebugMode || false;
		if (!this.#rootElement) {
			console.error('StoryView: Root element not found:', elementId);
			return;
		}

		if (options.campaignData?.api_data) {
			this.#customApiData = options.campaignData?.api_data;
		}

		// Create tooltip container once during initialization
		this.#createTooltipContainer();
		// Check for saved sidebar state in local storage
		const savedSidebarState = localStorage.getItem('story-sidebar-collapsed');
		if (savedSidebarState) {
			this.#isSidebarCollapsed = savedSidebarState === 'true';
		}

		this.updateCampaign(
			options.campaignData,
			options.initialSessionId,
			options.initialCharacterName,
			options.initialViewType
		);
	}

	/**
	 * Returns the sidebar DOM element.
	 * @returns {HTMLElement|null} The sidebar element or null if not found.
	 */
	getSidebarElement() {
		// Ensure the root element is valid before querying
		if (!this.#rootElement) return null;
		return this.#rootElement.querySelector('.story-sidebar');
	}

	setCampaignManager(campaignManager, showCampaignSelectionCallback) {
		this.campaignManager = campaignManager;
		this.showCampaignSelection = showCampaignSelectionCallback;
		this.ensureCampaignSelectionButton();
	}

	ensureCampaignSelectionButton() {
		// This needs to be called whenever the sidebar is refreshed
		const sidebar = this.getSidebarElement();
		if (sidebar) {
			// First remove any existing button to avoid duplicates
			const existingButton = sidebar.querySelector('.story-campaign-selection');
			if (existingButton) {
				existingButton.remove();
			}

			// Create and add the button
			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'story-campaign-selection';
			buttonContainer.style.marginTop = 'auto';
			buttonContainer.style.padding = '10px';

			const backToSelectionButton = document.createElement('button');
			backToSelectionButton.textContent = 'Campaign selection';
			backToSelectionButton.className = 'sidebar-back-button button-secondary';
			backToSelectionButton.style.width = '100%';

			// Use the callback provided by CampaignManager
			backToSelectionButton.addEventListener('click', this.showCampaignSelection);

			buttonContainer.appendChild(backToSelectionButton);
			sidebar.appendChild(buttonContainer);
		}
	}

	updateCampaign(campaign, sessionId = null, characterName = null, viewType = null) {
		if (!campaign) return;

		// Process characters for custom API data
		if (campaign?.metadata?.characters) {
			campaign.metadata.characters.forEach((char) => {
				this.#customApiData.character = this.#customApiData.character || {};
				this.#customApiData.character[char.name] = char;
			});
		}

		this.#campaign = campaign;

		// Determine the initial state based on parameters
		if (viewType === 'timeline') {
			this.#currentView = 'timeline';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId(); // Keep track of a session even if not displayed
		} else if (characterName) {
			this.#currentView = 'character';
			this.#selectedCharacterName = characterName;
			this.#currentSessionId = sessionId || this.#getFirstSessionId(); // Keep track of a session
		} else {
			this.#currentView = 'session';
			this.#selectedCharacterName = null;
			this.#currentSessionId = sessionId || this.#getFirstSessionId(); // Must have a session ID here
		}

		// Ensure we have a valid session ID if needed
		if (this.#currentView === 'session' && !this.#currentSessionId) {
			console.error('StoryView: Attempting to show session view without a valid session ID.');
			// Potentially switch to a default state or show an error
			this.#currentSessionId = this.#getFirstSessionId();
			if (!this.#currentSessionId) {
				this.#rootElement.innerHTML = '<p>Error: No sessions found for this campaign.</p>';
				return; // Stop if no sessions exist at all
			}
		}

		this.render();
	}

	#getFirstSessionId() {
		if (!this.#campaign?.recaps?.length) {
			return null;
		}
		return this.#campaign.recaps[0].id;
	}

	async render() {
		if (!this.#rootElement || !this.#campaign) return;

		// Clear the container
		this.#rootElement.innerHTML = '';

		// Create main container
		const container = document.createElement('div');
		container.className = 'story-container';

		// Create main content area with sidebar and content
		const mainContent = document.createElement('div');
		mainContent.className = 'story-main-content';
		if (this.#isSidebarCollapsed) {
			mainContent.classList.add('sidebar-collapsed');
		}

		// Create sidebar with characters and session list
		const sidebar = this.#createSidebar();
		mainContent.appendChild(sidebar);
		// Create content area
		const contentArea = document.createElement('div');
		contentArea.className = 'story-content-area';
		// Load the appropriate content based on the current view - Await this async operation
		await this.#loadContentArea(contentArea);

		mainContent.appendChild(contentArea);
		container.appendChild(mainContent);

		this.#rootElement.appendChild(container);
		// Generate table of contents AFTER content is loaded - only for session view
		if (this.#currentView === 'session') {
			this.#generateTableOfContents(contentArea);
			this.#scrollToHash();
		}
		this.ensureCampaignSelectionButton();
	}

	#createSidebar() {
		const sidebar = document.createElement('div');
		sidebar.className = 'story-sidebar';

		// Add toggle button for sidebar
		const toggleButton = document.createElement('button');
		toggleButton.className = 'sidebar-toggle';
		toggleButton.innerHTML = this.#isSidebarCollapsed ? '&raquo;' : '&laquo;';
		toggleButton.setAttribute('aria-label', this.#isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
		toggleButton.addEventListener('click', () => this.#toggleSidebar(toggleButton));
		sidebar.appendChild(toggleButton);

		// Add campaign name at the top of sidebar
		const campaignName = document.createElement('div');
		campaignName.className = 'story-campaign-name';
		campaignName.innerHTML = `<h3>${this.#campaign.metadata?.name || 'Unnamed Campaign'}</h3>`;
		sidebar.appendChild(campaignName);

		// Add characters section
		this.#createCharacterSection(sidebar);

		// Add timeline section
		this.#createTimelineSection(sidebar);

		// Add sessions section
		this.#createSessionList(sidebar);

		return sidebar;
	}

	// #toggleSidebar remains the same...
	#toggleSidebar(toggleButton) {
		this.#isSidebarCollapsed = !this.#isSidebarCollapsed;
		// Update button text
		toggleButton.innerHTML = this.#isSidebarCollapsed ? '&raquo;' : '&laquo;';
		toggleButton.setAttribute('aria-label', this.#isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
		// Find and toggle the main content container
		const mainContent = this.#rootElement.querySelector('.story-main-content');
		const sidebar = this.#rootElement.querySelector('.story-sidebar');
		if (mainContent) {
			// Add transitioning class to enable animation
			mainContent.classList.add('sidebar-transitioning');

			// Toggle the collapsed class
			mainContent.classList.toggle('sidebar-collapsed', this.#isSidebarCollapsed);
			// Add animation class to sidebar content
			if (sidebar) {
				sidebar.classList.toggle('sidebar-content-collapsed', this.#isSidebarCollapsed);
			}

			// Remove transitioning class after animation completes
			setTimeout(() => {
				mainContent.classList.remove('sidebar-transitioning');
			}, 300); // Match CSS transition duration
		}

		// Save state to local storage
		localStorage.setItem('story-sidebar-collapsed', this.#isSidebarCollapsed);
	}

	#createCharacterSection(sidebar) {
		const characters = this.#campaign.metadata?.characters.filter((character) => character?.is_included);
		if (!characters?.length) {
			return;
		}

		const characterSection = document.createElement('div');
		characterSection.className = 'story-characters-section';

		const sectionTitle = document.createElement('h2');
		sectionTitle.textContent = 'Characters';
		characterSection.appendChild(sectionTitle);
		const characterList = document.createElement('div');
		characterList.className = 'story-character-list';

		characters.forEach((character) => {
			const charCard = document.createElement('div');
			charCard.className = 'story-character-card';

			if (this.#currentView === 'character' && this.#selectedCharacterName === character.name) {
				charCard.classList.add('active');
			}

			charCard.innerHTML = `
                <div class="character-avatar">
                    <img src="${character.icon}" alt="${character.name}" />
                </div>
                <div class="character-info">

             <h3>${character.name}</h3>
                </div>
            `;
			charCard.title = `Lvl ${character.level} ${character.race} ${character.class}`;

			// Add click event to show character background
			charCard.addEventListener('click', () => {
				this.#handleCharacterClick(character.name);
			});

			characterList.appendChild(charCard);
		});
		characterSection.appendChild(characterList);
		sidebar.appendChild(characterSection);
	}

	#handleCharacterClick(characterName) {
		// Toggle selection
		if (this.#currentView === 'character' && this.#selectedCharacterName === characterName) {
			// Deselecting the current character - go back to the current session view
			this.#currentView = 'session';
			this.#selectedCharacterName = null;
		} else {
			// Selecting a new character (or the first time)
			this.#currentView = 'character';
			this.#selectedCharacterName = characterName;
		}

		// Update URL
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', this.#campaign.id); // Ensure campaign is set
		params.delete('map'); // Clean up other view params
		params.delete('view');
		params.delete('session'); // Usually hide session when showing character

		if (this.#currentView === 'character') {
			params.set('character', this.#selectedCharacterName);
		} else {
			// Switched back to session view
			params.delete('character');
			// Make sure a session param exists if we fell back to session view
			if (this.#currentSessionId) {
				params.set('session', this.#currentSessionId);
			} else {
				// If no current session somehow, try getting the first one
				const firstSession = this.#getFirstSessionId();
				if (firstSession) params.set('session', firstSession);
			}
		}

		const state = {
			campaignId: this.#campaign.id,
			sessionId: this.#currentView === 'session' ? this.#currentSessionId : null,
			characterName: this.#currentView === 'character' ? this.#selectedCharacterName : null,
			view: 'story', // Keep the main view type
		};
		// Use replaceState as we are interacting within the story view
		window.history.replaceState(state, '', `${currentUrl.pathname}?${params.toString()}`);

		// Re-render to update the content area
		this.render();
	}

	#createSessionList(sidebar) {
		const recaps = this.#campaign.recaps;
		if (!recaps?.length) {
			const noSessions = document.createElement('div');
			noSessions.className = 'no-sessions';
			noSessions.textContent = 'No sessions available';
			sidebar.appendChild(noSessions);
			return;
		}

		const sessionSection = document.createElement('div');
		sessionSection.className = 'story-sessions-section';

		const sectionTitle = document.createElement('h2');
		sectionTitle.textContent = 'Sessions';
		sessionSection.appendChild(sectionTitle);

		const sessionList = document.createElement('div');
		sessionList.className = 'story-session-list';
		recaps.forEach((session) => {
			const sessionItem = document.createElement('div');
			sessionItem.className = 'story-session-item';

			if (this.#currentView === 'session' && session.id === this.#currentSessionId) {
				sessionItem.classList.add('active');
			}

			sessionItem.innerHTML = `
				<h3>${session.title}</h3>
				<div class="session-date">${session.date || ''}</div>
			`;

			sessionItem.addEventListener('click', () => {
				this.#currentView = 'session';
				this.#selectedCharacterName = null; // Clear character selection
				this.#currentSessionId = session.id; // Set the clicked session as current

				// Update URL - Remove character/view params, set session
				const currentUrl = new URL(window.location.href);
				const params = currentUrl.searchParams;
				params.set('session', session.id);
				params.delete('character');
				params.delete('view');
				params.set('campaign', this.#campaign.id); // Ensure campaign stays
				params.delete('map'); // Clean map param

				const state = {
					campaignId: this.#campaign.id,
					sessionId: session.id,
					characterName: null, // Ensure cleared
					viewType: null, // Ensure cleared
					view: 'story', // Main view type
				};
				// Use replaceState for intra-story navigation
				window.history.replaceState(state, '', `${currentUrl.pathname}?${params.toString()}`);

				// Re-render to show the new session
				this.render();
			});

			sessionList.appendChild(sessionItem);
		});

		sessionSection.appendChild(sessionList);
		sidebar.appendChild(sessionSection);
	}

	#createTimelineSection(sidebar) {
		const timelineSection = document.createElement('div');
		timelineSection.className = 'story-timeline-section';
		const sectionTitle = document.createElement('h2');
		sectionTitle.textContent = 'Campaign';
		timelineSection.appendChild(sectionTitle);

		const timelineButton = document.createElement('button');
		timelineButton.className = 'timeline-button';
		timelineButton.textContent = 'View Timeline';
		if (this.#currentView === 'timeline') {
			timelineButton.classList.add('active');
		}

		timelineButton.addEventListener('click', () => {
			this.#handleTimelineClick();
		});

		timelineSection.appendChild(timelineButton);
		sidebar.appendChild(timelineSection);
	}

	#handleTimelineClick() {
		// Don't do anything if already on timeline vieactw
		if (this.#currentView === 'timeline') return;

		this.#currentView = 'timeline';
		this.#selectedCharacterName = null; // Clear character selection

		// Update URL
		const currentUrl = new URL(window.location.href);
		const params = currentUrl.searchParams;
		params.set('campaign', this.#campaign.id); // Ensure campaign
		params.set('view', 'timeline'); // Set the view param
		params.delete('session'); // Remove other view params
		params.delete('character');
		params.delete('map');

		const state = {
			campaignId: this.#campaign.id,
			sessionId: null,
			characterName: null,
			viewType: 'timeline', // Specific view type
			view: 'story', // Main view type
		};
		// Use replaceState for intra-story navigation
		window.history.replaceState(state, '', `${currentUrl.pathname}?${params.toString()}`);

		// Re-render to show the timeline
		this.render();
	}

	#processTimelinePlaceholders(timelineContainer) {
		// Process all timeline items inside the container
		const timelineItems = timelineContainer.querySelectorAll('.timeline-item');

		timelineItems.forEach((item) => {
			// Get the content div inside each timeline item
			const contentElements = item.querySelectorAll(
				'.timeline-content, .timeline-sub-description, .timeline-main-description'
			);
			if (!contentElements) return;

			contentElements.forEach((contentElement) => {
				// Process the same elements as in the session content
				this.#processImages(contentElement);
				this.#processCharacterReferences(contentElement);
				this.#processEntityReferences(contentElement);

				// If this is a main timeline item, we might want to process progression tags
				if (item.classList.contains('timeline-main-item')) {
					const itemId = item.getAttribute('data-id');
					const timelineData = this.#campaign?.timeline;
					if (timelineData && Array.isArray(timelineData)) {
						const itemData = timelineData.find((data) => data.id === itemId);
						if (itemData) {
							this.#processProgressionTags(contentElement, itemData);
						}
					}
				}

				// Process character highlights after references have been created
				this.#processCharacterHighlights(contentElement);
			});
		});
	}

	#renderTimeline(contentArea) {
		// Check if the current campaign has timeline data
		const timelineData = this.#campaign?.timeline;
		if (!timelineData || !Array.isArray(timelineData) || timelineData.length === 0) {
			console.error('Timeline data not available for this campaign:', this.#campaign?.id);
			// Display an error message to the user
			const timelineContainer = document.createElement('div');
			timelineContainer.className = 'story-timeline-container visible';
			timelineContainer.innerHTML = `
				<div class="timeline-header">
					<h2>Campaign Timeline</h2>
				</div>
				<div class="no-content">
					Timeline data not available for this campaign.
				</div>
			`;

			contentArea.appendChild(timelineContainer);
			return;
		}

		// Create timeline container
		const timelineContainer = document.createElement('div');
		timelineContainer.className = 'story-timeline-container visible';

		// Create timeline header
		const header = document.createElement('div');
		header.className = 'timeline-header';
		header.innerHTML = `<h2>Campaign Timeline</h2>`;
		timelineContainer.appendChild(header);

		const toggleAllButton = document.createElement('button');
		toggleAllButton.className = 'timeline-toggle-all-button';
		toggleAllButton.textContent = 'Toggle descriptions';
		toggleAllButton.type = 'button';
		header.appendChild(toggleAllButton);

		toggleAllButton.addEventListener('click', () => {
			const allDescriptions = timelineContainer.querySelectorAll(
				'.timeline-main-description, .timeline-sub-description'
			);

			// Check if any descriptions are currently active
			const anyActive = Array.from(allDescriptions).some((desc) => desc.classList.contains('active'));

			// First, untoggle all descriptions
			allDescriptions.forEach((desc) => {
				desc.classList.remove('active');
			});

			// If none were active, toggle them all on after a brief delay
			if (!anyActive) {
				setTimeout(() => {
					allDescriptions.forEach((desc) => {
						desc.classList.add('active');
					});
				}, 50);
			}
		});

		// Create timeline wrapper
		const timeline = document.createElement('div');
		timeline.className = 'timeline';
		// Track which side to place the next item
		let side = 'left';
		// Process timeline data
		timelineData.forEach((item) => {
			// Create main item
			const mainItem = document.createElement('div');
			mainItem.className = `timeline-item timeline-main-item ${side}`;
			mainItem.setAttribute('data-id', item.id);

			const mainContent = document.createElement('div'); // Changed from <a> to <div>
			mainContent.className = 'timeline-content';
			mainContent.innerHTML = `
				<h3>${item.title}</h3>
				<div class="timeline-location" style="margin-left: auto">${item.location}</div>
				${item.is_new_session ? `<div class="timeline-new-session">New session</div>` : ''}
				${item.session ? `<span class="timeline-item-session">Session ${item.session}</span>` : ''}
			`;

			// If URL exists, wrap mainContent in an anchor tag
			if (item.url) {
				const linkWrapper = document.createElement('a');
				const params = `?campaign=${item.url.campaign}&session=${item.url.session}${
					item.url.target ? `#${item.url.target}` : ''
				}`;
				linkWrapper.href = params;
				linkWrapper.title = 'Go to this session recap point.';
				linkWrapper.appendChild(mainContent);
				mainItem.appendChild(linkWrapper);
			} else {
				mainItem.appendChild(mainContent);
			}

			if (item.description) {
				// Create button outside of mainContent
				const button = document.createElement('button');
				button.className = 'timeline-main-button';
				button.textContent = '›';
				button.type = 'button'; // Explicitly set button type

				// Add the button to the mainItem instead of mainContent
				mainItem.appendChild(button);

				const descriptionElement = document.createElement('div');
				descriptionElement.className = 'timeline-main-description';
				descriptionElement.innerHTML = item.description;
				mainItem.appendChild(descriptionElement);

				// Add event listener directly to the button
				button.onclick = function (event) {
					event.preventDefault();
					event.stopPropagation();
					descriptionElement.classList.toggle('active');
				};
			}

			timeline.appendChild(mainItem);

			// Flip side for the next main item group
			const nextSide = side === 'left' ? 'right' : 'left';

			const typeMap = {
				narrative: '💬',
				encounter: '⚔️',
				investigation: '🔎',
				traversal: '👣',
			};

			// Add subitems if any, keeping them on the same side
			if (item.items && item.items.length > 0) {
				item.items.forEach((subitem) => {
					const subitemEl = document.createElement('div');
					subitemEl.className = `timeline-item timeline-subitem ${side}`;
					subitemEl.setAttribute('data-parent-id', item.id);
					subitemEl.setAttribute('data-type', subitem.type);

					const subContent = document.createElement('div'); // Changed from <a> to <div>
					subContent.className = 'timeline-content';

					let subitemHTML = `
						<h4><span style="font-size: 8pt">${typeMap[subitem.type] || '❓'}</span> ${
						subitem.type.charAt(0).toUpperCase() + subitem.type.slice(1)
					}: ${subitem.actors}</h4>
					`;

					if (subitem.is_new_session) {
						subitemEl.classList.add('new-session-indicator');
						subitemHTML += `<div class="timeline-new-session">New session</div>`;
					}

					// Add sublocation if any
					if (subitem.sublocation) {
						subitemHTML += `<div class="timeline-sublocation">${subitem.sublocation}</div>`;
					}

					subContent.innerHTML = subitemHTML;

					// If URL exists, wrap subContent in an anchor tag
					if (subitem.url) {
						const linkWrapper = document.createElement('a');
						const params = `?campaign=${subitem.url.campaign}&session=${subitem.url.session}${
							subitem.url.target ? `#${subitem.url.target}` : ''
						}`;
						linkWrapper.href = params;
						linkWrapper.title = 'Go to this session recap point.';
						linkWrapper.appendChild(subContent);
						subitemEl.appendChild(linkWrapper);
					} else {
						subitemEl.appendChild(subContent);
					}

					// Add description toggle button for subitems if they have a description
					if (subitem.description) {
						// Create button for subitem
						const subButton = document.createElement('button');
						subButton.className = 'timeline-sub-button';
						subButton.textContent = '›';
						subButton.type = 'button'; // Explicitly set button type

						// Add the button to the subitemEl
						subitemEl.appendChild(subButton);

						// Create description element for subitem
						const subDescriptionElement = document.createElement('div');
						subDescriptionElement.className = 'timeline-sub-description';
						subDescriptionElement.innerHTML = subitem.description;
						subitemEl.appendChild(subDescriptionElement);

						// Add event listener directly to the subitem button
						subButton.onclick = function (event) {
							event.preventDefault();
							event.stopPropagation();
							subDescriptionElement.classList.toggle('active');
						};
					}

					timeline.appendChild(subitemEl);
				});
			}

			// Switch sides for next main item group
			side = nextSide;
		});

		timelineContainer.appendChild(timeline);
		contentArea.appendChild(timelineContainer);
		this.#processTimelinePlaceholders(timelineContainer);
	}

	async #loadContentArea(contentArea) {
		// Clear previous content
		contentArea.innerHTML = '';

		switch (this.#currentView) {
			case 'timeline':
				this.#renderTimeline(contentArea);
				break;
			case 'character':
				this.#loadCharacterBackground(contentArea);
				break;
			case 'session':
			default:
				await this.#loadSessionContent(contentArea); // Needs await
				break;
		}
	}

	async #loadSessionContent(contentArea) {
		// Assume contentArea is already cleared by #loadContentArea
		// If timeline is visible, render it (Handled by #loadContentArea)
		// if (this.#isTimelineVisible) { ... }
		// If a character is selected, show their background (Handled by #loadContentArea)
		// if (this.#selectedCharacterName) { ... }

		if (!this.#currentSessionId || !this.#campaign.recaps) {
			contentArea.innerHTML = '<div class="no-content">Select a session to view its content.</div>';
			return;
		}

		const session = this.#campaign.recaps.find((s) => s.id === this.#currentSessionId);
		if (!session) {
			console.error(`Session not found: ${this.#currentSessionId}`);
			contentArea.innerHTML = '<div class="no-content">Session not found. Please select another session.</div>';
			return;
		}

		// Helper function to fetch and parse Markdown (remains the same)
		const fetchAndParseMd = async (filePath) => {
			if (!filePath || typeof filePath !== 'string' || !filePath.endsWith('.md')) {
				return filePath || ''; // Return non-MD paths/content directly
			}
			const basePath = `src/databases/campaign_data/${this.#campaign.id.replace('-', '_')}/`;
			const fullPath = basePath + filePath;
			try {
				const response = await fetch(fullPath);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const mdContent = await response.text();
				return `${mdContent}`; // Fallback: display as preformatted text
			} catch (error) {
				console.error(`Error fetching or parsing Markdown file "${fullPath}":`, error);
				return `<div class="error">Error loading content: ${error.message}</div>`;
			}
		};

		// Create session TOC container (will be populated by #generateTableOfContents)
		const sessionToc = document.createElement('div');
		sessionToc.className = 'session-toc';
		const toc = document.createElement('div');
		toc.className = 'toc';
		toc.id = 'toc'; // Keep the ID for potential styling/JS hooks
		sessionToc.appendChild(toc);
		contentArea.appendChild(sessionToc); // Add TOC container to content area

		// Create session content container
		const sessionContent = document.createElement('div');
		sessionContent.className = 'session-content';
		// Add session header
		const sessionHeader = document.createElement('div');
		sessionHeader.className = 'session-header';
		sessionHeader.innerHTML = `
            <h2 id="session-title">${session.title}</h2>
            ${session.date ? `<div class="session-date">${session.date}</div>` : ''}
        `;
		sessionContent.appendChild(sessionHeader);

		// Process Short Summary (Recap)
		const sessionRecap = document.createElement('div');
		sessionRecap.className = 'session-small-recap';
		const tempRecap = document.createElement('div');
		tempRecap.innerHTML = `<h3 id="short-summary">Short Summary</h3>${await fetchAndParseMd(session?.recap)}`;
		this.#processPlaceholders(tempRecap, session);
		sessionRecap.appendChild(tempRecap);
		sessionContent.appendChild(sessionRecap);

		// Process Main Content
		const mainContentEl = document.createElement('div');
		mainContentEl.className = 'session-main-content';
		const tempMain = document.createElement('div');
		tempMain.innerHTML = `<h2 id="session-recap">Session Recap</h2>${await fetchAndParseMd(session.content)}`;
		this.#processPlaceholders(tempMain, session);
		mainContentEl.appendChild(tempMain);
		sessionContent.appendChild(mainContentEl);

		// Add session content to content area
		contentArea.appendChild(sessionContent);
	}

	#processPlaceholders(contentElement, session = null) {
		this.#processImages(contentElement);
		this.#processCharacterReferences(contentElement);
		this.#processEntityReferences(contentElement);
		// Process progression tags only if session data is available
		if (session) {
			this.#processProgressionTags(contentElement, session);
		}
		// Needs to run *after* character/entity references have created the spans
		this.#processCharacterHighlights(contentElement);
	}

	#scrollToHash() {
		const hash = window.location.hash;
		if (hash) {
			try {
				// Use substring(1) to remove the '#'
				const element = document.getElementById(hash.substring(1));
				if (element) {
					// Use setTimeout to ensure rendering is complete, especially after async ops
					setTimeout(() => {
						element.scrollIntoView({
							behavior: 'smooth',
							block: 'start', // Align to top
						});
					}, 100); // Small delay might be needed
				}
			} catch (e) {
				// Catch potential errors if ID is invalid for querySelector
				console.warn(`Could not find or scroll to element with ID: ${hash}`, e);
			}
		}
	}

	#generateTableOfContents(contentArea) {
		// Find headings only within the main session content, not the TOC itself
		const sessionContent = contentArea.querySelector('.session-content');
		if (!sessionContent) return; // No session content rendered

		const headings = sessionContent.querySelectorAll('h1, h2, h3, h4'); // Include h4 if needed
		if (headings.length === 0) return;

		// Get the TOC container (already created in #loadSessionContent)
		const tocContainer = contentArea.querySelector('.toc');
		if (!tocContainer) return;
		tocContainer.innerHTML = ''; // Clear previous TOC content

		// Create TOC title
		const tocTitle = document.createElement('h3');
		tocTitle.textContent = 'On this page'; // More common TOC title
		tocTitle.className = 'toc-title';
		tocContainer.appendChild(tocTitle);
		// Create the list
		const tocList = document.createElement('ul');
		tocList.className = 'toc-list';
		tocContainer.appendChild(tocList);
		// Process headings and add to TOC
		headings.forEach((heading, index) => {
			// Ensure heading has an ID for linking
			if (!heading.id) {
				// Create a simple slug from text content
				const slug = heading.textContent
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-') // Replace spaces with dashes
					.replace(/[^\w-]+/g, ''); // Remove non-word characters except dashes
				heading.id = slug || `heading-${index}`; // Fallback to index if slug is empty
			}

			// Create link items for TOC
			const item = document.createElement('li');
			item.className = `toc-item toc-level-${heading.tagName.toLowerCase()}`; // e.g., toc-level-h2

			const link = document.createElement('a');
			link.href = `#${heading.id}`; // Link to the heading ID
			link.textContent = heading.textContent;
			link.className = 'toc-link';

			// Add smooth scroll event AND update URL hash without reloading
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetElement = document.getElementById(heading.id);
				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
					// Update URL hash without triggering navigation or adding to history stack
					history.replaceState(null, '', `#${heading.id}`);
				}
			});

			item.appendChild(link);
			tocList.appendChild(item);
		});
	}

	#loadCharacterBackground(contentArea) {
		// Clear and validate
		if (!this.#selectedCharacterName) {
			contentArea.innerHTML = '<div class="no-content">No character selected.</div>';
			return;
		}

		if (!this.#campaign.metadata?.characters) {
			contentArea.innerHTML = '<div class="no-content">Character information not available for this campaign.</div>';
			return;
		}

		const character = this.#campaign.metadata.characters.find((c) => c.name === this.#selectedCharacterName);
		if (!character) {
			console.error(`Character not found: ${this.#selectedCharacterName}`);
			contentArea.innerHTML = '<div class="no-content">Character details not found.</div>';
			return;
		}

		// Create main container with parchment-like background
		const characterSheet = document.createElement('div');
		characterSheet.className = 'character-sheet';

		// Header section with character identity
		const headerSection = this.#createCharacterHeader(character);
		characterSheet.appendChild(headerSection);

		// Two-column layout for character details
		const columnsContainer = document.createElement('div');
		columnsContainer.className = 'character-columns';

		// Left column (character image and background)
		const leftColumn = this.#createLeftColumn(character);
		columnsContainer.appendChild(leftColumn);

		// Right column (stats, abilities, features)
		const rightColumn = this.#createRightColumn(character);
		columnsContainer.appendChild(rightColumn);

		characterSheet.appendChild(columnsContainer);
		contentArea.appendChild(characterSheet);
	}

	// Helper methods for modular construction
	#createCharacterHeader(character) {
		const header = document.createElement('header');
		header.className = 'character-header';

		const title = document.createElement('h1');
		title.className = 'character-title';
		title.textContent = character.name;

		const subtitle = document.createElement('h2');
		subtitle.className = 'character-subtitle';
		subtitle.textContent = `${character.race} ${character.class} • Level ${character.level}`;

		header.appendChild(title);
		header.appendChild(subtitle);

		return header;
	}

	#createLeftColumn(character) {
		const column = document.createElement('div');
		column.className = 'character-column character-column--left';

		if (character.imageBg) {
			const portrait = document.createElement('div');
			portrait.className = 'character-portrait';

			const img = document.createElement('img');
			img.src = character.imageBg;
			img.alt = `${character.name} portrait`;
			img.className = 'character-portrait__image';

			portrait.appendChild(img);
			column.appendChild(portrait);
		}

		if (character.background) {
			const section = document.createElement('section');
			section.className = 'character-section character-background';

			const header = document.createElement('h3');
			header.className = 'character-section__header';
			header.textContent = 'Background';
			section.appendChild(header);

			const content = document.createElement('div');
			content.className = 'character-section__content';
			content.innerHTML = character.background;
			this.#processEntityReferences(content);
			section.appendChild(content);

			column.appendChild(section);
		}

		// Spells
		if (character.stats.metadata.spellData?.length) {
			const spells = this.#createSpellsSection(character.stats.metadata.spellData);
			column.appendChild(spells);
		}

		return column;
	}

	#createRightColumn(character) {
		const column = document.createElement('div');
		column.className = 'character-column character-column--right';

		if (character.stats?.metadata) {
			// Vital Stats
			if (
				character.stats.metadata.armorClass ||
				character.stats.metadata.healthPoints ||
				character.stats.metadata.walkingSpeed
			) {
				const vitals = this.#createVitalsSection(character.stats.metadata);
				column.appendChild(vitals);
			}

			// Ability Scores
			if (character.stats.metadata.abilityScores?.length) {
				const abilities = this.#createAbilitiesSection(character.stats.metadata.abilityScores);
				column.appendChild(abilities);
			}

			// Saving Throws
			if (character.stats.metadata.savingThrows?.length) {
				const saves = this.#createSavingThrowsSection(character.stats.metadata.savingThrows);
				column.appendChild(saves);
			}

			// Actions
			if (character.stats.metadata.actionData?.length) {
				const actions = this.#createActionsSection(character.stats.metadata.actionData);
				column.appendChild(actions);
			}

			// Features
			if (character.stats.metadata.features?.length) {
				const features = this.#createFeaturesSection(character.stats.metadata.features);
				column.appendChild(features);
			}
		}

		return column;
	}

	#createVitalsSection(metadata) {
		const section = document.createElement('section');
		section.className = 'character-section character-vitals';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Vital Statistics';
		section.appendChild(header);

		const grid = document.createElement('div');
		grid.className = 'character-vitals__grid';

		const vitals = [
			{ name: 'Armor Class', value: metadata.armorClass || '-', class: 'ac' },
			{ name: 'Hit Points', value: metadata.healthPoints || '-', class: 'hp' },
			{ name: 'Speed', value: metadata.walkingSpeed || '-', class: 'speed' },
		];

		vitals.forEach((vital) => {
			const item = document.createElement('div');
			item.className = `character-vitals__item character-vitals__item--${vital.class}`;

			const label = document.createElement('span');
			label.className = 'character-vitals__label';
			label.textContent = vital.name;

			const value = document.createElement('span');
			value.className = 'character-vitals__value';
			value.textContent = vital.value;

			item.appendChild(label);
			item.appendChild(value);
			grid.appendChild(item);
		});

		section.appendChild(grid);
		return section;
	}

	#createAbilitiesSection(abilityScores) {
		const section = document.createElement('section');
		section.className = 'character-section character-abilities';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Ability Scores';
		section.appendChild(header);

		const grid = document.createElement('div');
		grid.className = 'character-abilities__grid';

		abilityScores.forEach((ability) => {
			const item = document.createElement('div');
			item.className = 'character-abilities__item';

			const name = document.createElement('div');
			name.className = 'character-abilities__name';
			name.textContent = ability.abbr.toUpperCase();

			const value = document.createElement('div');
			value.className = 'character-abilities__value';
			value.textContent = ability.value;

			const modifier = document.createElement('div');
			modifier.className = 'character-abilities__modifier';
			modifier.textContent = `(${ability.score})`;

			item.appendChild(name);
			item.appendChild(value);
			item.appendChild(modifier);
			grid.appendChild(item);
		});

		section.appendChild(grid);
		return section;
	}

	#createSavingThrowsSection(savingThrows) {
		const section = document.createElement('section');
		section.className = 'character-section character-saves';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Saving Throws';
		section.appendChild(header);

		const list = document.createElement('div');
		list.className = 'character-saves__list';

		savingThrows.forEach((save) => {
			const item = document.createElement('div');
			item.className = 'character-saves__item';

			const name = document.createElement('span');
			name.className = 'character-saves__name';
			name.textContent = save.name.toUpperCase();

			const value = document.createElement('span');
			value.className = 'character-saves__value';
			value.textContent = save.value;

			item.appendChild(name);
			item.appendChild(value);
			list.appendChild(item);
		});

		section.appendChild(list);
		return section;
	}

	#createActionsSection(actions) {
		const section = document.createElement('section');
		section.className = 'character-section character-actions';

		const headerRow = document.createElement('div');
		headerRow.className = 'character-section__header-row';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Actions';
		headerRow.appendChild(header);

		// Add toggle all button
		if (actions.some((action) => action.description)) {
			const toggleAll = document.createElement('button');
			toggleAll.className = 'character-section__toggle-all';
			toggleAll.textContent = 'Toggle All';
			toggleAll.addEventListener('click', () => {
				const allDescriptions = section.querySelectorAll('.character-actions__description');
				const anyVisible = Array.from(allDescriptions).some((d) => d.style.display !== 'none');

				allDescriptions.forEach((desc) => {
					desc.style.display = anyVisible ? 'none' : 'block';
				});

				// Update individual toggle buttons
				section.querySelectorAll('.character-actions__toggle').forEach((btn) => {
					btn.textContent = anyVisible ? 'Show' : 'Hide';
				});
			});
			headerRow.appendChild(toggleAll);
		}

		section.appendChild(headerRow);

		const list = document.createElement('div');
		list.className = 'character-actions__list';

		actions.forEach((action) => {
			const item = document.createElement('div');
			item.className = 'character-actions__item';

			const nameRow = document.createElement('div');
			nameRow.className = 'character-actions__name-row';

			const name = document.createElement('h4');
			name.className = 'character-actions__name';
			name.textContent = action.name;
			nameRow.appendChild(name);

			if (action.description) {
				const toggle = document.createElement('button');
				toggle.className = 'character-actions__toggle';
				toggle.textContent = 'Show';
				toggle.addEventListener('click', () => {
					const desc = item.querySelector('.character-actions__description');
					if (desc.style.display === 'none') {
						desc.style.display = 'block';
						toggle.textContent = 'Hide';
					} else {
						desc.style.display = 'none';
						toggle.textContent = 'Show';
					}
				});
				nameRow.appendChild(toggle);
			}

			item.appendChild(nameRow);

			if (action.description) {
				const desc = document.createElement('div');
				desc.className = 'character-actions__description';
				desc.innerHTML = action.description;
				desc.style.display = 'none'; // Hidden by default
				this.#processEntityReferences(desc);
				item.appendChild(desc);
			}

			list.appendChild(item);
		});

		section.appendChild(list);
		return section;
	}

	#createFeaturesSection(features) {
		const section = document.createElement('section');
		section.className = 'character-section character-features';

		const headerRow = document.createElement('div');
		headerRow.className = 'character-section__header-row';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Features & Traits';
		headerRow.appendChild(header);

		// Add toggle all button
		if (features.some((feature) => feature.description)) {
			const toggleAll = document.createElement('button');
			toggleAll.className = 'character-section__toggle-all';
			toggleAll.textContent = 'Toggle All';
			toggleAll.addEventListener('click', () => {
				const allDescriptions = section.querySelectorAll('.character-features__description');
				const anyVisible = Array.from(allDescriptions).some((d) => d.style.display !== 'none');

				allDescriptions.forEach((desc) => {
					desc.style.display = anyVisible ? 'none' : 'block';
				});

				// Update individual toggle buttons
				section.querySelectorAll('.character-features__toggle').forEach((btn) => {
					btn.textContent = anyVisible ? 'Show' : 'Hide';
				});
			});
			headerRow.appendChild(toggleAll);
		}

		section.appendChild(headerRow);

		const list = document.createElement('div');
		list.className = 'character-features__list';

		features.forEach((feature) => {
			const item = document.createElement('div');
			item.className = 'character-features__item';

			const nameRow = document.createElement('div');
			nameRow.className = 'character-features__name-row';

			const name = document.createElement('h4');
			name.className = 'character-features__name';
			name.textContent = feature.name;
			nameRow.appendChild(name);

			if (feature.description) {
				const toggle = document.createElement('button');
				toggle.className = 'character-features__toggle';
				toggle.textContent = 'Show';
				toggle.addEventListener('click', () => {
					const desc = item.querySelector('.character-features__description');
					if (desc.style.display === 'none') {
						desc.style.display = 'block';
						toggle.textContent = 'Hide';
					} else {
						desc.style.display = 'none';
						toggle.textContent = 'Show';
					}
				});
				nameRow.appendChild(toggle);
			}

			item.appendChild(nameRow);

			if (feature.description) {
				const desc = document.createElement('div');
				desc.className = 'character-features__description';
				desc.innerHTML = feature.description;
				desc.style.display = 'none'; // Hidden by default
				this.#processEntityReferences(desc);
				item.appendChild(desc);
			}

			list.appendChild(item);
		});

		section.appendChild(list);
		return section;
	}

	#createSpellsSection(spellData) {
		const section = document.createElement('section');
		section.className = 'character-section character-spells';

		const header = document.createElement('h3');
		header.className = 'character-section__header';
		header.textContent = 'Spells';
		section.appendChild(header);

		spellData.forEach((group) => {
			const groupContainer = document.createElement('div');
			groupContainer.className = 'character-spells__group';

			const groupHeaderRow = document.createElement('div');
			groupHeaderRow.className = 'character-spells__group-header-row';

			const groupHeader = document.createElement('h4');
			groupHeader.className = 'character-spells__group-header';
			groupHeader.textContent = group.groupName;
			groupHeaderRow.appendChild(groupHeader);

			// Add toggle button for this spell group
			if (group.spells.length > 0) {
				const toggleGroup = document.createElement('button');
				toggleGroup.className = 'character-spells__group-toggle';
				toggleGroup.textContent = 'Hide spells';
				toggleGroup.addEventListener('click', () => {
					const list = groupContainer.querySelector('.character-spells__list');
					if (list.style.display === 'none') {
						list.style.display = 'flex';
						toggleGroup.textContent = 'Hide spells';
					} else {
						list.style.display = 'none';
						toggleGroup.textContent = 'Show spells';
					}
				});
				groupHeaderRow.appendChild(toggleGroup);
			}

			groupContainer.appendChild(groupHeaderRow);

			const list = document.createElement('div');
			list.className = 'character-spells__list';

			group.spells.forEach((spell) => {
				const item = document.createElement('div');
				item.className = 'character-spells__item';

				const name = document.createElement('div');
				name.className = 'character-spells__name';
				name.innerHTML = `[ENTITY:spell:${spell.spellInfo.spellName}]`;
				this.#processEntityReferences(name);

				const meta = document.createElement('div');
				meta.className = 'character-spells__meta';

				const range = document.createElement('span');
				range.className = 'character-spells__range';
				range.textContent = spell.range;

				const slot = document.createElement('span');
				slot.className = 'character-spells__slot';
				slot.textContent = spell.slotType;

				const effect = document.createElement('span');
				effect.className = 'character-spells__effect';
				effect.textContent = spell.effect;

				meta.appendChild(range);
				meta.appendChild(slot);
				meta.appendChild(effect);

				if (spell.spellInfo.spellMetaInfo) {
					const note = document.createElement('div');
					note.className = 'character-spells__note';
					note.textContent = spell.spellInfo.spellMetaInfo;
					meta.appendChild(note);
				}

				item.appendChild(name);
				item.appendChild(meta);
				list.appendChild(item);
			});

			groupContainer.appendChild(list);
			section.appendChild(groupContainer);
		});

		return section;
	}

	#processImages(contentElement) {
		// Find all image placeholders
		// Format: [IMAGE:path/to/image.jpg:optional-caption:optional-width:optional-alignment:optional-inline]
		const text = contentElement.innerHTML;
		const processedText = text.replace(
			/\[IMAGE:(.*?)(?::(.*?))?(?::(.*?))?(?::(.*?))?(?::(.*?))?\]/g,
			(match, src, caption = '', width = '', alignment = 'center', inline = 'false') => {
				const widthAttr = width ? `width="${width}"` : '';
				const alignClass = `image-align-${alignment}`;
				const inlineClass = inline === 'true' ? 'image-inline' : '';

				return `
					<div class="story-image-container ${alignClass} ${inlineClass}">
						<img src="${src}" ${widthAttr} alt="${caption}" />
						${caption ? `<div class="image-caption">${caption}</div>` : ''}
					</div>
				`;
			}
		);

		contentElement.innerHTML = processedText;
	}

	#processCharacterReferences(contentElement) {
		if (!this.#campaign.metadata?.characters?.length) return;

		// Get character names for regex pattern
		const characterNames = this.#campaign.metadata.characters
			.map((char) => char.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
			.join('|');

		// Skip if no characters
		if (!characterNames) return;

		// Create regex to find character names in text
		const characterRegex = new RegExp(`\\[CHARACTER:(${characterNames})\\]`, 'g');

		// Find all text nodes in the content
		const textNodes = [];
		const walker = document.createTreeWalker(contentElement, NodeFilter.SHOW_TEXT, null, false);

		let node;
		while ((node = walker.nextNode())) {
			textNodes.push(node);
		}

		// Process each text node
		textNodes.forEach((textNode) => {
			const text = textNode.nodeValue;
			if (characterRegex.test(text)) {
				const fragment = document.createDocumentFragment();
				let lastIndex = 0;
				let match;

				// Reset regex
				characterRegex.lastIndex = 0;

				while ((match = characterRegex.exec(text)) !== null) {
					// Add text before the match
					if (match.index > lastIndex) {
						fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
					}

					// Create highlighted span for character
					const span = document.createElement('span');
					span.className = 'character-highlight';
					span.setAttribute('data-character', match[1]);
					span.textContent = match[1];
					fragment.appendChild(span);

					lastIndex = characterRegex.lastIndex;
				}

				// Add remaining text
				if (lastIndex < text.length) {
					fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
				}

				// Replace the text node with the fragment
				textNode.parentNode.replaceChild(fragment, textNode);
			}
		});
	}

	#processCharacterHighlights(contentElement) {
		// Attaches tooltips to spans with 'character-highlight' class
		if (!this.#campaign.metadata?.characters?.length) return;

		const characterMap = new Map();
		this.#campaign.metadata.characters.forEach((char) => {
			characterMap.set(char.name, char);
		});

		const spans = contentElement.querySelectorAll('span.character-highlight'); // Target the spans created by #processCharacterReferences
		spans.forEach((span) => {
			const characterName = span.getAttribute('data-character');
			if (characterMap.has(characterName)) {
				// Ensure text content matches (might be redundant if #processCharacterReferences works)
				span.textContent = characterName;
				// Add tooltip events
				this.#addCharacterTooltipEvents(span, characterMap.get(characterName));
			} else {
				// Optional: Remove attribute or class if character data is missing
				// span.removeAttribute('data-character');
				// span.classList.remove('character-highlight');
			}
		});
	}

	#processEntityReferences(contentElement) {
		// Finds [ENTITY:type:name] or [ENTITY:type:name:givenName] and replaces with spans for tooltips
		// This should run *before* tooltip attachment logic if separated
		const text = contentElement.innerHTML;
		const processedText = text.replace(
			/\[ENTITY:([\w-]+):([^:\]]+)(?::([^\]]+))?\]/gi,
			(match, type, name, givenName) => {
				// More specific type regex
				const cleanType = type.toLowerCase().trim();
				const cleanName = name.trim();
				// Basic validation
				if (!cleanType || !cleanName) return match; // Return original if malformed

				const displayText = givenName ? givenName.trim() : cleanName;
				return `<span class="entity-reference entity-${cleanType}" data-entity-type="${cleanType}" data-entity-name="${cleanName}">${displayText}</span>`;
			}
		);
		contentElement.innerHTML = processedText;

		// Attach event listeners
		const entitySpans = contentElement.querySelectorAll('.entity-reference');
		entitySpans.forEach((span) => {
			const entityType = span.getAttribute('data-entity-type');
			const entityName = span.getAttribute('data-entity-name');
			if (entityType && entityName) {
				this.#addEntityTooltipEvents(span, entityType, entityName);
			}
		});
	}

	#processProgressionTags(contentElement, session) {
		// Finds [PROGRESSION:type:value] - remains the same
		const progressionRegex = /\[PROGRESSION:(levelup|loot):(.*?)\]/g;
		const walker = document.createTreeWalker(contentElement, NodeFilter.SHOW_TEXT, null, false);
		const textNodes = [];
		while (walker.nextNode()) textNodes.push(walker.currentNode);

		textNodes.forEach((node) => {
			const text = node.nodeValue;
			if (!progressionRegex.test(text)) return;

			const fragment = document.createDocumentFragment();
			let lastIndex = 0;
			let match;
			progressionRegex.lastIndex = 0;

			while ((match = progressionRegex.exec(text)) !== null) {
				if (match.index > lastIndex) {
					fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
				}
				const type = match[1];
				const value = match[2];
				let replacementNode = null;
				if (type === 'levelup') {
					replacementNode = this.#generateLevelUpElement(value);
				} else if (type === 'loot') {
					replacementNode = this.#generateLootElement(value, session);
				}
				if (replacementNode) fragment.appendChild(replacementNode);
				lastIndex = progressionRegex.lastIndex;
			}
			if (lastIndex < text.length) {
				fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
			}
			node.parentNode.replaceChild(fragment, node);
		});
	}

	#generateLevelUpElement(level) {
		/* ... remains the same ... */ //
		const levelUpDiv = document.createElement('div');
		levelUpDiv.className = 'progression-levelup';
		levelUpDiv.innerHTML = `
            <div class="levelup-icon">✨</div>
            <div class="levelup-text">
                <h2>Level Up!</h2>
                <p>Congratulations!
The party has reached level <strong>${level}</strong>!</p>
            </div>
        `;
		return levelUpDiv;
	}
	#generateLootElement(lootId, session) {
		/* ... remains the same ... */ //
		const lootContainer = document.createElement('div');
		lootContainer.className = 'progression-loot';

		const lootData = session?.progression?.loot?.find((l) => l.id === lootId);
		if (!lootData || !lootData.data || lootData.data.length === 0) {
			lootContainer.innerHTML = '<p><em>Loot information not found.</em></p>';
			return lootContainer;
		}

		const title = document.createElement('h4');
		title.textContent = `Loot Found (${lootId})`;
		lootContainer.appendChild(title);

		const list = document.createElement('ul');
		list.className = 'loot-list';
		lootData.data.forEach((item) => {
			const listItem = document.createElement('li');
			listItem.className = `loot-item rarity-${item.rarity || 'common'}`;

			let ownerText = item.owner ? ` <span class="loot-owner">(${item.owner})</span>` : '';
			// Process item name for entities
			const itemNameSpan = document.createElement('span');
			itemNameSpan.className = 'loot-item-name';
			itemNameSpan.innerHTML = item.itemName; // Assume item name might contain entity refs
			this.#processEntityReferences(itemNameSpan);

			listItem.innerHTML = `
                ${itemNameSpan.outerHTML} ${item.count > 1 ? `(x${item.count})` : ''}
                ${ownerText}
                ${item.description ? `<div class="loot-item-description">${item.description}</div>` : ''}
            `;
			// Process description for entities if it exists
			if (item.description) {
				const descDiv = listItem.querySelector('.loot-item-description');
				if (descDiv) this.#processEntityReferences(descDiv);
			}

			list.appendChild(listItem);
		});
		lootContainer.appendChild(list);
		return lootContainer;
	}

	// --- Tooltip Methods ---

	#createTooltipContainer() {
		/* ... remains the same ... */
		this.#tooltipContainer = document.getElementById('character-tooltip-container');
		if (!this.#tooltipContainer) {
			this.#tooltipContainer = document.createElement('div');
			this.#tooltipContainer.id = 'character-tooltip-container';
			this.#tooltipContainer.className = 'character-tooltip-container'; // Use a more generic name maybe? 'dynamic-tooltip-container'
			this.#tooltipContainer.style.position = 'absolute'; // Ensure positioning works
			this.#tooltipContainer.style.zIndex = '1000'; // Keep on top
			this.#tooltipContainer.style.display = 'none';
			document.body.appendChild(this.#tooltipContainer);
		}
	}

	#addCharacterTooltipEvents(element, character) {
		/* ... remains the same ... */ //
		element.addEventListener('mouseover', (e) => {
			// Prevent triggering parent tooltips if nested
			e.stopPropagation();
			this.#tooltipContainer.innerHTML = `
                <div class="character-tooltip">
                    <div class="tooltip-header">
                        <img src="${character.icon}" alt="${character.name}" />
                        <h3>${character.name}</h3>

                   </div>
                    <div class="tooltip-content">
                        <div><strong>Race:</strong> ${character.race}</div>
                        <div><strong>Class:</strong> ${character.class}</div>

              <div><strong>Level:</strong> ${character.level}</div>
                        ${
													character.shortDescription
														? `<div class="tooltip-description tooltip-background">${character.shortDescription}</div>`
														: ''
												}
                    </div>
                </div>
            `;
			this.#positionTooltip(element); // Position and show
		});

		element.addEventListener('mouseout', () => {
			this.#tooltipContainer.style.display = 'none';
		});
	}

	#addEntityTooltipEvents(element, entityType, entityName) {
		element.classList.add('entity-' + entityType);

		element.addEventListener('mouseover', async (e) => {
			// Show loading state
			this.#tooltipContainer.innerHTML = `
				<div class="entity-tooltip">
				<div class="tooltip-header">
					<h3>${entityName}</h3>
				</div>
				<div class="tooltip-content">
					<div>Loading ${entityType} information...</div>
				</div>
				</div>
			`;

			// Position and show the tooltip
			this.#tooltipContainer.style.display = 'block';
			this.#positionTooltip(element);

			// Fetch entity data
			try {
				const entityData = await this.#fetchEntityData(entityType, entityName);

				// Update tooltip with fetched data
				if (entityData) {
					this.#tooltipContainer.innerHTML = this.#generateEntityTooltipContent(entityType, entityData);
					// Reposition in case content size changed
					this.#positionTooltip(element);
				} else {
					this.#tooltipContainer.innerHTML = `
						<div class="entity-tooltip">
						<div class="tooltip-header">
							<h3>${entityName}</h3>
						</div>
						<div class="tooltip-content">
							<div>No information found for this ${entityType}.</div>
						</div>
						</div>
					`;
				}
			} catch (error) {
				this.#tooltipContainer.innerHTML = `
					<div class="entity-tooltip">
						<div class="tooltip-header">
						<h3>${entityName}</h3>
						</div>
						<div class="tooltip-content">
						<div>Error loading information: ${error.message}</div>
						</div>
					</div>
					`;
				console.error(`Error fetching entity data:`, error);
			}
		});

		element.addEventListener('mouseout', () => {
			this.#tooltipContainer.style.display = 'none';
		});
	}

	#positionTooltip(element) {
		/* ... remains the same ... */ //
		// Make tooltip visible to calculate dimensions, but keep off-screen initially
		this.#tooltipContainer.style.visibility = 'hidden';
		this.#tooltipContainer.style.display = 'block';
		this.#tooltipContainer.style.top = '-9999px';
		this.#tooltipContainer.style.left = '-9999px';

		const elementRect = element.getBoundingClientRect();
		const tooltipRect = this.#tooltipContainer.getBoundingClientRect();
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
			scrollX: window.scrollX,
			scrollY: window.scrollY,
		};
		// Calculate available space
		const space = {
			above: elementRect.top, // Distance from top of element to top of viewport
			below: viewport.height - elementRect.bottom, // Distance from bottom of element to bottom of viewport
			left: elementRect.left, // Distance from left of element to left of viewport
			right: viewport.width - elementRect.right, // Distance from right of element to right of viewport
		};

		// Default position: below, aligned left
		let position = 'below';
		let horizontalAlign = 'left'; // 'left', 'right', 'center' (for element)
		let verticalAlign = 'top'; // 'top', 'bottom', 'center' (for element)

		// Determine best vertical position
		if (space.below >= tooltipRect.height) {
			position = 'below';
		} else if (space.above >= tooltipRect.height) {
			position = 'above';
		} else if (space.right >= tooltipRect.width) {
			// Try side if below/above don't fit
			position = 'right';
		} else if (space.left >= tooltipRect.width) {
			position = 'left';
		} // else: stick with 'below' and let overflow logic handle it

		// Determine horizontal alignment for above/below
		if (position === 'below' || position === 'above') {
			if (elementRect.left + tooltipRect.width > viewport.width - 10) {
				// Check overflow right (10px buffer)
				horizontalAlign = 'right'; // Align tooltip right edge with element right edge
			} else {
				horizontalAlign = 'left'; // Align tooltip left edge with element left edge
			}
		}
		// Determine vertical alignment for left/right
		if (position === 'left' || position === 'right') {
			if (elementRect.top + tooltipRect.height > viewport.height - 10) {
				verticalAlign = 'bottom'; // Align tooltip bottom with element bottom
			} else {
				verticalAlign = 'top'; // Align tooltip top with element top
			}
		}

		// Calculate position coordinates based on elementRect and viewport scroll offset
		let coords = { top: 0, left: 0 };
		const buffer = 8; // Small gap between element and tooltip

		switch (position) {
			case 'below':
				coords.top = elementRect.bottom + viewport.scrollY + buffer;
				coords.left =
					horizontalAlign === 'left'
						? elementRect.left + viewport.scrollX
						: elementRect.right + viewport.scrollX - tooltipRect.width;
				break;
			case 'above':
				coords.top = elementRect.top + viewport.scrollY - tooltipRect.height - buffer;
				coords.left =
					horizontalAlign === 'left'
						? elementRect.left + viewport.scrollX
						: elementRect.right + viewport.scrollX - tooltipRect.width;
				break;
			case 'right':
				coords.top =
					verticalAlign === 'top'
						? elementRect.top + viewport.scrollY
						: elementRect.bottom + viewport.scrollY - tooltipRect.height;
				coords.left = elementRect.right + viewport.scrollX + buffer;
				break;
			case 'left':
				coords.top =
					verticalAlign === 'top'
						? elementRect.top + viewport.scrollY
						: elementRect.bottom + viewport.scrollY - tooltipRect.height;
				coords.left = elementRect.left + viewport.scrollX - tooltipRect.width - buffer;
				break;
		}

		// Ensure tooltip stays within viewport bounds (add 10px margin)
		coords.left = Math.max(
			viewport.scrollX + 10,
			Math.min(coords.left, viewport.scrollX + viewport.width - tooltipRect.width - 10)
		);
		coords.top = Math.max(
			viewport.scrollY + 10,
			Math.min(coords.top, viewport.scrollY + viewport.height - tooltipRect.height - 10)
		);

		// Apply final position and make visible
		this.#tooltipContainer.style.top = `${coords.top}px`;
		this.#tooltipContainer.style.left = `${coords.left}px`;
		this.#tooltipContainer.style.visibility = 'visible'; // Make visible now that it's positioned
	}

	async #fetchEntityData(entityType, entityName) {
		// First check our custom data for locations, guilds, etc
		if (this.#customApiData[entityType] && this.#customApiData[entityType][entityName]) {
			return this.#customApiData[entityType][entityName];
		}

		// For standard DND 5e API entities
		if (this.#supportedEntityTypes.includes(entityType)) {
			// Format the name for API (lowercase, dashes instead of spaces)
			const formattedName = entityName.toLowerCase().replace(/\s+/g, '-');

			try {
				// First, try direct access if we know the exact endpoint
				const response = await fetch(`${this.#apiBaseUrl}${this.#entityEndpoints[entityType]}/${formattedName}`);

				if (response.ok) {
					return await response.json();
				}

				// If direct access fails, try to search
				const searchResponse = await fetch(
					`${this.#apiBaseUrl}${this.#entityEndpoints[entityType]}?name=${encodeURIComponent(entityName)}`
				);

				if (searchResponse.ok) {
					const searchData = await searchResponse.json();

					// If we have results, fetch the first one
					if (searchData.results && searchData.results.length > 0) {
						const detailResponse = await fetch(`${this.#apiBaseUrl}${searchData.results[0].url}`);
						if (detailResponse.ok) {
							return await detailResponse.json();
						}
					}
				}

				// If all attempts fail, return null
				return null;
			} catch (error) {
				console.error(`Error fetching ${entityType} data for ${entityName}:`, error);
				throw error;
			}
		}

		// Return null for unsupported entity types
		return null;
	}

	#generateEntityTooltipContent(entityType, entityData) {
		let content = `
			<div class="entity-tooltip entity-${entityType}-tooltip">
				<div class="tooltip-header">
				${entityType === 'character' ? `<img src="${entityData.icon}" alt="${entityData.name}" />` : ''}
				<h3>${entityData.name || entityData.title || entityData.spellName || 'Unknown'}</h3>
				</div>
				<div class="tooltip-content">
			`;

		// Different formatting based on entity type
		switch (entityType) {
			case 'spell':
				content += `
				<div><strong>Level:</strong> ${entityData.level || 'Cantrip'}</div>
				<div><strong>School:</strong> ${
					entityData.spellClass
						? entityData.spellClass.charAt(0).toUpperCase() + entityData.spellClass.slice(1)
						: 'Unknown'
				}</div>
				<div><strong>Casting Time:</strong> ${entityData.castingTime || 'N/A'}</div>
				<div><strong>Range:</strong> ${entityData.range || 'N/A'}</div>
				<div><strong>Components:</strong> ${entityData.components || 'None'}</div>
				<div><strong>Duration:</strong> ${entityData.duration || 'Instantaneous'}</div>
				<div><strong>Classes:</strong> ${entityData.classes?.join(', ') || 'N/A'}</div>
				<div><strong>Source:</strong> ${entityData.source || 'Unknown'}</div>
				<div class="tooltip-description tooltip-background">${entityData.description || 'No description available.'}</div>
				`;
				break;

			case 'monster':
				content += `
					<div><strong>Type:</strong> ${entityData.type || 'Unknown'}</div>
					<div><strong>CR:</strong> ${entityData.challenge_rating || 'Unknown'}</div>
					<div><strong>AC:</strong> ${entityData.armor_class || 'Unknown'}</div>
					<div><strong>HP:</strong> ${entityData.hit_points || 'Unknown'}</div>
					<div class="tooltip-description tooltip-background">${
						entityData.desc || entityData.description || 'No description available.'
					}</div>
					`;
				break;

			case 'class':
				content += `
					  <div><strong>Hit Die:</strong> d${entityData.hit_die || '?'}</div>
					  <div><strong>Proficiencies:</strong> ${entityData.proficiencies?.map((p) => p.name).join(', ') || 'None'}</div>
					  <div><strong>Saves:</strong> ${entityData.saving_throws?.map((s) => s.name).join(', ') || 'None'}</div>
					  <div><strong>Spellcasting:</strong> ${entityData.spellcasting ? 'Yes' : 'No'}</div>
					  <div><strong>Subclasses:</strong> ${entityData.subclasses?.map((p) => p.name).join(', ') || 'None'}</div>
					`;
				break;

			case 'subclass':
				content += `
					  <div><strong>Subclass Of:</strong> ${entityData.class?.name || 'Unknown'}</div>
					  <div><strong>Features:</strong> ${entityData.subclass_flavor || 'No flavor text'}</div>
					  <div class="tooltip-description tooltip-background">${
							entityData.desc || entityData.description || 'No description available.'
						}</div>
					`;
				break;
			case 'location':
			case 'guild':
			case 'race':
				content += `
										${
											entityData?.metadata
												? Object.entries(entityData?.metadata)
														.map(
															([key, entry]) =>
																`<div class="tooltip-metadata"><span>${key}</span><span>${entry}</span></div>`
														)
														.join('')
												: ''
										}
				<div class="tooltip-description tooltip-background">${entityData.description || 'No description available.'}</div>
				`;
				break;
			case 'character':
				content += `
					<div><strong>Race:</strong> ${entityData.race || 'Unknown'}</div>
					<div><strong>Class:</strong> ${entityData.class || 'Unknown'}</div>
					<div><strong>Level:</strong> ${entityData.level || 'Unknown'}</div>
					${
						entityData?.stats?.abilityScores
							? '<div class="tooltip-scores-container tooltip-background">' +
							  Object.entries(entityData?.stats?.abilityScores)
									?.map(
										([key, entry]) =>
											`<div class="tooltip-ability"><span class="tooltip-ability-name">${key}</span><span class="tooltip-ability-value">${entry}</span></div>`
									)
									.join('') +
							  '</div>'
							: ''
					}
					<div class="tooltip-description tooltip-background">${entityData.shortDescription || 'No description available.'}</div>
					`;
				break;
			case 'npc':
				content += `
					<div><strong>Class: </strong>${entityData.class || 'Unknown'}</div>
					<div><strong>Affinity: </strong>${entityData.affinity || 'Unknown'}</div>
					<div><strong>Role: </strong>${entityData.role || 'Unknown'}</div>
				`;
			default:
				content += `
		  <div class="tooltip-description tooltip-background">${
				entityData.desc || entityData.description || JSON.stringify(entityData)
			}</div>
		`;
		}

		content += `
		</div>
	  </div>
	`;

		return content;
	}
}
