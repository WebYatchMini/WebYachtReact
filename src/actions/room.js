// Action types
export const SET_ROOMCODE = 'room/SET_ROOMCODE';
export const SET_ROOMTITLE = 'room/SET_ROOMTITLE';
export const RESET = 'room/RESET'

// Action creators
export const setRoomCode = (roomCode) => {
  return {
    type: SET_ROOMCODE,
    roomCode: roomCode
  }
};

export const setRoomTitle = (roomTitle) => {
  return {
    type: SET_ROOMTITLE,
    roomTitle: roomTitle
  }
};

export const reset = () => {
  return {
    type: RESET
  }
}