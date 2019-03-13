import React from 'react'
import renderer from 'react-test-renderer'
import PasswordReset from '..'

const props = {
	popupOpen: false,
	message: 'Success!',
	openPopup: jest.fn(),
	resetPassword: jest.fn(),
	popupCoords: {
		x: 150,
		y: 150,
	}
}

describe('<PasswordReset /> Component', () => {
	it('Should match the previous snapshot', () => {
		const tree = renderer.create(<PasswordReset {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	})
})