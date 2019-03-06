import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {getProfileByHandle} from '../../actions/profileActions';

import ProfileAbout from './ProfileAbout';
import ProfileCreds from './ProfileCreds';
import ProfileGithub from './ProfileGithub';
import ProfileHeader from './ProfileHeader';

import Spinner from '../common/Spinner';

class Profile extends Component {
	componentDidMount() {
		if(this.props.match.params.handle) {
			this.props.getProfileByHandle(this.props.match.params.handle);
		}
	};

	componentWillReceiveProps(nextProps) {
		if(nextProps.profile.profile === null && this.props.profile.loading) {
			this.props.history.push('/not-found');
		}
	};

	render() {
		const {profile, loading} = this.props.profile;
		let profileContent;

		if(profile === null || loading) {
			profileContent = <Spinner />;
		} else {
			profileContent = (
				<div>
					<div className="row">
						<div className="col-md-6">
							<Link to="/profiles" className="btn btn-light mb-3 float-left">
								Back to Profiles
							</Link>
						</div>
						<div className="col-md-6">
						</div>
					</div>
					<ProfileHeader profile={profile}/>
					<ProfileAbout profile={profile}/>
					<ProfileCreds
						education={profile.education}
						experience={profile.experience}
					/>
					
				</div>
			);
		}

		/**
		 * The following codeblock ("githubUserName") works
		 * perfectly fine provided that the particular user in
		 * question has Github account registered. If he/she
		 * doesn't, then as soon as you click the "View Profile"
		 * button, the entire page crashes. For this reason, I've
		 * commented this out so that I can continue studying
		 * through the course and I'll see if I can do more
		 * extraneous investigation to see what causes this error,
		 * because the course instructor never explains it and
		 * never even covers it. I've cross-checked the source
		 * code on the public Github repo just to make sure I
		 * didn't make any mistakes while I was following along,
		 * and everything is indeed exactly the same as the
		 * source code, so I have no idea what's going on. I
		 * will attempt to fix this later. For now, for the current
		 * time being, I'm commenting it out so that I can actually
		 * continue the course.
		 */

		//	{profile.githubUserName ? (
		//		<ProfileGithub username={profile.githubUserName}/>
		//	) : null}


		return (
			<div className="profile">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							{profileContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Profile.propTypes = {
	getProfileByHandle: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile
});

export default connect(mapStateToProps, {getProfileByHandle})(Profile);
