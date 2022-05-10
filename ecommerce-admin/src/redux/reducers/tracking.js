import * as Types from './../../constants/ActionType';
let initialState = [];

const findIndexs = (id, state) => {
    let result = -1;
    state.forEach((item, index) => {
        if (item.id === id) {
            result = index;
        }
    });
    return result;
}

const tracking = (state = initialState, action) => {
    let index = -1;
    switch (action.type) {
        case Types.TRACKING_REQUEST:
            state = action.data;
            return [...state];
        default: return [...state];
    }
};

export default tracking;