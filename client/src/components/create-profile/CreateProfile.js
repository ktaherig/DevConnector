import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import {createProfile}  from '../../actions/profileActions';

class CreateProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displaySocialInputs: false,
			handle: '',
			company: '',
			website: '',
			location: '',
			status: '',
			skills: '',
			githubUserName: '',
			bio: '',
			twitter: '',
			gab: '',
			linkedin: '',
			youtube: '',
			instagram: '',
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	};

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors) {
			this.setState({
				errors: nextProps.errors
			});
		}
	}

	onSubmit(e) {
		e.preventDefault();

		const profileData = {
			handle: this.state.handle,
			company: this.state.company,
			website: this.state.website,
			location: this.state.location,
			status: this.state.status,
			skills: this.state.skills,
			githubUserName: this.state.githubUserName,
			bio: this.state.bio,
			twitter: this.state.twitter,
			facebook: this.state.facebook,
			linkedin: this.state.linkedin,
			youtube: this.state.youtube,
			instagram: this.state.instagram,
		};

		this.props.createProfile(profileData, this.props.history);
	}

	render() {
		const {errors, displaySocialInputs} = this.state;

		let socialInputs;

		if(displaySocialInputs) {
			socialInputs = (
				<div>
					<InputGroup
						placeholder="Twitter Profile URL"
						name="twitter"
						icon="fab fa-twitter"
						value={this.state.twitter}
						onChange={this.onChange}
						error={errors.twitter}
					/>

					<InputGroup
						placeholder="Gab Profile URL"
						name="gab"
						icon="fas fa-american-sign-language-interpreting"
						value={this.state.gab}
						onChange={this.onChange}
						error={errors.gab}
					/>

					<InputGroup
						placeholder="LinkedIn Profile URL"
						name="linkedin"
						icon="fab fa-linkedin"
						value={this.state.linkedin}
						onChange={this.onChange}
						error={errors.linkedin}
					/>

					<InputGroup
						placeholder="YouTube Channel URL"
						name="youtube"
						icon="fab fa-youtube"
						value={this.state.youtube}
						onChange={this.onChange}
						error={errors.youtube}
					/>

					<InputGroup
						placeholder="Instagram Page URL"
						name="instagram"
						icon="fab fa-instagram"
						value={this.state.instagram}
						onChange={this.onChange}
						error={errors.instagram}
					/>

				</div>
			)
		}

		// Select options for the user status
		const options = [
			{
				label: '* Select Professional Status',
				value: 0
			},
			{
				label: 'Developer',
				value: 'Developer'
			},
			{
				label: 'Junior Developer',
				value: 'Junior Developer'
			},
			{
				label: 'Senior Developer',
				value: 'Senior Developer'
			},
			{
				label: 'Manager',
				value: 'Manager'
			},
			{
				label: 'Student',
				value: 'Student'
			},
			{
				label: 'Instructor',
				value: 'Instructor'
			},
			{
				label: 'Intern',
				value: 'Intern'
			},
			{
				label: 'Other',
				value: 'Other'
			}
		];

		return (
			<div className="create-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Create Your Profile</h1>
							<p className="lead text-center">
								Let's get some info to make your profile shine
							</p>
							<small className="d-block pb-3">* = required fields</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Profile Handle"
									name="handle"
									value={this.state.handle}
									onChange={this.onChange}
									error={errors.handle}
									info="This will be a unique handle for your profile URL: your full name, company name, nickname, etc."
								/>
								<SelectListGroup
									placeholder="* Status"
									name="status"
									value={this.state.status}
									onChange={this.onChange}
									options={options}
									error={errors.status}
									info="A rough idea of where you are in your career"
								/>
								<TextFieldGroup
									placeholder="Company"
									name="company"
									value={this.state.company}
									onChange={this.onChange}
									error={errors.company}
									info="The company you work for"
								/>
								<TextFieldGroup
									placeholder="Website"
									name="website"
									value={this.state.website}
									onChange={this.onChange}
									error={errors.website}
									info="This could be your own website or a company website"
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={this.state.location}
									onChange={this.onChange}
									error={errors.location}
									info="City or city and state suggested"
								/>
								<TextFieldGroup
									placeholder="Skills"
									name="skills"
									value={this.state.skills}
									onChange={this.onChange}
									error={errors.skills}
									info='Please use comma-separated values (For example, " HTML,CSS,JavaScript,PHP" etc.)'
								/>
								<TextFieldGroup
									placeholder="GitHub Username"
									name="githubUserName"
									value={this.state.githubUserName}
									onChange={this.onChange}
									error={errors.githubUserName}
									info="If you'd like your latest repos included with a Github link, be sure to include your username"
								/>
								<TextAreaFieldGroup
									placeholder="Bio"
									name="bio"
									value={this.state.bio}
									onChange={this.onChange}
									error={errors.bio}
									info="A short history of yourself"
								/>
								<div className="mb-3">
									<button type="button" onClick={() => {
										this.setState(prevState => ({
											displaySocialInputs: !prevState.displaySocialInputs
										}))
									}} className="btn btn-light">
										Add Social Network Links
									</button>
									<span className="text-muted">Optional</span>
								</div>
								{socialInputs}
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
};

CreateProfile.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors,
	
});

export default connect(mapStateToProps, {createProfile})(withRouter(CreateProfile));
