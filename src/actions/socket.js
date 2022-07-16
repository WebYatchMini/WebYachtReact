// Action types
export const CONNECT = 'socket/CONNECT';
export const DISCONNECT = 'socket/DISCONNECT'
export const SUBSCRIBE = 'socket/SUBSCRIBE'
export const PUBLISH = 'socket/PUBLISH'

// Action creators
export const connect = () => {
    return {
        type: CONNECT
    }
};

export const disconnect = () => {
    return {
        type: DISCONNECT
    }
}

export const subscribe = (roomCode, sender, message) => {
    return {
        type: SUBSCRIBE,
        roomCode: roomCode,
        sender: sender,
        message: message
    }
}

export const publish = (roomCode, sender, message) => {
    return {
        type: PUBLISH,
        roomCode: roomCode,
        sender: sender,
        message: message
    }
}