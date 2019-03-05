import CloseMenuFunctions from '../closeMenuFunctions';

let componentRef = {
	getBoundingClientRect: jest.fn(() => ({
		x: 15,
		y: 15,
		width: 100,
		height: 100,
	})),
	// Always false because for testing purposes
	contains: jest.fn(() => false),
};
let closeFunction = jest.fn((options) => ({
	closing: true,
	...options,
}));
let onCloseOptions = { name: 'custom option' };

describe('CloseMenuFunctions utility', () => {
	beforeEach(() => {
		componentRef = {
			getBoundingClientRect: jest.fn(() => ({
				x: 15,
				y: 15,
				width: 100,
				height: 100,
			})),
			// Always false because for testing purposes
			contains: jest.fn(() => false),
		};
		closeFunction = jest.fn((options) => ({
			closing: true,
			...options,
		}));
		onCloseOptions = { name: 'custom option' };
	});
	it('should properly construct a the class of utility methods', () => {
		const utils = new CloseMenuFunctions(
			componentRef,
			closeFunction,
			onCloseOptions,
		);
		expect(utils).toHaveProperty('handleTouchend');
		expect(utils).toHaveProperty('handleKeydown');
		expect(utils).toHaveProperty('onMenuMount');
		expect(utils).toHaveProperty('onMenuUnmount');
		expect(utils).toHaveProperty('handleClickOutside');
		expect(utils).toHaveProperty('ref', componentRef);
		expect(utils).toHaveProperty('closeFunction', closeFunction);
		expect(utils).toHaveProperty('onCloseOptions', onCloseOptions);
	});
	it('should call the close function if touch event is out of bounds', () => {
		const utils = new CloseMenuFunctions(
			componentRef,
			closeFunction,
			onCloseOptions,
		);
		const touchSpy = jest.spyOn(utils, 'handleTouchend');

		utils.handleTouchend({ changedTouches: [{ clientX: 116, clientY: 116 }] });
		expect(touchSpy).toHaveBeenCalled();
		expect(utils.ref.contains).toHaveBeenCalled();
		expect(utils.ref.getBoundingClientRect).toHaveBeenCalled();
		expect(utils.closeFunction).toHaveBeenCalled();
	});
	it('should call the close function if touch event with left/top is out of bounds', () => {
		const utils = new CloseMenuFunctions(
			{
				getBoundingClientRect: jest.fn(() => ({
					left: 15,
					top: 15,
					width: 100,
					height: 100,
				})),
				contains: jest.fn(() => false),
			},
			closeFunction,
			onCloseOptions,
		);
		utils.handleTouchend({ changedTouches: [{ clientX: 116, clientY: 116 }] });
		expect(utils.closeFunction).toHaveBeenCalled();
	});
	it('should call the close function if click event is out of bounds', () => {
		const utils = new CloseMenuFunctions(
			componentRef,
			closeFunction,
			onCloseOptions,
		);
		utils.handleClickOutside({
			changedTouches: [{ clientX: 116, clientY: 116 }],
		});
		expect(utils.closeFunction).toHaveBeenCalled();
	});
	it('should call the close function if click event with left/top is out of bounds', () => {
		const utils = new CloseMenuFunctions(
			{
				getBoundingClientRect: jest.fn(() => ({
					left: 15,
					top: 15,
					width: 100,
					height: 100,
				})),
				contains: jest.fn(() => false),
			},
			closeFunction,
			onCloseOptions,
		);
		utils.handleClickOutside({
			changedTouches: [{ clientX: 116, clientY: 116 }],
		});
		expect(utils.closeFunction).toHaveBeenCalled();
	});
});
