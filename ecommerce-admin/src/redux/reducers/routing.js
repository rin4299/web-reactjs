import * as Types from './../../constants/ActionType';
let initialState = [];
let index = -1;

const findIndexs = (id, state) => {
    index = state.findIndex(e => e.id === id)
    return index;
}
const routing = (state = initialState, action) => {
    // console.log('action.type', action.type)

    switch (action.type) {
        case Types.GENERATE_ROUTING:
            state = action.data;
            // console.log('fetch_cart', [...state])
            return [...state];
        case Types.CLEAR_ROUTING:
            state = [];
            return [...state];
        default: return [...state];
    }
};

export default routing;