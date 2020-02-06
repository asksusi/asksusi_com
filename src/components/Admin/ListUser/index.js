import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { deleteUserAccount, fetchAdminUserStats } from '../../../apis/index';
import styled from 'styled-components';
import { Container } from '../AdminStyles';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';
import DevicePanel from './DevicePanel/index';
import uiActions from '../../../redux/actions/ui';
import _SearchBar from 'material-ui-search-bar';
import COLUMNS from './constants';
import TablePagination from '@material-ui/core/TablePagination';
import CloseIcon from '@material-ui/icons/Close';
import { ActionSpan, ActionSeparator } from '../../shared/TableActionStyles';

const SearchBar = styled(_SearchBar)`
  width: 50%;
  margin: 0 auto 1rem auto;
`;

class ListUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: [],
      userEmail: '',
      data: [],
      pagination: {},
      loading: true,
      search: '',
      page: 1,
    };
  }

  deleteUser = () => {
    const { userEmail: email } = this.state;
    deleteUserAccount({ email })
      .then(payload => {
        this.props.actions.openModal({
          modalType: 'confirm',
          content: (
            <div>
              Account associated with
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {email}
              </span>
              is deleted successfully!
            </div>
          ),
          title: 'Success',
          handleConfirm: this.props.actions.closeModal,
        });
        this.setState({ search: '' });
        this.loadUsers();
      })
      .catch(error => {
        console.log(error);
        this.props.actions.openModal({
          modalType: 'confirm',
          content: (
            <div>
              Account associated with
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {email}
              </span>
              cannot be deleted!
            </div>
          ),
          title: 'Failure',
          handleConfirm: this.props.actions.closeModal,
        });
      });
  };

  handleSearch = value => {
    const { search } = this.state;
    value = value.trim();
    if (value === '' && search !== value) {
      this.loadUsers();
    }
    this.setState({ search: value });
    fetchAdminUserStats({ search: value })
      .then(payload => {
        let userList = payload.users;
        let users = [];
        if (userList && Array.isArray(userList) && userList.length > 0) {
          userList.map((data, dataIndex) => {
            let devices = [];
            let keys = Object.keys(data.devices);
            keys.forEach(deviceIndex => {
              let device = {
                macid: deviceIndex,
                devicename: data.devices[deviceIndex].name,
                room: data.devices[deviceIndex].room,
                latitude: data.devices[deviceIndex].geolocation.latitude,
                longitude: data.devices[deviceIndex].geolocation.longitude,
              };
              devices.push(device);
            });
            let user = {
              serialNum: ++dataIndex,
              email: data.name,
              signup: data.signupTime === '' ? '-' : data.signupTime,
              lastLogin: data.lastLoginTime === '' ? '-' : data.lastLoginTime,
              ipLastLogin: data.lastLoginIP === '' ? '-' : data.lastLoginIP,
              userName:
                data.userName === '' ? '-' : data.userName.substring(0, 30),
              userRole: data.userRole,
              devices: devices,
            };
            if (data.confirmed) {
              user.confirmed = 'Activated';
            } else {
              user.confirmed = 'Not Activated';
            }
            users.push(user);
            return 1;
          });
        }
        this.setState({
          data: users,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    document.title = 'SUSI.AI - User Detail List';
    this.loadUsers();
  }

  loadUsers = () => {
    Promise.all([
      this.fetch({ page: 0 }),
      fetchAdminUserStats({ getUserStats: 'true' })
        .then(payload => {
          const {
            userStats: { totalUsers },
          } = payload;
          this.setState({
            totalUsers,
          });
        })
        .catch(error => {
          console.log(error);
        }),
    ]);
  };

  handleSuccess = () => {
    this.setState({
      changeRoleDialog: false,
    });
    document.location.reload();
  };

  fetch = ({ page }) => {
    this.setState({ loading: true });
    fetchAdminUserStats({ page: page + 1 })
      .then(payload => {
        let userList = payload.users;
        let users = [];
        if (userList && Array.isArray(userList) && userList.length > 0) {
          userList.map((data, dataIndex) => {
            let devices = [];
            let keys = Object.keys(data.devices);
            keys.forEach(deviceIndex => {
              let device = {
                macid: deviceIndex,
                devicename: data.devices[deviceIndex].name,
                room: data.devices[deviceIndex].room,
                latitude: data.devices[deviceIndex].geolocation.latitude,
                longitude: data.devices[deviceIndex].geolocation.longitude,
              };
              devices.push(device);
            });
            let user = {
              serialNum: ++dataIndex + page * 50,
              email: data.name,
              confirmed: data.confirmed,
              signup:
                data.signupTime === ''
                  ? '-'
                  : new Date(data.signupTime).toDateString(),
              lastLogin:
                data.lastLoginTime === ''
                  ? '-'
                  : new Date(data.lastLoginTime).toDateString(),
              ipLastLogin: data.lastLoginIP === '' ? '-' : data.lastLoginIP,
              userRole: data.userRole,
              userName:
                data.userName === '' ? '-' : data.userName.substring(0, 30),
              devices: devices,
            };
            if (user.confirmed) {
              user.confirmed = 'Activated';
            } else {
              user.confirmed = 'Not Activated';
            }

            users.push(user);
            return 1;
          });
        }
        this.setState({
          data: users,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleEdit = (userEmail, userRole) => {
    this.setState({ userEmail, userRole });
    this.props.actions.openModal({
      modalType: 'editUserRole',
      userEmail,
      userRole,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleDelete = userEmail => {
    this.setState({ userEmail });
    this.props.actions.openModal({
      modalType: 'deleteUserAccount',
      userEmail,
      handleClose: this.props.actions.closeModal,
      handleConfirm: this.deleteUser,
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
    this.fetch({ page });
  };

  onClose = () => {
    this.loadUsers();
  };

  render() {
    const { loading, search, totalUsers, page, data } = this.state;
    return (
      <Container style={{ padding: '1rem 0' }}>
        <SearchBar
          placeholder="Search by email"
          value={search}
          onChange={value => this.handleSearch(value)}
          closeIcon={<CloseIcon />}
          onCancelSearch={this.onClose}
        />
        <MaterialTable
          isLoading={loading}
          options={{
            actionsColumnIndex: -1,
            pageSize: 50,
            search: false,
            pageSizeOptions: [50],
          }}
          columns={COLUMNS}
          data={data}
          title=""
          actions={[
            rowData => ({
              onEdit: (event, rowData) => {
                this.handleEdit(rowData.email, rowData.userRole);
              },
              onDelete: (event, rowData) => {
                this.handleDelete(rowData.email);
              },
            }),
          ]}
          components={{
            Action: props => (
              <React.Fragment>
                <Link to={`/settings?email=${props.data.email}`}>
                  <ActionSpan>Edit</ActionSpan>
                </Link>
                <ActionSeparator> | </ActionSeparator>
                <ActionSpan
                  onClick={event => props.action.onEdit(event, props.data)}
                >
                  Role
                </ActionSpan>
                <ActionSeparator> | </ActionSeparator>
                <ActionSpan
                  onClick={event => props.action.onDelete(event, props.data)}
                >
                  Delete
                </ActionSpan>
              </React.Fragment>
            ),
            Pagination: e => (
              <TablePagination
                rowsPerPageOptions={[50]}
                colSpan={3}
                count={totalUsers || 0}
                rowsPerPage={50}
                page={page}
                onChangePage={this.handleChangePage}
                style={{ float: 'right' }}
                SelectProps={{
                  native: true,
                }}
              />
            ),
          }}
          detailPanel={rowData => {
            return <DevicePanel data={rowData.devices} email={rowData.email} />;
          }}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
          onChangePage={page => {
            this.fetch({ page: page + 1 });
          }}
        />
      </Container>
    );
  }
}

ListUser.propTypes = {
  history: PropTypes.object,
  actions: PropTypes.object,
};

function mapDispatchToProps(store) {
  return {
    actions: bindActionCreators(uiActions, store),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ListUser);
