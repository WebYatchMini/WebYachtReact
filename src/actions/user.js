// Action types
export const SET_UID = 'user/SET_UID';
export const SET_NICKNAME = 'user/SET_NICKNAME';
export const SET_MMR = 'user/SET_MMR';
export const SET_WIN = 'user/SET_WIN';
export const SET_LOSE = 'user/SET_LOSE';
export const SET_LOGIN_TRUE = 'user/SET_LOGIN_TRUE'
export const SET_LOGIN_FALSE = 'user/SET_LOGIN_FALSE'

export const INCREASE_WIN = 'user/UP_WIN';
export const INCREASE_LOSE = 'user/UP_LOSE';

// Action creators
export const setUid = (id) => {
  return {
    type: SET_UID,
    id: id
  }
};

export const setNickname = (nickname) => {
  return {
    type: SET_NICKNAME,
    nickname: nickname
  }
};

export const setMmr = (mmr) => {
  return {
    type: SET_MMR,
    mmr: mmr
  }
};

export const setWin = (win) => {
  return {
    type: SET_WIN,
    win: win
  }
};

export const setLose = (lose) => {
    return {
      type: SET_LOSE,
      lose: lose
    }
  };
  
export const setLoginTrue = () => {
  return {
    type: SET_LOGIN_TRUE
  }
}

export const setLoginFalse = () => {
  return {
    type: SET_LOGIN_FALSE
  }
}

export const increaseWin = () => {
    return {
      type: INCREASE_WIN,
    }
  };

export const increaseLose = () => {
    return {
      type: INCREASE_LOSE,
    }
  };