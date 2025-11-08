# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A web-based D&D campaign manager featuring interactive Leaflet maps with custom annotations/markers, session recaps with rich markdown narrative, quest tracking, NPC/location databases, and character management. Built as a **fully static site** (no backend) with vanilla JavaScript - all data stored in JS files.

## Development Commands

### Running the Application
```powershell
# Open index.html in a browser
# Uses local file:// protocol or serve with any static server
python -m http.server 8000
# or
php -S localhost:8000
```

### File Structure (Simplified)
```
src/
├── core/                    # Application initialization and event handling
├── databases/
│   ├── core/                # Core managers (CampaignManager, StoryManager)
│   │   └── story-helpers/   # Story rendering utilities (modular subsystems)
│   └── data/
│       └── campaigns/       # Campaign-specific data folders
│           ├── campaign-001/
│           └── campaign-002/
│               ├── sessions/     # Markdown narrative files (000/, 001/, etc.)
│               ├── metadata.js   # Character stats/abilities/spells
│               ├── characters.js # Character profiles
│               ├── recaps.js     # Session list with file paths
│               ├── quests.js     # Quest database
│               ├── npcs.js       # NPC database
│               ├── locations.js  # Location database
│               ├── factions.js   # Faction database
│               └── encounters.js # Encounter database
└── services/
    ├── map/                 # Leaflet map initialization
    ├── markers/             # Map markers, annotations, paths
    └── utils/               # URL management, loading states
```

## Architecture

### Entry Point Flow
1. **index.html** loads all scripts in order (deferred)
2. **Initialization.js** waits for DOM, creates `CampaignManager`
3. **CampaignManager** handles routing via URL parameters:
   - `?state=campaigns` → Campaign selection screen
   - `?campaign=X&map=Y` → Map view
   - `?campaign=X&session=Y` → Story view (recaps)
   - `?campaign=X&character=Y` → Character-specific stories
   - `?campaign=X&view=timeline|quests|npcs|locations|factions|encounters` → Special views

### Core Systems

#### Campaign Management
- **CampaignManager** (`src/databases/core/CampaignManager.js`): Central orchestrator
  - Loads campaigns from `CAMPAIGN_DATA` array
  - Manages view switching (map ↔ story ↔ campaign selection)
  - Handles browser history (pushState/popState)
  - Stores last campaign in `localStorage`
  - Validates campaign data (checks for map/story content)

#### Map System
- **CustomMap** (`src/services/map/DungeonMapServices.js`): Leaflet-based interactive maps
  - Uses `L.CRS.Simple` coordinate system (not geographic)
  - Map data structured as nested objects with `image`, `bounds`, `markers`
  - Supports multiple layers via `NestedLayerControl`
  - Map export functionality with zoom level selection
  - **PathManager** for animated player travel routes
  - **AnnotationService** for custom markers with tooltips
  - **SidebarService** for layer/marker filtering

#### Story System
- **StoryManager** (`src/databases/core/StoryManager.js`): Narrative content renderer
  - Loads markdown files from `sessions/` directories
  - Processes custom placeholders via `StoryHelperPlaceholder`
  - Generates table of contents automatically
  - **StoryHelperTooltip**: Hover tooltips for NPCs/locations/quests/spells
  - **StoryHelperContent**: Renders session narratives
  - **StoryHelperSidebar**: Navigation (sessions, characters, special views)
  - **StoryHelperSearch**: Full-text search across all sessions
  - **Character filtering**: Show only mentions of specific characters

#### URL Management
- **StoryURLManager** (`src/databases/core/story-helpers/StoryUrlManager.js`):
  - Centralized URL parameter handling
  - Deep-linking support (can share specific map locations, sessions, character views)
  - Parameters: `campaign`, `map`, `session`, `character`, `view`, `target`, `location`, `quest`, `npc`, `faction`, `encounter`

### Data Structure Patterns

