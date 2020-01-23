/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Ratings from 'react-ratings-declarative';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CircleImage from '../../shared/CircleImage';
import SkillRatingPopover from '../SkillRating/SkillRatingPopover.js';
import NavigationArrowDropDown from '@material-ui/icons/ArrowDropDown';
import getImageSrc from '../../../utils/getImageSrc';
import { StaffPickImage } from '../SkillsStyle';
import { RatingContainer, TotalRating, ReactTooltip } from '../SkillCardStyle';
import SkillExampleBubble from '../../shared/SkillExampleBubble';
import styled from 'styled-components';
import getSkillNameFromSkillTag from '../../../utils/getSkillNameFromSkillTag';

const Card = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #eaeded;
  padding: 7px;
  line-height: 1.25;
  @media (max-width: 550px) {
    height: fit-content;
  }
`;

const ImageContainer = styled.div`
  display: inline-block;
  align-items: center;
  padding: 0.625rem;
  background: #fff;
`;

const DetailsContainer = styled.div`
  width: auto;
  display: flex;
`;

const ExampleContainer = styled.div`
  float: left;
  display: flex;
  flex-direction: row;
  width: 57.448%;
  margin-right: 6%;
  max-width: 35.8rem;
  @media(max-width: 550px){
    width: 200%
    height: min-content;
  }
`;

const RightContainer = styled.div`
  height: 100%;
  float: right;
  max-width: 17rem;
  min-width: 10rem;
  font-size: 0.75rem;
  width: 40%;
  margin-right: 11%;
`;

const Row = styled.div`
  width: 100%;
  positive: relative;
  float: left;
  text-align: start;
`;

const TitleContainer = styled.div`
  text-align: left;
  font-size: 1.125rem;
  color: #4285f4;
  margin: 6px 0px;
  border: 1px;
  height: 1.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Header = styled.div`
  margin-bottom: 0.625rem;
  width: 100%;
`;

const GridList = styled.div`
  margin-top: 1.25rem;
  margin-bottom: 2.5rem;
  padding: 0px 0.625rem;
  width: 100%;
`;

const Content = styled.div`
  padding-left: 4.3%;
  float: left;
  display: block;
  width: 100%;
  color: #949494;
  @media (max-with: 550px) {
    padding-left: 2.5%;
  }
`;

const ImageContainerMobile = styled.div`
  padding: 0.625rem;
`;

const ImageMobile = styled.img`
  width: 6rem;
  border-radius: 50%;
`;

const Image = styled.img`
  position: relative;
  width: 14rem;
  vertical-align: top;
  border-radius: 50%;
  margin-left: 6.4%;
`;

