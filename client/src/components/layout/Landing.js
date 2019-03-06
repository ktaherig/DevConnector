import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';

class Landing extends Component {

	componentDidMount() {
		if(this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	render() {
		return (
			<div>
				<div className="landing">
					<div className="dark-overlay landing-inner text-light">
						<div className="container">
							<div className="row">
								<div className="col-md-12 text-center">
									<h1 className="display-3 mb-4">Developer Connector</h1>
									<p className="lead"> Create Link developer profile/portfolio, share posts and get help from other developers</p>
									<hr />
									<Link to="/register" className="btn btn-lg btn-info mr-2">Sign Up</Link>
									<Link to="/login" className="btn btn-lg btn-light">Login</Link>
									<br/>
									<br/>
									<br/>
									<br/>
									<br/>
									<br/>
									<h2> Notice: </h2>
									<div>
										<p>This website, although fully-functional, is strictly a portfolio demo project. It is not nor is it intended to be used as an actual social network in any way whatsoever by which to stay in contact with coworkers and friends. It is solely and exclusively for portfolio demonstration purposes only.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Landing.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Landing);
