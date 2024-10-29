import { Link } from "react-router-dom";

function Root() {
	return (
		<ul>
			<li>
				<Link to="/page1">Page1</Link>
			</li>
			<li>
				<Link to="/page2">Page2</Link>
			</li>
		</ul>
	);
}
export default Root;