function createListCard(
  el,
  skillName,
  authorName,
  description,
  image,
  skill,
  examples,
  totalRating,
  averageRating,
  staffPick,
  stars,
  { history },
) {
  const dataId = `index-${el}`;
  const skillPathname = `/${skill.group}/${skill.skillTag}/${skill.language}`;
  const skillFeedbackPathname = `${skillPathname}/feedbacks`;
  const mobileView = window.innerWidth < 430;
  if (mobileView) {
    return (
      <Card key={el}>
        <ImageContainerMobile>
          {image ? (
            <ImageMobile alt={skillName} src={image} />
          ) : (
            <CircleImage name={skillName} size="120" />
          )}
        </ImageContainerMobile>
        <Content>
          <Header>
            <TitleContainer>
              <Link
                key={el}
                to={{
                  pathname: skillPathname,
                }}
              >
                <span>{getSkillNameFromSkillTag(skillName)}</span>
              </Link>
            </TitleContainer>
            <div style={{ fontSize: 12 }}>
              <span>{authorName}</span>
            </div>
            <RatingContainer>
              <Link
                key={el}
                to={{
                  pathname: skillFeedbackPathname,
                }}
              >
                <Ratings
                  style={{ display: 'flex' }}
                  rating={averageRating || 0}
                  widgetRatedColors="#ffbb28"
                  widgetDimensions="20px"
                  widgetSpacings="0px"
                >
                  <Ratings.Widget />
                  <Ratings.Widget />
                  <Ratings.Widget />
                  <Ratings.Widget />
                  <Ratings.Widget />
                </Ratings>
                <TotalRating>{totalRating || 0}</TotalRating>
              </Link>
            </RatingContainer>
            <ExampleContainer>
              {examples.length > 0 && (
                <SkillExampleBubble
                  key={0}
                  data={examples[0]}
                  history={history}
                />
              )}
            </ExampleContainer>
          </Header>
        </Content>
      </Card>
    );
  }

  return (
    <Card key={el}>
      <ImageContainer>
        {image ? (
          <Link
            key={el}
            to={{
              pathname: skillPathname,
            }}
          >
            <Image alt={skillName} src={image} />
          </Link>
        ) : (
          <CircleImage name={skillName} size="224" />
        )}
      </ImageContainer>
      <Content>
        <Header>
          <TitleContainer>
            <Link
              key={el}
              to={{
                pathname: skillPathname,
              }}
            >
              <span>{getSkillNameFromSkillTag(skillName)}</span>
            </Link>
            {staffPick && <StaffPickImage />}
          </TitleContainer>
          <div style={{ fontSize: '12' }}>
            <span>{authorName}</span>
          </div>
        </Header>
        <DetailsContainer>
          <ExampleContainer>
            {examples &&
              Array.isArray(examples) &&
              examples.length > 0 &&
              examples.map((eg, index) => {
                return (
                  <SkillExampleBubble key={index} data={eg} history={history} />
                );
              })}
          </ExampleContainer>
          <RightContainer>
            <Row>
              <div>
                <div data-tip="custom" data-for={dataId}>
                  <Link
                    key={el}
                    to={{
                      pathname: `/${skill.group}/${skill.skillTag}/${skill.language}/feedbacks`,
                    }}
                  >
                    <Ratings
                      style={{ display: 'flex' }}
                      rating={averageRating || 0}
                      widgetRatedColors="#ffbb28"
                      widgetDimensions="20px"
                      widgetSpacings="0px"
                    >
                      <Ratings.Widget />
                      <Ratings.Widget />
                      <Ratings.Widget />
                      <ReactTooltip
                        className="customeTheme"
                        id={dataId}
                        type={'light'}
                        place="bottom"
                        effect="solid"
                        delayHide={250}
                        border={true}
                      >
                        <SkillRatingPopover stars={stars} />
                      </ReactTooltip>
                      <Ratings.Widget />
                      <Ratings.Widget />
                    </Ratings>
                    <NavigationArrowDropDown
                      style={{
                        fill: '#595959',
                        marginBottom: '-7px',
                        cursor: 'pointer',
                      }}
                    />
                    <TotalRating>{totalRating || 0}</TotalRating>
                  </Link>
                </div>
              </div>
            </Row>
            <Row>
              <div style={{ fontWeight: 700, lineHeight: 1.25, fontSize: 13 }}>
                Description
              </div>
              <div style={{ fontSize: 12 }}>{description}</div>
            </Row>
          </RightContainer>
        </DetailsContainer>
      </Content>
    </Card>
  );
}

class SkillCardList extends Component {
  static propTypes = {
    skills: PropTypes.array,
    history: PropTypes.object,
  };

  componentDidMount() {
    this.loadSkillCards();
  }

  loadSkillCards = () => {
    let cards = [];
    Object.keys(this.props.skills).forEach(el => {
      let skill = this.props.skills[el];
      let skillName = 'Name not available',
        examples = [],
        image = '',
        description = 'No description available',
        authorName = 'Author',
        averageRating = 0,
        totalRating = 0,
        staffPick = false,
        stars = {
          oneStar: 0,
          twoStar: 0,
          threeStar: 0,
          fourStar: 0,
          fiveStar: 0,
          avgStar: 0,
          totalStar: 0,
        };
      if (skill.skillName) {
        skillName = skill.skillName;
        skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
      }
      if (skill.image) {
        image = getImageSrc({
          relativePath: `model=${skill.model}&language=${skill.language}&group=${skill.group}&image=${skill.image}`,
        });
      }
      if (
        skill.examples &&
        skill.examples.length > 0 &&
        skill.examples[0] !==
          '<The question that should be shown in public skill displays>'
      ) {
        examples = skill.examples;
        examples = examples.slice(0, 2); // Select max 2 examples
      } else {
        examples.push('Test this example of skill');
      }
      if (skill.descriptions && skill.descriptions !== '<description>') {
        description = skill.descriptions;
      }
      if (skill.author && skill.author !== '<author_name>') {
        authorName = skill.author;
      }
      if (skill.skillRating) {
        averageRating = parseFloat(skill.skillRating.stars.avgStar);
        totalRating = parseInt(skill.skillRating.stars.totalStar, 10);
        stars = skill.skillRating.stars;
      }

      if (skill.staffPick) {
        staffPick = true;
      }
      cards.push(
        createListCard(
          el,
          skillName,
          authorName,
          description,
          image,
          skill,
          examples,
          totalRating,
          averageRating,
          staffPick,
          stars,
          this.props,
        ),
      );
    });
    return cards;
  };

  render() {
    return <GridList>{this.loadSkillCards()}</GridList>;
  }
}

function mapStateToProps(store) {
  return {
    skills: store.skills.listSkills ? store.skills.listSkills : [],
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(SkillCardList),
);
