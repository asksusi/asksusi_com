import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MuiThemeProviderNext from '@material-ui/core/styles/MuiThemeProvider';
import { theme } from './MUItheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Snackbar from '@material-ui/core/Snackbar';
import Blog from './components/Blog/Blog.react';
import ChatApp from './components/ChatApp/ChatApp.react';
import Contact from './components/Contact/Contact.react';
import Devices from './components/Devices/Devices.react';
import Logout from './components/Auth/Logout.react';
import NotFound from './components/NotFound/NotFound.react';
import Overview from './components/Overview/Overview.react';
import Settings from './components/ChatApp/Settings/Settings.react';
import Support from './components/Support/Support.react';
import Team from './components/Team/Team.react';
import Terms from './components/Terms/Terms.react';
import Privacy from './components/Privacy/Privacy.react';
import appActions from './redux/actions/app';
import uiActions from './redux/actions/ui';
import ProtectedRoute from './components/ProtectedRoute';
import DialogSection from '../src/components/Dialog/DialogSection.react';
import settingActions from './redux/actions/settings';
import BrowseSkill from './components/cms/BrowseSkill/BrowseSkill';
import BrowseSkillByCategory from './components/cms/BrowseSkill/BrowseSkillByCategory';
import BrowseSkillByLanguage from './components/cms/BrowseSkill/BrowseSkillByLanguage';
import SkillListing from './components/cms/SkillPage/SkillListing';
import SkillFeedbackPage from './components/cms/SkillFeedbackPage/SkillFeedbackPage';
import Dashboard from './components/cms/Dashboard/Dashboard';
import SkillVersion from './components/cms/SkillVersion/SkillVersion';
import SkillHistory from './components/cms/SkillHistory/SkillHistory';
import SkillRollBack from './components/cms/SkillRollBack/SkillRollBack';
import SkillCreator from './components/cms/SkillCreator/SkillCreator';
import BotBuilderWrap from './components/cms/BotBuilder/BotBuilderWrap';
import Admin from './components/Admin/Admin';

const muiTheme = getMuiTheme({
  toggle: {
    thumbOnColor: '#5ab1fc',
    trackOnColor: '#4285f4',
  },
});

class App extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    actions: PropTypes.object,
    accessToken: PropTypes.string,
    snackBarProps: PropTypes.object,
  };

  componentDidMount = () => {
    const { accessToken, actions } = this.props;

    window.addEventListener('offline', this.onUserOffline);
    window.addEventListener('online', this.onUserOnline);

    actions.getApiKeys();
    if (accessToken) {
      actions.getAdmin();
      actions.getUserSettings();
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener('offline', this.onUserOffline);
    window.removeEventListener('online', this.onUserOnline);
  };

  onUserOffline = () => {
    const { actions } = this.props;
    actions.openSnackBar({
      snackBarMessage: 'It seems you are offline!',
    });
  };

  onUserOnline = () => {
    const { actions } = this.props;
    actions.openSnackBar({
      snackBarMessage: 'Welcome back!',
    });
  };

  render() {
    const {
      actions,
      snackBarProps: { snackBarMessage, isSnackBarOpen, snackBarDuration },
    } = this.props;
    return (
      <MuiThemeProviderNext theme={theme}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <DialogSection />
            <Snackbar
              autoHideDuration={snackBarDuration}
              open={isSnackBarOpen}
              message={snackBarMessage}
              onClose={actions.closeSnackBar}
            />
            <Switch>
              <Route exact path="/" component={ChatApp} />
              <Route exact path="/skills" component={BrowseSkill} />
              <Route
                exact
                path="/skills/category/:category"
                component={BrowseSkillByCategory}
              />
              <Route
                exact
                path="/skills/language/:language"
                component={BrowseSkillByLanguage}
              />
              <Route
                exact
                path="/skills/:category/:skills/:lang"
                component={SkillListing}
              />
              <Route
                exact
                path="/skills/:category/:skills/:lang/feedbacks"
                component={SkillFeedbackPage}
              />
              <Route exact path="/skills/dashboard/" component={Dashboard} />
              <Route
                exact
                path="/skills/:category/:skill/versions/:lang"
                component={SkillVersion}
              />
              <Route
                exact
                path="/skills/:category/:skill/compare/:lang/:oldid/:recentid"
                component={SkillHistory}
              />
              <Route
                exact
                path="/skills/:category/:skill/edit/:lang/:latestid/:revertid"
                component={SkillRollBack}
              />
              <Route
                exact
                path="/skills/:category/:skill/edit/:lang"
                component={SkillCreator}
              />
              <Route
                exact
                path="/skills/:category/:skill/edit/:lang/:commit"
                component={SkillCreator}
              />
              <Route
                exact
                path="/skills/skillCreator"
                component={SkillCreator}
              />
              <Route path="/skills/botbuilder" component={BotBuilderWrap} />
              <Route exact path="/overview" component={Overview} />
              <Route exact path="/devices" component={Devices} />
              <Route exact path="/team" component={Team} />
              <Route exact path="/blog" component={Blog} />
              <Route exact path="/contact" component={Contact} />
              <Route exact path="/support" component={Support} />
              <Route exact path="/terms" component={Terms} />
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/logout" component={Logout} />
              <Route path="/admin" component={Admin} />
              <ProtectedRoute exact path="/settings" component={Settings} />
              <Route exact path="/*:path(error-404|)" component={NotFound} />
            </Switch>
          </div>
        </MuiThemeProvider>
      </MuiThemeProviderNext>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...appActions, ...uiActions, ...settingActions },
      dispatch,
    ),
  };
}

function mapStateToProps(store) {
  return {
    ...store.ui,
    ...store.app,
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);
