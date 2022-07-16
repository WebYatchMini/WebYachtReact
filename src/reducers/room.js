import * as roomAction from '../actions/room';

const initStates = {
    roomCode: '',
    roomTitle: '',
}

const reducers = (state = initStates, action) => {
    switch (action.type) {
        case roomAction.SET_ROOMCODE: {
            return {
                ...state,
                roomCode: action.roomCode
            }
        }
        case roomAction.SET_ROOMTITLE: {
            return {
                ...state,
                roomTitle: action.roomTitle
            }
        }
        case roomAction.RESET: {
            return initStates;
        }
        default: {
            return state;
        }
    }
}

export default reducers;    