#### Campaign Object (in CampaignData.js)
```javascript
{
  id: 'campaign-001',
  metadata: { name, description, levelRange, characters },
  styling: { icon, backgroundColor },
  defaultMap: 'korinis_island', // Optional
  data: CAMPAIGN_01_MAP_DATA,   // Map data (optional)
  recaps: CAMPAIGN_001_RECAPS,  // Story sessions (optional)
  timeline: [...],              // Timeline events (optional)
  quests: [...],                // Quest database (optional)
  npcs: [...],                  // NPC database (optional)
  locations: [...],             // Location database (optional)
  factions: [...],              // Faction database (optional)
  encounters: [...]             // Encounter database (optional)
}
```

#### Session Recap Object (in recaps.js)
```javascript
{
  id: 'session-001',
  title: '01 - Session Title',
  date: 'Apr 12th',
  narrative: 'sessions/001/001_narrative.md',  // Path to markdown
  summary: 'sessions/001/001_summary.md',      // Optional summary
  progression: {                               // Optional loot
    loot: [{ itemName, count, rarity, description, owner }]
  }
}
```

#### Markdown Placeholders
- `{character:CharacterName}` → Interactive character link
- `{npc:npc-id}` → NPC tooltip
- `{location:location-id}` → Location tooltip
- `{quest:quest-id}` → Quest tooltip
- `{spell:spell-name}` → Spell tooltip (uses D&D 5e API)
- `{faction:faction-id}` → Faction tooltip
- `{encounter:encounter-id}` → Encounter tooltip

## Adding New Content

### New Campaign
1. Create `src/databases/data/campaigns/campaign-00X/` directory
2. Add campaign files: `metadata.js`, `characters.js`, `recaps.js`, etc.
3. Create `sessions/` subdirectory with markdown files
4. Import all files in `index.html` (maintain order)
5. Add campaign object to `CampaignData.js` array

### New Session Recap
1. Create `src/databases/data/campaigns/campaign-00X/sessions/00Y/` directory
2. Add `00Y_narrative.md` (required) and `00Y_summary.md` (optional)
3. Add session object to campaign's `recaps.js` array
4. Use placeholders in markdown for interactive elements

### New Map
1. Add map image to `maps/` directory
2. Define map object in campaign's `map.js`:
   ```javascript
   {
     image: 'maps/map-name.png',
     metadata: { sizes: { imageWidth, imageHeight, maxZoom } },
     bounds: [[y1, x1], [y2, x2]],
     markers: { /* marker definitions */ }
   }
   ```
3. Update campaign's `defaultMap` or use nested structure

## Key Constraints

- **No build system**: Pure vanilla JavaScript, no transpilation
- **Script loading order matters**: Dependencies loaded via `<script defer>` in specific order in `index.html`
- **Path conventions**: Relative paths in JS, absolute when needed for src attributes
- **Browser compatibility**: Modern browsers (ES6+), uses Leaflet 1.7.1
- **State management**: URL params + localStorage only, no state library
- **Markdown processing**: Custom placeholder system, not full CommonMark parser

## Testing

No automated tests present. Manual testing workflow:
1. Open `index.html` in browser
2. Test campaign selection navigation
3. Verify map loading and marker interactions
4. Check story view rendering and search
5. Test URL deep-linking by copying/pasting URLs
6. Verify browser back/forward navigation

## Common Patterns

### Adding Tooltips
1. Add entity to appropriate database file (npcs.js, locations.js, etc.)
2. Use placeholder in markdown: `{npc:entity-id}`
3. Tooltip automatically rendered via StoryHelperTooltip

### Extending URL Parameters
1. Add parameter to `StoryURLManager.PARAMS` object
2. Update `buildURL()` and `getParams()` methods
3. Handle parameter in CampaignManager routing logic

### Creating New Story Helper
1. Create class in `src/databases/core/story-helpers/`
2. Follow pattern: constructor accepts callbacks, returns DOM elements
3. Import in `index.html` before `StoryManager.js`
4. Initialize in `StoryManager.#initializeHelpers()`
