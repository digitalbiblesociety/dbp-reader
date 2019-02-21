import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Checkbox from '..';

const updater = jest.fn(() => {
  props.toggleState = !props.toggleState;
});
const props = {
  label: 'autoplay',
  toggleState: true,
  className: 'autoplay',
  id: 'autoplay-checkbox',
  updater,
};
let wrapper;

describe('Checkbox component', () => {
  beforeEach(() => {
    wrapper = mount(<Checkbox {...props} />);
    props.toggleState = true;
  });
  it('should match previous snapshot for active', () => {
    const tree = renderer.create(<Checkbox {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('should match previous snapshot for inactive', () => {
    const tree = renderer
      .create(<Checkbox {...props} toggleState={false} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('should match previous snapshot for default props', () => {
    const tree = renderer
      .create(<Checkbox {...props} id={''} className={''} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('should render in active state', () => {
    const input = wrapper.find('input');
    expect(input.props().value).toEqual(props.toggleState);
  });
  it('should render in inactive state when toggled', () => {
    const input = wrapper.find('input');

    input.simulate('change', { target: { value: false } });

    expect(updater).toHaveBeenCalledTimes(1);
    // Need to set the new props here
    wrapper.setProps({ toggleState: props.toggleState });
    // Need to refind the input since enzyme returns immutable objects
    expect(wrapper.find('input').props().value).toEqual(props.toggleState);
  });
});
