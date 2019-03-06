import React from 'react';

class Footer extends React.Component {
	render() {
		return (
	<footer className="bg-dark text-white mt-5 p-4 text-center">
		<div>
			<div>
				Copyright &copy; {new Date().getFullYear()}, Kourosh Taheri-Golvarzi
			</div>
		</div>
	</footer>
		);
	}
}

export default Footer;
