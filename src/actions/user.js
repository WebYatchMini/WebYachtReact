// Action types
export const SET_UID = 'user/SET_UID';
export const SET_NICKNAME = 'user/SET_NICKNAME';
export const SET_WIN = 'user/SET_WIN';
export const SET_LOSE = 'user/SET_LOSE';

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