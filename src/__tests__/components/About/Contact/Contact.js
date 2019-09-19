import React from 'react';
import Contact from '../../../../components/About/Contact/Contact.react';
import { shallow } from 'enzyme';

describe('<Contact />', () => {
  it('renders Contact without crashing', () => {
    shallow(<Contact location={{ pathname: '/contact' }} />);
  });
});
