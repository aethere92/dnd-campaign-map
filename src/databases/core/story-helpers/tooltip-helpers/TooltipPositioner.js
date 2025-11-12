// ============================================
// TooltipPositioner.js
// ============================================
class TooltipPositioner {
	position(tooltipContainer, targetElement) {
		Object.assign(tooltipContainer.style, {
			visibility: 'hidden',
			display: 'block',
			top: '-9999px',
			left: '-9999px',
		});

		const elementRect = targetElement.getBoundingClientRect();
		const tooltipRect = tooltipContainer.getBoundingClientRect();
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
			scrollX: window.scrollX,
			scrollY: window.scrollY,
		};

		const space = {
			above: elementRect.top,
			below: viewport.height - elementRect.bottom,
			left: elementRect.left,
			right: viewport.width - elementRect.right,
		};

		let position =
			space.below >= tooltipRect.height
				? 'below'
				: space.above >= tooltipRect.height
				? 'above'
				: space.right >= tooltipRect.width
				? 'right'
				: 'left';

		if (position === 'left' && space.left < tooltipRect.width) {
			position = 'below';
		}

		const buffer = 8;
		let coords = { top: 0, left: 0 };

		switch (position) {
			case 'below':
				coords.top = elementRect.bottom + viewport.scrollY + buffer;
				coords.left = elementRect.left + viewport.scrollX;
				break;
			case 'above':
				coords.top = elementRect.top + viewport.scrollY - tooltipRect.height - buffer;
				coords.left = elementRect.left + viewport.scrollX;
				break;
			case 'right':
				coords.top = elementRect.top + viewport.scrollY;
				coords.left = elementRect.right + viewport.scrollX + buffer;
				break;
			case 'left':
				coords.top = elementRect.top + viewport.scrollY;
				coords.left = elementRect.left + viewport.scrollX - tooltipRect.width - buffer;
				break;
		}

		coords.left = Math.max(10, Math.min(coords.left, viewport.scrollX + viewport.width - tooltipRect.width - 10));
		coords.top = Math.max(10, Math.min(coords.top, viewport.scrollY + viewport.height - tooltipRect.height - 10));

		Object.assign(tooltipContainer.style, {
			top: `${coords.top}px`,
			left: `${coords.left}px`,
			visibility: 'visible',
		});
	}
}
