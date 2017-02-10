import React from 'react'
import { render } from 'react-dom'

const App = React.createClass({
	render() {
		return <div>HI!</div>
	}
});

render(<App/>, document.getElementById('app-container'))
