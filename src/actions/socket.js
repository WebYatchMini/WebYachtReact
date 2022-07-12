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

export const subscribe = () => {
    return {
        type: SUBSCRIBE
    }
}

export const publish = (data) => {
    return {
        type: PUBLISH,
        data
    }
}