import React from 'react';
import Translate from '../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Select from '../shared/Select';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TabHeading } from './SettingStyles';
import countryData from 'country-data';
import Button from '@material-ui/core/Button';
import settingActions from '../../redux/actions/settings';
import uiActions from '../../redux/actions/ui';
import MenuItem from '@material-ui/core/MenuItem';
import { sortCountryLexographical } from '../../utils/helperFunctions';
import { isPhoneNumber } from '../../utils';
import { setUserSettings } from '../../apis';
import styled from 'styled-components';

const Details = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const CountryCode = styled.div`
  margin-top: 2rem;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const PhoneNumber = styled.div`
  margin-top: 1rem;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const PhoneDetails = styled.div`
  display: flex;
  align-items: center;
`;

const PhoneCode = styled.div`
  top: -2px;
  position: relative;
`;

const Number = styled.div`
  margin-left: 10px;
  width: 8rem;
`;

class MobileTab extends React.Component {
  constructor(props) {
    super(props);
    const { phoneNo, countryCode, countryDialCode } = this.props;
    this.state = {
      phoneNo,
      phoneNoError: '',
      countryCode,
      countryDialCode,
      loading: false,
    };
  }

  handleTelephoneNoChange = event => {
    const { value } = event.target;
    const re = /^\d*$/;
    if (value === '' || re.test(value)) {
      this.setState({ phoneNo: value });
    }
    if (!isPhoneNumber(value)) {
      this.setState({ phoneNoError: 'Invalid phone number' });
    } else {
      this.setState({ phoneNoError: '' });
    }
  };

  handleCountryChange = (event, index) => {
    const { value } = event.target;
    this.setState({
      countryCode: value,
      countryDialCode:
        countryData.countries[value ? value : 'US'].countryCallingCodes[0],
    });
  };

  handleSubmit = () => {
    const { actions } = this.props;
    const { phoneNo, countryCode, countryDialCode } = this.state;
    const payload = { phoneNo, countryCode, countryDialCode };
    this.setState({ loading: true });
    setUserSettings(payload)
      .then(data => {
        if (data.accepted) {
          actions.openSnackBar({
            snackBarMessage: 'Settings updated',
          });
          actions.setUserSettings(payload);
          this.setState({ loading: false });
        } else {
          actions.openSnackBar({
            snackBarMessage: 'Failed to save Settings',
          });
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: 'Failed to save Settings',
        });
      });
  };

  render() {
    const { phoneNo, phoneNoError, countryCode, loading } = this.state;
    const disabled =
      (countryCode === this.props.countryCode &&
        phoneNo === this.props.phoneNo) ||
      loading;
    sortCountryLexographical(countryData);
    let countries = countryData.countries.all.map((country, i) => {
      if (countryData.countries.all[i].countryCallingCodes[0]) {
        return (
          <MenuItem value={countryData.countries.all[i].alpha2} key={i}>
            {countryData.countries.all[i].name +
              ' ' +
              countryData.countries.all[i].countryCallingCodes[0]}
          </MenuItem>
        );
      }
      return null;
    });
    return (
      <SettingsTabWrapper heading="Mobile">
        <div style={{ fontSize: '14px' }}>
          <Translate text="Expand your experience, get closer, and stay current" />
        </div>
        <hr color="#f8f8f8" />
        <TabHeading>
          <Translate text="Add your phone number" />
        </TabHeading>
        <Details>
          <Translate text="In future, we will text a verification code to your number. Standard SMS fees may apply." />
        </Details>
        <CountryCode>
          <div style={{ marginRight: '2rem' }}>
            <Translate text="Country/region :" />
          </div>
          <div>
            <Select
              style={{ width: '12rem' }}
              value={countryCode ? countryCode : 'US'}
              onChange={this.handleCountryChange}
            >
              {countries}
            </Select>
          </div>
        </CountryCode>
        <PhoneNumber>
          <div style={{ marginRight: '2rem' }}>Phone number :</div>
          <PhoneDetails>
            <PhoneCode>
              <TextField
                style={{ width: '45px' }}
                name="selectedCountry"
                disabled={true}
                value={
                  countryData.countries[countryCode ? countryCode : 'US']
                    .countryCallingCodes[0]
                }
              />
            </PhoneCode>
            <Number>
              <FormControl error={phoneNoError !== ''}>
                <InputLabel>Phone Number</InputLabel>
                <Input
                  value={phoneNo}
                  onChange={this.handleTelephoneNoChange}
                  aria-describedby="phone-error-text"
                />
                <FormHelperText error={phoneNoError !== ''}>
                  {phoneNoError}
                </FormHelperText>
              </FormControl>
            </Number>
          </PhoneDetails>
        </PhoneNumber>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
          disabled={disabled}
          style={{ width: '10rem' }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Translate text="Save Changes" />
          )}
        </Button>
      </SettingsTabWrapper>
    );
  }
}

MobileTab.propTypes = {
  phoneNo: PropTypes.string,
  countryCode: PropTypes.string,
  countryDialCode: PropTypes.string,
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    theme: store.settings.theme,
    phoneNo: store.settings.phoneNo,
    countryCode: store.settings.countryCode,
    countryDialCode: store.settings.countryDialCode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...settingActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileTab);
