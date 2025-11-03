class StoryHelperSearch {
	#campaign;
	#onNavigate;
	#searchIndex = null;
	#isOpen = false;
	#searchModal = null;
	#searchInput = null;
	#resultsContainer = null;
	#selectedIndex = 0;

	constructor(getCampaignFn, onNavigateFn) {
		this.#campaign = getCampaignFn;
		this.#onNavigate = onNavigateFn;
		this.#initializeKeyboardShortcuts();
	}

	#initializeKeyboardShortcuts() {
		document.addEventListener('keydown', (e) => {
			// Ctrl+K or Cmd+K to open search
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				this.toggleSearch();
			}
			// Escape to close search
			if (e.key === 'Escape' && this.#isOpen) {
				this.closeSearch();
			}
		});
	}

	toggleSearch() {
		if (this.#isOpen) {
			this.closeSearch();
		} else {
			this.openSearch();
		}
	}

	openSearch() {
		if (this.#isOpen) return;
		this.#isOpen = true;
		this.#buildSearchIndex();
		this.#createSearchModal();
	}

	closeSearch() {
		if (!this.#isOpen) return;
		this.#isOpen = false;
		this.#searchModal?.remove();
		this.#searchModal = null;
		this.#searchInput = null;
		this.#resultsContainer = null;
		this.#selectedIndex = 0;
	}

	#buildSearchIndex() {
		if (this.#searchIndex) return; // Only build once per campaign load

		const campaign = this.#campaign();
		if (!campaign) return;

		this.#searchIndex = [];

		// Index sessions
		campaign.recaps?.forEach((session) => {
			// Session title and summary
			this.#searchIndex.push({
				type: 'session',
				id: session.id,
				title: session.title || `Session ${session.sessionNumber}`,
				content: session.summary || '',
				sessionNumber: session.sessionNumber,
				context: 'Session Summary',
				navigation: { view: 'session', sessionId: session.id },
			});

			// Session content sections
			session.content?.forEach((section, idx) => {
				if (section.text) {
					this.#searchIndex.push({
						type: 'session',
						id: session.id,
						title: session.title || `Session ${session.sessionNumber}`,
						content: section.text,
						sessionNumber: session.sessionNumber,
						context: section.heading || `Section ${idx + 1}`,
						navigation: { view: 'session', sessionId: session.id },
					});
				}
			});
		});

		// Index characters
		campaign.metadata?.characters?.forEach((char) => {
			this.#searchIndex.push({
				type: 'character',
				id: char.name,
				title: char.name,
				content: [char.race, char.class, char.background, char.bio, char.personality, char.goals]
					.filter(Boolean)
					.join(' '),
				context: 'Player Character',
				navigation: { view: 'character', characterName: char.name },
			});
		});

		// Index NPCs
		campaign.npcs?.forEach((npc) => {
			this.#searchIndex.push({
				type: 'npc',
				id: npc.name,
				title: npc.name,
				content: [npc.description, npc.role, npc.location, npc.notes].filter(Boolean).join(' '),
				context: 'NPC',
				navigation: { view: 'npcs', itemId: npc.id },
			});
		});

		// Index locations
		campaign.locations?.forEach((loc) => {
			this.#searchIndex.push({
				type: 'location',
				id: loc.name,
				title: loc.name,
				content: [loc.description, loc.significance, loc.notes].filter(Boolean).join(' '),
				context: 'Location',
				navigation: { view: 'locations', itemId: loc.id },
			});
		});

		// Index quests
		campaign.quests?.forEach((quest) => {
			this.#searchIndex.push({
				type: 'quest',
				id: quest.title,
				title: quest.title,
				content: [quest.description, quest.objective, quest.reward, quest.notes].filter(Boolean).join(' '),
				context: `Quest - ${quest.status || 'Unknown'}`,
				navigation: { view: 'quests', itemId: quest.title },
			});
		});

		// Index factions
		campaign.factions?.forEach((faction) => {
			this.#searchIndex.push({
				type: 'faction',
				id: faction.name,
				title: faction.name,
				content: [faction.description, faction.goals, faction.leader, faction.notes].filter(Boolean).join(' '),
				context: 'Faction',
				navigation: { view: 'factions', itemId: faction.id },
			});
		});
	}

	#search(query) {
		if (!query || query.length < 2) return [];

		const normalizedQuery = query.toLowerCase().trim();
		const results = [];

		this.#searchIndex.forEach((item) => {
			const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
			const contentMatch = item.content.toLowerCase().includes(normalizedQuery);

			if (titleMatch || contentMatch) {
				const score = titleMatch ? 10 : 1;
				const excerpt = this.#getExcerpt(item.content, normalizedQuery);

				results.push({
					...item,
					score,
					excerpt,
					titleMatch,
				});
			}
		});

		// Sort by score (title matches first) and then by type
		return results.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return a.type.localeCompare(b.type);
		});
	}

	#getExcerpt(content, query, maxLength = 150) {
		const lowerContent = content.toLowerCase();
		const queryIndex = lowerContent.indexOf(query.toLowerCase());

		if (queryIndex === -1) {
			return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
		}

		const start = Math.max(0, queryIndex - 50);
		const end = Math.min(content.length, queryIndex + query.length + 50);

		let excerpt = content.substring(start, end);
		if (start > 0) excerpt = '...' + excerpt;
		if (end < content.length) excerpt = excerpt + '...';

		return excerpt;
	}

	#highlightText(text, query) {
		if (!query) return text;

		const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
		return text.replace(regex, '<mark>$1</mark>');
	}

	#createSearchModal() {
		// Create modal overlay
		const overlay = document.createElement('div');
		overlay.className = 'search-modal-overlay';
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) this.closeSearch();
		});

		// Create modal container
		const modal = document.createElement('div');
		modal.className = 'search-modal';

		// Create search input
		const inputContainer = document.createElement('div');
		inputContainer.className = 'search-input-container';

		const searchIcon = document.createElement('span');
		searchIcon.className = 'search-icon';
		searchIcon.innerHTML = '🔍';

		this.#searchInput = document.createElement('input');
		this.#searchInput.type = 'text';
		this.#searchInput.className = 'search-input';
		this.#searchInput.placeholder = 'Search sessions, characters, NPCs, locations...';
		this.#searchInput.autocomplete = 'off';

		const shortcutHint = document.createElement('span');
		shortcutHint.className = 'search-shortcut-hint';
		shortcutHint.textContent = 'ESC to close';

		inputContainer.append(searchIcon, this.#searchInput, shortcutHint);

		// Create results container
		this.#resultsContainer = document.createElement('div');
		this.#resultsContainer.className = 'search-results';

		// Add empty state
		const emptyState = document.createElement('div');
		emptyState.className = 'search-empty-state';
		emptyState.textContent = 'Start typing to search...';
		this.#resultsContainer.appendChild(emptyState);

		modal.append(inputContainer, this.#resultsContainer);
		overlay.appendChild(modal);
		document.body.appendChild(overlay);

		this.#searchModal = overlay;

		// Set up event listeners
		this.#searchInput.addEventListener('input', (e) => {
			this.#handleSearchInput(e.target.value);
		});

		this.#searchInput.addEventListener('keydown', (e) => {
			this.#handleKeyNavigation(e);
		});

		// Focus the input
		setTimeout(() => this.#searchInput.focus(), 50);
	}

	#handleSearchInput(query) {
		const results = this.#search(query);
		this.#selectedIndex = 0;
		this.#renderResults(results, query);
	}

	#renderResults(results, query) {
		this.#resultsContainer.innerHTML = '';

		if (results.length === 0) {
			const emptyState = document.createElement('div');
			emptyState.className = 'search-empty-state';
			emptyState.textContent = query.length < 2 ? 'Start typing to search...' : 'No results found';
			this.#resultsContainer.appendChild(emptyState);
			return;
		}

		// Group results by type
		const grouped = {};
		results.forEach((result) => {
			if (!grouped[result.type]) grouped[result.type] = [];
			grouped[result.type].push(result);
		});

		const typeLabels = {
			session: 'Sessions',
			character: 'Characters',
			npc: 'NPCs',
			location: 'Locations',
			quest: 'Quests',
			faction: 'Factions',
		};

		const typeOrder = ['session', 'character', 'quest', 'location', 'npc', 'faction'];

		typeOrder.forEach((type) => {
			if (!grouped[type]) return;

			const group = document.createElement('div');
			group.className = 'search-result-group';

			const groupLabel = document.createElement('div');
			groupLabel.className = 'search-group-label';
			groupLabel.textContent = typeLabels[type];
			group.appendChild(groupLabel);

			grouped[type].forEach((result, idx) => {
				const resultElement = this.#createResultElement(result, query);
				group.appendChild(resultElement);
			});

			this.#resultsContainer.appendChild(group);
		});

		// Highlight first result
		this.#updateSelectedResult();
	}

	#createResultElement(result, query) {
		const element = document.createElement('div');
		element.className = 'search-result-item';
		element.dataset.navigation = JSON.stringify(result.navigation);

		const title = document.createElement('div');
		title.className = 'search-result-title';
		title.innerHTML = this.#highlightText(result.title, query);

		const context = document.createElement('div');
		context.className = 'search-result-context';
		context.textContent = result.context;

		const excerpt = document.createElement('div');
		excerpt.className = 'search-result-excerpt';
		excerpt.innerHTML = this.#highlightText(result.excerpt, query);

		element.append(title, context, excerpt);

		element.addEventListener('click', () => {
			this.#navigateToResult(result.navigation);
		});

		return element;
	}

	#handleKeyNavigation(e) {
		const results = this.#resultsContainer.querySelectorAll('.search-result-item');
		if (results.length === 0) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			this.#selectedIndex = Math.min(this.#selectedIndex + 1, results.length - 1);
			this.#updateSelectedResult();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			this.#selectedIndex = Math.max(this.#selectedIndex - 1, 0);
			this.#updateSelectedResult();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const selected = results[this.#selectedIndex];
			if (selected) {
				const navigation = JSON.parse(selected.dataset.navigation);
				this.#navigateToResult(navigation);
			}
		}
	}

	#updateSelectedResult() {
		const results = this.#resultsContainer.querySelectorAll('.search-result-item');
		results.forEach((result, idx) => {
			if (idx === this.#selectedIndex) {
				result.classList.add('selected');
				result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			} else {
				result.classList.remove('selected');
			}
		});
	}

	#navigateToResult(navigation) {
		this.closeSearch();
		this.#onNavigate(navigation);
	}

	// Call this when campaign changes
	invalidateIndex() {
		this.#searchIndex = null;
	}
}
