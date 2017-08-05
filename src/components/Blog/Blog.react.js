import React, { Component } from 'react';
import './Blog.css';
import PropTypes from 'prop-types';
import htmlToText from 'html-to-text';
import $ from 'jquery';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import susi from '../../images/susi-logo.svg';
import dateFormat from 'dateformat';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';

class Blog extends Component {

    constructor(props){
        super(props);

        this.state = {
            posts: [],
            postRendered: false,
        }
    }

    componentDidMount() {

        $.ajax({
        url: 'https://api.rss2json.com/v1/api.json',
        method: 'GET',
        dataType: 'json',
        data: {
            'rss_url': 'http://blog.fossasia.org/tag/susi-ai/feed/'
        }
        }).done(function (response) {
            if(response.status !== 'ok'){ throw response.message; }
            this.setState({ posts: response.items, postRendered: true});
        }.bind(this));
    }


    render() {

        if(this.state.postRendered) {
            return (
                <div>
                    <StaticAppBar {...this.props}
                        location={this.props.location} />
                        <div className='head_section'>
                            <div className='container'>
                                <div className="heading">
                                    <h1>Blog</h1>
                                    <p>Latest Blog Posts on SUSI.AI</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                this.state.posts.map((posts , i) => {
                                    let description = htmlToText.fromString(posts.description).split('…');
                                    let text = description[0].split(']');
                                    let regExp = /\[(.*?)\]/;
                                    let imageUrl = regExp.exec(description[0]);
                                    let date = posts.pubDate.split(' ');
                                    let d = new Date(date[0]);
                                        return (
                                            <div key={i} className="section_blog">
                                                <Card>
                                                    <CardMedia
                                                        overlay={
                                                            <CardTitle
                                                                subtitle={'Published on '+ dateFormat(d, 'dddd, mmmm dS, yyyy')} />
                                                        }
                                                    >
                                                        <img className="featured_image"
                                                            src={imageUrl[1]}
                                                            alt={posts.title}
                                                        />
                                                    </CardMedia>
                                                    <CardTitle title={posts.title} subtitle={'by '+ posts.author} />
                                                    <CardText>{text[1]+'...'} </CardText>
                                                    <CardActions>
                                                        <FlatButton href={posts.link} label="Read More" />
                                                    </CardActions>
                                                </Card>
                                            </div>
                                        )
                                })
                            }
                        </div>
                        <div className="post_bottom"></div>
                        <div className='footer'>
                            <a className='susi-logo-anchor' href='/overview'>
                                <img src={susi} alt='SUSI' className='susi-logo' />
                            </a>
                            <div className="footer_content">
                                <div className='footer-container'>
                                    <ul className='alignLeft'>
                                        <li><a href='/overview'>Overview</a></li>
                                        <li><a href='/blog'>Blog</a></li>
                                        <li><a href='https://github.com/fossasia?utf8=%E2%9C%93&q=susi'>Code</a></li>
                                    </ul>
                                    <ul className='alignRight'>
                                        <li><a href='/settings'>Settings</a></li>
                                        <li><a href='/terms'>Terms</a></li>
                                        <li><a href='/contact'>Contact</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                </div>
            );
        }
            return (
                <div>
                    <StaticAppBar {...this.props}
                        location={this.props.location} />
                </div>
            );
    }
}
Blog.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object

}

export default Blog;
