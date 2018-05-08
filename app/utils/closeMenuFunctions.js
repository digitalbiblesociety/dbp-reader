class CloseMenuFunctions {
	// Need to implement a parallel for IE because getBoundingClientRect does not work the same as with the other browsers
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
			let insideWidth;
			let outsideWidth;

			if (bounds.x && bounds.y) {
				insideWidth = singleTouch.clientX >= bounds.x && singleTouch.clientX <= bounds.x + bounds.width;
				outsideWidth = singleTouch.clientY >= bounds.y && singleTouch.clientY <= bounds.y + bounds.height;
			} else {
				insideWidth = singleTouch.clientX >= bounds.left && singleTouch.clientX <= bounds.left + bounds.width;
				outsideWidth = singleTouch.clientY >= bounds.top && singleTouch.clientY <= bounds.top + bounds.height;
			}
			// console.log('touch location', insideWidth, outsideWidth, bounds);
			if (this.ref && !(insideWidth || outsideWidth) && !this.ref.contains(event.target)) {
				this.closeFunction();
				document.removeEventListener('touchend', this.handleTouchend);
			}
		}
	};
	// var counter = 0;var n = document.getElementsByTagName('aside')[0];while(n.textContent !== 'HAYA') {if (counter === 30) {break;} else if (n.childNodes) {n.childNodes.forEach(function(c) {n = c})} counter += 1}
	handleKeydown = (event) => {
		if (event.which === 27) {
			this.closeFunction();
			document.removeEventListener('keydown', this.handleKeydown);
		}
	};

	handleClickOutside = (event) => {
		// In IE this event happens after the language list has already been closed...
		const bounds = this.ref.getBoundingClientRect();
		let insideWidth;
		let insideHeight;

		if (bounds.x && bounds.y) {
			insideWidth = event.clientX >= bounds.x && event.clientX <= bounds.x + bounds.width;
			insideHeight = event.clientY >= bounds.y && event.clientY <= bounds.y + bounds.height;
		} else {
			insideWidth = event.clientX >= bounds.left && event.clientX <= bounds.left + bounds.width;
			insideHeight = event.clientY >= bounds.top && event.clientY <= bounds.top + bounds.height;
		}
		// console.log(event);
		// console.log('event width', event.x, 'vs', event.clientX);
		// console.log('event height', event.y, 'vs', event.clientY);
		// console.log('bounds width', bounds.left);
		// console.log('bounds height', bounds.top);
		// console.log('click location is inside width and height', insideWidth, insideHeight);
		// console.log('!(insideWidth && insideHeight)', !(insideWidth && insideHeight));
		//
		// console.log('this.ref', this.ref);
		// console.log('event.target', event.target);
		// console.log('this.ref.contains(event.target)', this.ref.contains(event.target));
		// May need !this.ref.contains(event.target), testing the removal of it for IE...
		if (this.ref && !(insideWidth && insideHeight) && !this.ref.contains(event.target)) {
			// console.log('Closing menu bc of outside click');
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
