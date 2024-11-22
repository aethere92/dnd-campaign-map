// Breadcrumb navigation
function updateBreadcrumb() {
	const breadcrumb = document.getElementById('breadcrumb');
	breadcrumb.innerHTML = '';

	// Add root
	const rootLink = document.createElement('a');
	rootLink.textContent = 'MAP_DATABASE';
	rootLink.href = '#';
	rootLink.onclick = () => navigateToPath([]);

	const rootItem = document.createElement('div');
	rootItem.className = 'breadcrumb-item';
	rootItem.appendChild(rootLink);
	breadcrumb.appendChild(rootItem);

	// Add path segments
	currentPath.forEach((segment, index) => {
		const separator = document.createElement('span');
		separator.className = 'breadcrumb-separator';
		separator.textContent = '>';
		breadcrumb.appendChild(separator);

		const link = document.createElement('a');
		link.textContent = segment;
		link.href = '#';
		link.onclick = () => navigateToPath(currentPath.slice(0, index + 1));

		const item = document.createElement('div');
		item.className = 'breadcrumb-item';
		item.appendChild(link);
		breadcrumb.appendChild(item);
	});
}

function updateNavigationTree() {
	const container = document.getElementById('navigation-tree');
	container.innerHTML = '';
	container.appendChild(createNavigationTree(MAP_DATABASE, []));
}

function createNavigationTree(obj, path) {
	const ul = document.createElement('ul');
	ul.className = 'nav-tree';

	if (obj) {
		Object.entries(obj).forEach(([key, value]) => {
			const li = document.createElement('li');
			li.className = 'nav-item';

			const currentPath = [...path, key];
			const pathString = currentPath.join('.');

			const link = document.createElement('a');
			link.className = 'nav-link';
			link.setAttribute('data-path', pathString);

			if (typeof value === 'object' && value !== null) {
				const icon = document.createElement('span');
				icon.className = 'nav-icon';
				icon.textContent = '▶';
				link.appendChild(icon);

				const keySpan = document.createElement('span');
				keySpan.textContent = key;
				link.appendChild(keySpan);

				link.onclick = (e) => {
					e.preventDefault();
					e.stopPropagation();

					// Toggle icon and subtree
					icon.classList.toggle('expanded');
					icon.textContent = icon.classList.contains('expanded') ? '▼' : '▶';
					const subTree = li.querySelector('.nav-tree');
					if (subTree) {
						subTree.style.display = subTree.style.display === 'none' ? 'block' : 'none';
					}

					// Navigate to the item
					navigateToPath(currentPath);
				};

				li.appendChild(link);
				li.appendChild(createNavigationTree(value, currentPath));
			} else {
				link.textContent = `${key}: ${typeof value}`;
				link.onclick = (e) => {
					e.preventDefault();
					e.stopPropagation();
					navigateToPath(currentPath);
				};
				li.appendChild(link);
			}

			ul.appendChild(li);
		});
	}

	return ul;
}

// Replace the navigateToPath function with this corrected version
function navigateToPath(path) {
	currentPath = path;
	updateBreadcrumb();

	// Remove any existing active classes
	document.querySelectorAll('.nav-link.active').forEach((el) => {
		el.classList.remove('active');
	});

	// Add active class to current item
	const navLink = document.querySelector(`.nav-link[data-path="${path.join('.')}"]`);
	if (navLink) {
		navLink.classList.add('active');

		// Expand parent trees if they're collapsed
		let parent = navLink.parentElement;
		while (parent) {
			const parentTree = parent.closest('.nav-tree');
			if (parentTree) {
				parentTree.style.display = 'block';
				const parentLink = parentTree.previousElementSibling;
				if (parentLink && parentLink.classList.contains('nav-link')) {
					const icon = parentLink.querySelector('.nav-icon');
					if (icon) {
						icon.classList.add('expanded');
						icon.textContent = '▼';
					}
				}
			}
			parent = parentTree ? parentTree.parentElement : null;
		}
	}

	// Find and scroll to the editor element
	const pathString = path.join('.');
	const editorElements = document.querySelectorAll('.object-editor, .value-editor');
	let targetElement = null;

	editorElements.forEach((element) => {
		if (element.getAttribute('data-path') === pathString) {
			targetElement = element;

			// Ensure all parent containers are expanded
			let parent = element.parentElement;
			while (parent) {
				if (parent.classList.contains('nested')) {
					parent.classList.remove('collapsed');
					const header = parent.previousElementSibling;
					if (header && header.classList.contains('header')) {
						const icon = header.querySelector('.nav-icon');
						if (icon) icon.textContent = '▼';
					}
				}
				parent = parent.parentElement;
			}
		}
	});

	if (targetElement) {
		// Add a small delay to ensure DOM updates have completed
		setTimeout(() => {
			targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			highlightElement(targetElement);
		}, 100);
	}
}
