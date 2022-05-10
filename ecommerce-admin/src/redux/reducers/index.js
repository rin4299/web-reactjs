import { combineReducers } from 'redux';
import auth from './auth';
import roles from './roles';
import users from './users';
import discounts from './discounts';
import products from './products';
import categories from './categories';
import orders from './orders';
import dashboard from './dashboard';
import producers from './producers';
import nameRole from './nameRole';
import infoMe from './infoMe';
import ratings from './ratings';
import contacts from './contacts';
import loading from './loading';
import cart  from  './cart'
import routing from './routing';
import tracking from './tracking'
const appReducers = combineReducers({
    auth,
    roles,
    users,
    discounts,
    products,
    categories,
    orders,
    dashboard,
    producers,
    nameRole,
    infoMe,
    ratings,
    contacts,
    loading,
    cart,
    routing,
    tracking
});

export default appReducers;