import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularLoader from '../../../shared/CircularLoader';
import _Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import uiActions from '../../../../redux/actions/ui';
import { fetchApiKeys, deleteApiKey } from '../../../../apis/index';
import { ActionSpan, ActionSeparator } from '../../../shared/TableActionStyles';

const Table = styled(_Table)`
  max-width: 40rem;
  margin: 1rem 0;
  background-color: #fff;
  @media (max-width: 780px) {
    display: block;
  }
`;

const AddConfigButton = styled(Button)`
  margin-top: 1rem;
`;

class ConfigKeys extends React.Component {
  state = {
    apiKeys: [],
    loading: true,
    keyName: '',
    keyValue: '',
  };

  confirmUpdate = () => {
    this.fetchApiKeys();
    this.props.actions.closeModal();
  };

  confirmDelete = () => {
    const { keyName } = this.state;
    deleteApiKey({ keyName })
      .then(this.fetchApiKeys)
      .catch(error => {
        console.log(error);
      });
    this.props.actions.closeModal();
  };

  handleUpdate = row => {
    this.props.actions.openModal({
      modalType: 'updateSystemSettings',
      type: 'Update',
      keyName: row.keyName,
      keyValue: row.value,
      handleConfirm: this.confirmUpdate,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleCreate = () => {
    this.props.actions.openModal({
      modalType: 'createSystemSettings',
      type: 'Create',
      handleConfirm: this.confirmUpdate,
      keyName: this.state.keyName,
      keyValue: this.state.keyValue,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleDelete = row => {
    this.setState({ keyName: row.keyName });
    this.props.actions.openModal({
      modalType: 'deleteSystemSettings',
      name: row.keyName,
      handleConfirm: this.confirmDelete,
      handleClose: this.props.actions.closeModal,
    });
  };

  componentDidMount() {
    this.fetchApiKeys();
  }

  fetchApiKeys = () => {
    fetchApiKeys()
      .then(payload => {
        let apiKeys = [];
        let i = 1;
        let keys = Object.keys(payload.keys);
        keys.forEach(j => {
          const apiKey = {
            serialNum: i,
            keyName: j,
            value: payload.keys[j],
          };
          ++i;
          apiKeys.push(apiKey);
        });
        this.setState({
          apiKeys: apiKeys,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { apiKeys, loading } = this.state;
    return (
      <React.Fragment>
        {loading ? (
          <CircularLoader height={26} />
        ) : (
          <React.Fragment>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No.</TableCell>
                  <TableCell align="right">Key Name</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiKeys.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.serialNum}
                    </TableCell>
                    <TableCell align="right">{row.keyName}</TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">
                      <ActionSpan
                        onClick={() => {
                          this.handleUpdate(row);
                        }}
                      >
                        Edit
                      </ActionSpan>
                      <ActionSeparator> | </ActionSeparator>
                      <ActionSpan
                        onClick={() => {
                          this.handleDelete(row);
                        }}
                      >
                        Delete
                      </ActionSpan>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AddConfigButton
              variant="contained"
              color="primary"
              onClick={this.handleCreate}
            >
              Add Config Key
            </AddConfigButton>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

ConfigKeys.propTypes = {
  history: PropTypes.object,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ConfigKeys);
