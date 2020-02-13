/* eslint-disable max-len */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../../redux/actions/skill';
import uiActions from '../../../redux/actions/ui';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '../../shared/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CircleImage from '../../shared/CircleImage';
import Button from '../../shared/Button';
import isMobileView from '../../../utils/isMobileView';
import FiveStarRatingWidget from '../../shared/FiveStarRatingWidget';
import { RATING_TO_HINT_MAP } from '../../../constants/ratingHints';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Delete from '@material-ui/icons/Delete';
import EditBtn from '@material-ui/icons/BorderColor';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';
import Emoji from 'react-emoji-render';
import styled, { css } from 'styled-components';
import SkillRatingCard from '../SkillRating/SkillRatingCard';

import { parseDate, formatDate } from '../../../utils';
import getImageSrc from '../../../utils/getImageSrc';
import { Paper, CenterReaderContainer } from '../../shared/Container';
import { SubTitle, Title } from '../../shared/Typography';
import CircularLoader from '../../shared/CircularLoader';
import OutlinedTextField from '../../shared/OutlinedTextField';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';
const pageLimit = 6;

const range = (from, to, step = 1) => {
  let i = from;
  const rangeArr = [];

  while (i <= to) {
    rangeArr.push(i);
    i += step;
  }

  return rangeArr;
};

const Container = styled(CenterReaderContainer)`
  width: 100%;
  font-size: 0.875rem;
  @media only screen and (min-width: 1240px) {
    margin-top: 4rem;
  }
  @media only screen and (max-width: 426px) {
    padding: 1.6rem 1rem;
  }
`;

const Timestamp = styled.div`
  color: #aaa;
  font-size: 0.75rem;
`;

const AvatarImage = styled.img.attrs({
  alt: 'Thumbnail',
})`
  height: 3.75rem;
  width: auto;
`;

const SkillName = styled.h1`
  font-weight: 400;
  :hover {
    text-decoration: underline;
  }
`;

const SkillDetailContainer = styled.div`
  display: flex;
  padding-top: 2%;
`;

const Footer = styled.div`
  padding: 2%;
`;

const PaginationContainer = styled.div`
  padding: 0.875rem;
`;

const Pagination = styled.ul`
  display: flex;
  padding-left: 0;
  list-style: none;
  justify-content: center;
  align-items: center;
`;

const EnabledButtonStyles = css`
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.6) inset;
  background: linear-gradient(to bottom, #f7f8fa, #e7e9ec);
  border: 1px solid #6c6e73;
  border-color: #adb1b8 #a2a6ac #8d9096;
  color: #000000;
  padding: 0.5rem 0.75rem;
  margin-left: 0.25rem;
  cursor: pointer;
`;

const AuthorName = styled.span`
  cursor: pointer;
`;

const NavigateButtonWrapper = styled.div`
  padding: 0.5rem 0.75rem;
  bottom: 0.625rem;
  cursor: pointer;
  ${props =>
    props.status === 'active'
      ? css`
          ${EnabledButtonStyles}
        `
      : css`
          color: #999;
          cursor: inherit;
        `}
`;

const NavigateButton = styled.div`
  ${props =>
    props.status === 'disabled' &&
    css`
      color: #999;
      cursor: inherit;
    `}
`;

const PageLinkStyles = css`
  display: block;
  margin-left: -1px;
  line-height: 1.25;
`;

const DotLink = styled.span`
  ${PageLinkStyles}
`;

const PageLink = styled.div`
  ${PageLinkStyles}
  ${EnabledButtonStyles}

  ${props =>
    props.status === 'active' &&
    css`
      font-weight: 700;
      background-color: #fff;
      background-image: none;
      color: #417dde;
      border-color: #417dde;
      text-decoration: none;
    `}
`;

const DottedNavigation = styled.li`
  margin-left: 4px;
  padding: 1%;
  cursor: default;
  color: #999;
`;

const PageLinkContainer = styled.li`
  background-color: #fff;
  display: block;
  float: left;
  line-height: 16px;
  list-style: none;
  position: relative;
`;

class SkillFeedbackPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorText: '',
      loading: true,
      currentPage: 1,
      currentRecords: [],
      anchorEl: null,
      rating: 0,
      loader: false,
    };
    this.totalPages = 1;
    this.pageNeighbours =
      typeof this.pageNeighbours === 'number'
        ? Math.max(0, Math.min(this.pageNeighbours, 2))
        : 0;
    const { pathname } = this.props.location;
    this.groupValue = pathname.split('/')[1];
    this.skillTag = pathname.split('/')[2];
    this.languageValue = pathname.split('/')[3];
    this.skillName = this.skillTag
      ? this.skillTag
          .split('_')
          .map(data => {
            const s = data.charAt(0).toUpperCase() + data.substring(1);
            return s;
          })
          .join(' ')
      : '';

    this.skillData = {
      model: 'general',
      group: this.groupValue,
      language: this.languageValue,
      skill: this.skillTag,
    };
  }

  fetchPageNumbers = () => {
    const { skillFeedbacks } = this.props;
    const { currentPage } = this.state;
    const totalPages = Math.ceil(skillFeedbacks.length / pageLimit);
    const pageNeighbours = this.pageNeighbours;
    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = this.pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;
    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);
      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }
        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }
        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  async componentDidMount() {
    const { actions } = this.props;
    actions.getSkillMetaData(this.skillData);
    try {
      await actions.getSkillFeedbacks(this.skillData);
      this.setState({ loading: false });
      this.gotoPage(1);
    } catch (error) {
      this.setState({ loading: false });
      actions.openSnackBar({
        snackBarMessage: 'Failed to fetch skill feedbacks',
        snackBarDuration: 2000,
      });
      console.log(error);
    }
  }

  onPageChanged = data => {
    const { currentPage } = this.state;
    const { skillFeedbacks } = this.props;
    const offset = (currentPage - 1) * pageLimit;
    const currentRecords = skillFeedbacks.slice(offset, offset + pageLimit);
    this.setState({ currentPage, currentRecords });
  };

  gotoPage = page => {
    const { skillFeedbacks } = this.props;
    const currentPage = Math.max(0, page);
    const paginationData = {
      currentPage,
      totalPages: Math.ceil(skillFeedbacks.length / pageLimit),
      pageLimit,
      totalRecords: skillFeedbacks,
    };
    this.setState({ currentPage }, () => this.onPageChanged(paginationData));
  };

  handleClick = page => evt => {
    evt.preventDefault();
    this.gotoPage(page);
  };

  handleMoveLeft = evt => {
    const { currentPage } = this.state;
    evt.preventDefault();
    if (currentPage !== 1) {
      this.gotoPage(currentPage - 1);
    }
  };

  handleMoveRight = evt => {
    const { currentPage } = this.state;
    const { skillFeedbacks } = this.props;
    evt.preventDefault();
    if (currentPage !== Math.ceil(skillFeedbacks.length / pageLimit)) {
      this.gotoPage(currentPage + 1);
    }
  };

  handleDeleteModal = () => {
    this.props.actions.openModal({
      modalType: 'deleteFeedback',
      handleConfirm: this.deleteFeedback,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleEditModal = previousFeedback => {
    this.handleMenuClose();
    this.setState({ feedbackValue: previousFeedback }, () => {
      this.props.actions.openModal({
        modalType: 'editFeedback',
        handleConfirm: this.postFeedback,
        handleClose: this.props.actions.closeModal,
        errorText: this.state.errorText,
        feedback: this.state.feedbackValue,
        rating: this.props.userRating,
        handleEditFeedback: this.editFeedback,
        handleEditRating: this.editRating,
      });
    });
  };

  editRating = rating => {
    this.setState({ rating });
  };

  editFeedback = () => {
    let feedbackText = document.getElementById('edit-feedback').value;
    this.setState({ feedbackValue: feedbackText });
  };

  setFeedback = event => {
    this.setState({ feedbackValue: event.target.value });
  };

  setSkillRating = async ({ message }) => {
    const { rating } = this.state;
    const { group, language, skillTag: skill, actions } = this.props;

    const skillData = {
      model: 'general',
      group,
      language,
      skill,
      stars: rating,
    };
    try {
      await actions.setUserRating({ userRating: rating });
      if (message === 'rate') {
        actions.openSnackBar({
          snackBarMessage: 'The skill was reviewed successfully!',
          snackBarDuration: 4000,
        });
      }
      try {
        await actions.getSkillRating(skillData);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  postFeedback = async () => {
    if (this.state.feedbackValue !== '') {
      const { group, language, skillTag: skill, actions } = this.props;
      const { feedbackValue } = this.state;
      const skillData = {
        model: 'general',
        group,
        language,
        skill,
        feedback: feedbackValue,
      };
      if (feedbackValue) {
        try {
          this.setState({ loader: true });
          await actions.setSkillFeedback(skillData);
          actions.closeModal();
          await actions.getSkillFeedbacks(skillData);
        } catch (error) {
          console.log(error);
        }
        this.setState({ loader: false });
        // this.handleEditClose();
      } else {
        this.setState({ errorText: 'Feedback cannot be empty' });
      }
    }
    await this.setSkillRating({ message: 'rate' });
  };

  deleteFeedback = async () => {
    const { actions } = this.props;
    this.setState({ rating: 0 }, () => {
      this.setSkillRating({ message: 'delete' });
    });
    try {
      await actions.deleteSkillFeedback(this.skillData);
      actions.closeModal();
      actions.getSkillFeedbacks(this.skillData);
    } catch (error) {
      console.log(error);
    }
  };

  handleMenuOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  openAuthorSkills = () => {
    this.props.actions.openModal({ modalType: 'authorSkills' });
  };

  // eslint-disable-next-line complexity
  render() {
    const { currentPage, errorText, loading, anchorEl } = this.state;
    const {
      image,
      skillName: _skillName,
      skillFeedbacks,
      email,
      author,
      accessToken,
      userRatingTimestamp,
      userRating,
      avatarImgThumbnail,
    } = this.props;
    const open = Boolean(anchorEl);
    const imgUrl = !image
      ? '/favicon-512x512.jpg'
      : getImageSrc({
          relativePath: `model=general&language=${this.languageValue}&group=${this.groupValue}&image=${image}`,
        });
    const skillName = _skillName === null ? 'No Name Given' : _skillName;

    const pages = this.fetchPageNumbers();
    const mobileView = isMobileView();
    let feedbackCards = [];
    let userFeedbackCard;
    let userFeedback;
    let userName = '';
    let userAvatarLink = '';
    let userEmail = '';
    let userFeedbackValue = '';
    if (skillFeedbacks) {
      userEmail = email;
      userAvatarLink = avatarImgThumbnail;
      userName = this.props.userName;
      const avatarProps = {
        src: userAvatarLink,
        name: userName === '' ? userEmail : userName,
      };
      userFeedback =
        skillFeedbacks[skillFeedbacks.findIndex(x => x.email === email)];
      if (userFeedback) {
        userFeedbackValue = userFeedback.feedback;
      }
      userFeedbackCard = userRating > 0 && (
        <div>
          <ListItem button>
            <CircleImage {...avatarProps} size="40" />
            <div style={{ width: '90%' }}>
              <div>{userName === '' ? userEmail : userName}</div>
              <Timestamp>
                {formatDate(parseDate(userRatingTimestamp))}
              </Timestamp>
              <FiveStarRatingWidget rating={userRating} />
              <div>
                <Emoji text={userFeedbackValue} />
              </div>
            </div>
            <div>
              <IconButton
                aria-owns={open ? 'options' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="options"
                anchorEl={anchorEl}
                open={open}
                onClose={this.handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    this.handleEditModal(userFeedbackValue);
                  }}
                >
                  <ListItemIcon>
                    <EditBtn />
                  </ListItemIcon>
                  <ListItemText> Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={this.handleDeleteModal}>
                  <ListItemIcon>
                    <Delete />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </ListItem>
          <Divider inset={true} />
        </div>
      );
    }
    if (skillFeedbacks) {
      feedbackCards = []
        .concat(skillFeedbacks)
        .sort((a, b) => {
          let dateA = new Date(a.timestamp);
          let dateB = new Date(b.timestamp);
          return dateB - dateA;
        })
        .slice((currentPage - 1) * pageLimit, currentPage * pageLimit)
        .map((data, index) => {
          userEmail = data.email;
          userAvatarLink = data.avatar;
          userName = data.userName;
          const avatarProps = {
            src: userAvatarLink,
            name: userName === '' ? userEmail : userName,
          };
          if (userEmail !== email) {
            return (
              <ListItem key={index} button>
                <CircleImage {...avatarProps} size="40" />
                <div>
                  <div>
                    {userName !== ''
                      ? userName
                      : `${userEmail.slice(0, userEmail.indexOf('@') + 1)}...`}
                  </div>
                  <Timestamp>{formatDate(parseDate(data.timestamp))}</Timestamp>
                  {data.rating > 0 ? (
                    <FiveStarRatingWidget rating={data.rating} />
                  ) : null}

                  <div>
                    <Emoji text={data.feedback} />
                  </div>
                </div>
              </ListItem>
            );
          }
          return null;
        });
    }
    let feedbackCardsElement = null;
    feedbackCardsElement = (
      <div>
        {accessToken && !userRating ? (
          <div>
            <SubTitle size="1rem">
              {`Write your invaluable feedback and rating with
            ${this.skillName} on SUSI.AI`}
            </SubTitle>
            <div>
              <Timestamp>
                <FormControl fullWidth={true}>
                  <div
                    style={{
                      textAlign: 'center',
                      margin: '1.5rem',
                    }}
                  >
                    <FiveStarRatingWidget
                      rating={this.state.rating}
                      widgetHoverColors="#ffbb28"
                      widgetDimensions={mobileView ? '30px' : '50px'}
                      widgetSpacings="5px"
                      changeRating={Rating => {
                        this.setState({ rating: Rating });
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '1rem' }}>
                    {RATING_TO_HINT_MAP[this.state.rating]}
                  </div>
                  <OutlinedTextField
                    id="post-feedback"
                    label="Skill Feedback(optional)"
                    placeholder="Skill Feedback"
                    defaultValue=""
                    margin="dense"
                    multiLine={true}
                    fullWidth={true}
                    onChange={this.setFeedback}
                    aria-describedby="post-feedback-helper-text"
                  />
                  <FormHelperText id="post-feedback-helper-text" error>
                    {errorText}
                  </FormHelperText>
                </FormControl>
                <Button
                  label="Post"
                  color="primary"
                  variant="contained"
                  handleClick={this.postFeedback}
                  disabled={this.state.rating === 0 || this.state.loader}
                  isLoading={this.state.loader}
                  style={{ marginBottom: '1em' }}
                  buttonText="Post"
                />
              </Timestamp>
            </div>
          </div>
        ) : null}
        {userRating > 0 ? userFeedbackCard : null}
        {feedbackCards}
      </div>
    );
    let renderElement = null;
    if (!loading) {
      renderElement = (
        <Container>
          <Paper margin={2}>
            <p style={{ marginLeft: 10 }}>
              <Link
                to={`/${this.groupValue}/${this.skillTag}/${this.languageValue}`}
                style={{ color: '#000000' }}
              >
                {this.skillName}
              </Link>
              <NavigationChevronRight style={{ paddingTop: 10 }} />
              Feedback
            </p>
            <SkillDetailContainer>
              <div style={{ paddingLeft: '2%' }}>
                <Link
                  to={`/${this.groupValue}/${this.skillTag}/${this.languageValue}`}
                >
                  {image == null ? (
                    <CircleImage
                      name={this.skillName.toUpperCase()}
                      size="60"
                    />
                  ) : (
                    <AvatarImage src={imgUrl} />
                  )}
                </Link>
              </div>
              <div style={{ paddingLeft: '2%' }}>
                <SkillName>
                  <Link
                    to={`/${this.groupValue}/${this.skillTag}/${this.languageValue}`}
                  >
                    {skillName}
                  </Link>
                </SkillName>
                <div>
                  by{' '}
                  <AuthorName onClick={this.openAuthorSkills}>
                    {author}
                  </AuthorName>
                </div>
              </div>
            </SkillDetailContainer>
          </Paper>
          <SkillRatingCard />
          <Paper>
            <Title marginTop>Feedback and Rating</Title>
            {feedbackCardsElement}
            {skillFeedbacks &&
              (skillFeedbacks.length > 0 ? (
                <PaginationContainer>
                  <Pagination>
                    <NavigateButtonWrapper
                      onClick={this.handleMoveLeft}
                      status={currentPage === 1 ? 'disable' : 'active'}
                    >
                      <NavigateButton
                        status={currentPage === 1 ? 'disable' : 'active'}
                      >
                        ← Previous
                      </NavigateButton>
                    </NavigateButtonWrapper>
                    {pages &&
                      pages.map((page, index) => {
                        if (page === LEFT_PAGE) {
                          return (
                            <DottedNavigation key={index}>
                              <DotLink>...</DotLink>
                            </DottedNavigation>
                          );
                        }
                        if (page === RIGHT_PAGE) {
                          return (
                            <DottedNavigation key={index}>
                              <DotLink>...</DotLink>
                            </DottedNavigation>
                          );
                        }
                        return (
                          <PageLinkContainer key={index}>
                            <PageLink
                              status={currentPage === page ? 'active' : ''}
                              onClick={this.handleClick(page)}
                            >
                              {page}
                            </PageLink>
                          </PageLinkContainer>
                        );
                      })}
                    <NavigateButtonWrapper
                      onClick={this.handleMoveRight}
                      status={
                        currentPage ===
                        Math.ceil(skillFeedbacks.length / pageLimit)
                          ? 'disable'
                          : 'active'
                      }
                    >
                      <NavigateButton
                        status={
                          currentPage ===
                          Math.ceil(skillFeedbacks.length / pageLimit)
                            ? 'disable'
                            : 'active'
                        }
                      >
                        Next →
                      </NavigateButton>
                    </NavigateButtonWrapper>
                  </Pagination>
                </PaginationContainer>
              ) : (
                <div className="feedback-default-message">
                  No feedback present for this skill!
                </div>
              ))}
            <Footer>
              <Link
                to={`/${this.groupValue}/${this.skillTag}/${this.languageValue}`}
                style={{ color: '#417DDE' }}
              >
                <b>
                  {`‹ See all details for ${this.skillTag &&
                    this.skillTag
                      .split(' ')
                      .map(data => {
                        let s =
                          data.charAt(0).toUpperCase() + data.substring(1);
                        return s;
                      })
                      .join(' ')}`}
                </b>
              </Link>
            </Footer>
          </Paper>
        </Container>
      );
    } else {
      renderElement = <CircularLoader />;
    }
    return <div>{renderElement}</div>;
  }
}

SkillFeedbackPage.propTypes = {
  skillTag: PropTypes.string,
  skillFeedbacks: PropTypes.array,
  language: PropTypes.string,
  group: PropTypes.string,
  feedback: PropTypes.string,
  actions: PropTypes.object,
  location: PropTypes.object,
  author: PropTypes.object,
  image: PropTypes.string,
  skillName: PropTypes.string,
  email: PropTypes.string,
  accessToken: PropTypes.string,
  userRating: PropTypes.number,
  userName: PropTypes.string,
  avatarImgThumbnail: PropTypes.string,
  userRatingTimestamp: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    language: store.skill.metaData.language,
    group: store.skill.metaData.group,
    skillTag: store.skill.metaData.skillTag,
    feedback: store.skill.feedback,
    skillFeedbacks: store.skill.skillFeedbacks,
    author: store.skill.metaData.author,
    image: store.skill.metaData.image,
    skillName: store.skill.metaData.skillName,
    email: store.app.email,
    accessToken: store.app.accessToken,
    userRating: store.skill.userRating,
    userRatingTimestamp: store.skill.userRatingTimestamp,
    userName: store.settings.userName,
    avatarImgThumbnail: store.app.avatarImgThumbnail,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skillActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillFeedbackPage);
