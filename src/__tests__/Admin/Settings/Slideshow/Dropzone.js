import React from 'react';
import Dropzone from '../../../../components/Admin/Settings/Slideshow/Dropzone';
import { shallow } from 'enzyme';

describe('<Dropzone />', () => {
  it('render Dropzone without crashing', () => {
    shallow(<Dropzone />);
  });
});
