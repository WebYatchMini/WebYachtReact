import * as userAction from '../actions/user';

const initStates = {
    id: 'initID',
    nickname: 'initNICKNAME',
    mmr: 0,
    win: 0,
    lose: 0,
    login: false,
    isRoomOwner: 0
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
        case userAction.SET_MMR: {
            return {
                ...state,
                mmr: action.mmr
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
        case userAction.SET_LOGIN_TRUE: {
            return {
                ...state,
                login: true
            }
        }
        case userAction.SET_LOGIN_FALSE: {
            return {
                ...state,
                login: false
            }
        }
        case userAction.SET_ROOM_OWNER_ON: {
            return {
                ...state,
                isRoomOwner: 1
            }
        }
        case userAction.SET_ROOM_OWNER_OFF: {
            return {
                ...state,
                isRoomOwner: 0
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
        case userAction.RESET: {
            return initStates;
        }
        default: {
            return state;
        }
    }
}

export default reducers;    