import * as socketAction from '../actions/socket';
import * as StompJs from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

const initStates = {
    client: null,
}

const reducers = (state = initStates, action) => {
    switch (action.type) {
        case socketAction.CONNECT: {
            const tempClient =  new StompJs.Client({
                // brokerURL: '/api/ws', => 웹소켓 서버로 직접 접속
                webSocketFactory: () => new SockJS("stomp/chat"),    // proxy를 통한 접속
                connectHeaders: {
                },
                debug: (str) => {
                    console.log(str);
                },
                reconnectDelay: 5000, //자동 재 연결
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log("connected")
                    console.log(state.client)
                },
                onStompError: () => {

                }
            });
            tempClient.activate();
            return {
                ...state,
                client: tempClient
            }
        }
        case socketAction.DISCONNECT: {
            const tempClient = state.client;
            tempClient.deactivate();
            return {
                ...state,
                client: null
            }
        }
        case socketAction.SUBSCRIBE: {
            const body = JSON.stringify({
                roomCode: action.roomCode,
                sender: action.sender,
                message: action.message
            })
            const tempClient = state.client;
            tempClient.current.subscribe('/sub/chat/enter/', body);
            return {
                ...state
            }
        }
        case socketAction.PUBLISH: {
            const body = JSON.stringify({
                roomCode: action.roomCode,
                sender: action.sender,
                message: action.message
            })
            const tempClient = state.client;
            tempClient.send('/pub/chat/message', body);
            return {
                ...state
            }
        }
        default: {
            return state;
        }
    }
}

export default reducers;