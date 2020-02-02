import React from 'react';
import EditDeviceDialog from '../../../../components/Admin/ListDevices/EditDeviceDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<EditDeviceDialog />', () => {
  it('render EditDeviceDialog without crashing', () => {
    shallow(
      <Provider store={store}>
        <EditDeviceDialog />
      </Provider>,
    );
  });
});
