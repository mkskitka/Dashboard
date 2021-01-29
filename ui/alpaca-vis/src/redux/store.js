/**
 * Redux store
 */
import { createStore } from "redux";
import tailwaterReducer from "./reducer";

//const rootReducer = combineReducers({sidebarReducer,
//									 motivationReducer,});

const store = createStore(tailwaterReducer);

export default store;