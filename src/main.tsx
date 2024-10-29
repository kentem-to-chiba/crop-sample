import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import "react-image-crop/dist/ReactCrop.css";
import Page1 from "./routes/page1";
import Page2 from "./routes/page2";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
	},
	{
		path: "/page1",
		element: <Page1 />,
	},
	{
		path: "/page2",
		element: <Page2 />,
	},
]);

const root = document.getElementById("root");
if (root)
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>,
	);
