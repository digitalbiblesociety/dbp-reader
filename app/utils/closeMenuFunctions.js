class CloseMenuFunctions {
	constructor(componentRef, closeFunction) {
		this.ref = componentRef || { getBoundingClientRect() { return { x: 0, y: 0, width: 0, height: 0 }; }, contains() { return true; } };
		this.closeFunction = closeFunction;
	}

	handleTouchend = (event) => {
		if (event.changedTouches.length === 1) {
			// console.log('target', event.target);
			// If a touch was outside the menu and there was only one touch close it
			const singleTouch = event.changedTouches[0];
			const bounds = this.ref.getBoundingClientRect();
			const insideWidth = singleTouch.clientX >= bounds.x && singleTouch.clientX <= bounds.x + bounds.width;
			const outsideWidth = singleTouch.clientY >= bounds.y && singleTouch.clientY <= bounds.y + bounds.height;
			// console.log('touch location', insideWidth, outsideWidth, bounds);
			if (this.ref && !(insideWidth || outsideWidth) && !this.ref.contains(event.target)) {
				this.closeFunction();
				document.removeEventListener('touchend', this.handleTouchend);
			}
		}
	};

	handleKeydown = (event) => {
		if (event.which === 27) {
			this.closeFunction();
			document.removeEventListener('keydown', this.handleKeydown);
		}
	};

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;
		// console.log('click location', insideWidth, insideHeight, bounds);

		if (this.ref && !(insideWidth && insideHeight) && !this.ref.contains(event.target)) {
			this.closeFunction();
			document.removeEventListener('click', this.handleClickOutside);
		}
	};

	onMenuMount = () => {
		document.addEventListener('click', this.handleClickOutside);
		document.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('touchend', this.handleTouchend);
	}

	onMenuUnmount = () => {
		document.removeEventListener('click', this.handleClickOutside);
		document.removeEventListener('keydown', this.handleKeydown);
		document.removeEventListener('touchend', this.handleTouchend);
	}
}

export default CloseMenuFunctions;
