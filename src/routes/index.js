import usersRoute from "./usersRoute";
import itemsRoute from "./itemsRoute";
import category from "./categoryRoute";

function Routes(app) {
	usersRoute(app);
	itemsRoute(app);
	category(app);
}

export default Routes;