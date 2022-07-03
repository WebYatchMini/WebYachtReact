import * as userAction from '../actions/user';

const initStates = {
    id: 'initID',
    nickname: 'initNICKNAME',
    win: 0,
    lose: 0
}

const reducers = (state = initStates, action) => {
    switch (action.type) {
        case userAction.SET_UID: {
            return {
                ...state,
                id: action.id
            }
        }
        case userAction.SET_NICKNAME: {
            return {
                ...state,
                nickname: action.nickname
            }
        }
        case userAction.SET_WIN: {
            return {
                ...state,
                win: action.win
            }
        }
        case userAction.SET_LOSE: {
            return {
                ...state,
                lose: action.lose
            }
        }
        case userAction.INCREASE_WIN: {
            return {
                ...state,
                win: state.win + 1,
            }
        }
        case userAction.INCREASE_LOSE: {
            return {
                ...state,
                lose: state.lose + 1,
            }
        }
        default: {
            return state;
        }
    }
}

export default reducers;