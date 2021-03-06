/**
 * Created by dingyiming on 2017/2/13.
 */


import * as types from '../action/types';

const initialState = {
    timer:null
};

let timer = (state = initialState, action) => {

    switch (action.type) {

        case types.TIMER_SET:

            return Object.assign({}, state, {
                timer:action.timer
            });
        case types.TIMER_CLEAR:
            clearInterval(state.timer);
            return Object.assign({}, state, {
                timer:null
            });
            break;
        default:
            return state;
    }
}

export default timer;
