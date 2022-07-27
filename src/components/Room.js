import { Component, useState, useRef, useEffect, createRef } from 'react'
import { connect } from 'react-redux';
import { Navigate, useNavigate, Route, Routes } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './Room.css'

import * as userAction from "../actions/user"
import * as roomAction from "../actions/room"

import * as StompJs from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

function ExitModal(props) {
    return (
        <Modal 
        {...props}
        size='lg'
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header>
                <h4>ExitModal ROOM</h4>
            </Modal.Header>
            <Modal.Body>
                <div>
                    방에서 나가시겠습니까?
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={props.onHide}>BACK</Button>
                <Button onClick={props.handleExit}>EXIT</Button>
            </Modal.Footer>
        </Modal>
    );
}
function ReadyArea(props) {
    return (
        <div className='content' id='readyArea'>
            <div className='test' id='header'>
                {props.storeRoomTitle}
            </div>
            <div className='test' id='user-1'>
                <div className='userInfo'>
                    <div className='HostMark'>{props.storeIsRoomOwner === 1 ? <i class="bi bi-star-fill"></i> : ""}</div>
                    <div>{props.storeNickname}</div>
                    <div>WIN: {props.storeWin}</div>
                    <div>LOSE: {props.storeLose}</div>
                    {props.storeIsRoomOwner === 1 ? ( props.opponentState ? <button onClick={props.handleStart}> START </button> : <button disabled='true'> START </button>) : (<button onClick={props.handleReady}> READY </button>)}
                </div>
            </div>
            <div className='test' id='user-2'>
                <div className='userInfo'>
                    <div className='HostMark'>{props.storeIsRoomOwner === 0 ? <i class="bi bi-star-fill"></i> : ""}</div>
                    <div>{props.opponentInfo.nickname}</div>
                    <div>WIN: {props.opponentInfo.win}</div>
                    <div>LOSE: {props.opponentInfo.lose}</div>
                    {props.storeIsRoomOwner === 1 ? ( props.opponentState ? <div className='ready'> READY </div> : <div className='notReady'> READY </div>) : <div> HOST </div>}
                </div>
            </div>
            <div className='test' id='menu'>
                <div>
                    <button onClick={props.handleExitRoom}>ROOM EXIT</button>
                </div>
            </div>
        </div>
    );
}

function GameArea(props) {
    // const client = 
    // useEffect(() => {
    //     client.publish()
    //     // 초기 입장 신호 보내기
    //     // game용 채널 subscribe 하기
    // },[])
    return (
        <div className='content test' id='gameArea'>
        </div>
    );
}

function ChatArea(props) {
    const client = props.client;
    const chatPublish = (msg) => {
        if (!client.connected) {
            console.log("소켓 연결 X")
            return;
        }

        client.publish({
            destination: "/pub/chat/message",
            body: JSON.stringify({
                roomCode: props.storeRoomCode,
                sender: props.storeIsRoomOwner,
                message: msg
            })
        })
    }

    const pressEnter = (e) => {
        if (e.key === 'Enter' && e.target.value.length !== 0) {
            sendMessage(e.target.value);
            e.target.value = '';
        }
    }

    const sendMessage = (message) => {
        chatPublish(message)
    }

    const chattingList = Array.from(props.chatList).map((chat) => (
        <div className={chat.sender === 0 ? "chatBox mine" : "chatBox opponent"}>
            <div className={chat.sender === 0 ? "chat mine" : "chat opponent"}>{chat.message}</div>
        </div>
        //0 -> 내가 보낸 메세지 / 1 -> 상대가 보낸 메세지
    ));

    return (
        <div className='test' id='chat'>
            <div id='chatList'>{chattingList}</div>
            <div id='chatForm'>
                <input className='form-control' name='chatMessage' onKeyPress={pressEnter}></input>
            </div>
        </div>
    )
}

function Room(props) {
    const { storeUid, storeNickname, storeWin, storeLose, storeLogin, storeRoomTitle, storeRoomCode, storeIsRoomOwner, setRoomOwnerOnStore, setRoomOwnerOffStore, roomResetStore } = props;
    const [ExitModalShow, setExitModalShow] = useState(false);
    const [chatList, setChatList] = useState([]);    
    const [opponentState, setOpponentState] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [opponentInfo, setOpponentInfo] = useState({
        nickname: '-',
        win: '-',
        lose: '-'
    });
    const [game, setGame] = useState(false);

    const client = useRef({});
    useEffect(() => {
        socketConnect();
        return () => socketDisconnect()
    },[]);

    const socketConnect = () => {
        client.current = new StompJs.Client({
            // brokerURL: '/api/ws', => 웹소켓 서버로 직접 접속
            webSocketFactory: () => new SockJS("stomp/connection"),    // proxy를 통한 접속
            connectHeaders: {
            },
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000, //자동 재 연결
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                chatSubscribe();
                infoSubscribe();
                client.current.publish({
                    destination: "/pub/pregame/room/enter",
                    body: JSON.stringify({
                        roomCode: storeRoomCode,
                        sender: storeIsRoomOwner,
                        message: "enter"
                    })
                })
            },
            onStompError: (frame) => {
                console.log(frame);
            }
        });
        client.current.activate();
    }
    const socketDisconnect = () => {
        if (client.current.connected) client.current.deactivate();
    }
    const handleExit = () => {
        const requstOption = {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                uid: storeUid,
                roomCode : storeRoomCode,
            })
        }
        fetch('/api/room/exit', requstOption)
        roomResetStore();
        props.navigate('/main');
    }

    const handleExitRoom = () => {
        setExitModalShow(true)
    }
    const handleStart = () => {
        setGame(true)
        // 상대에게 시작알림 보내기
        // 마찬가지로 수신하는 함수 필요
    }

    const appendChatList = (data) => {
        const chat = {
            sender: data.sender === storeIsRoomOwner ? 0 : 1,
            message: data.message
        }
        setChatList((prev) => [...prev, chat])
    }
    useEffect(() => {
        let chatList = document.getElementById("chatList");
        chatList.scrollTop = chatList.scrollHeight;
    }, [chatList])

    const chatSubscribe = () => {
        client.current.subscribe(`/sub/chat/room/${storeRoomCode}`, (data) => {
            data = JSON.parse(data.body);
            appendChatList(data);
        });
    };

    const infoSubscribe = () => {
        client.current.subscribe(`/sub/pregame/room/${storeRoomCode}`, (data) => {
            data = JSON.parse(data.body);
            switch (data.type) {
                case 0:
                    /*
                        type: 0,
                        userProfileData: [ userInfoArray... ]
                        유저 정보 교환 데이터
                    */
                    let arr = Array.from(data.userProfileData)
                    if (arr.length === 2) {
                        arr.forEach((user) => {
                            if (user.uid !== storeUid) setOpponentInfo({
                                nickname: user.nickname,
                                win: user.win,
                                lose: user.lose
                            })
                        })
                    }
                    else if (arr.length === 1) {
                        if (storeIsRoomOwner === 0) setRoomOwnerOnStore();
                        setOpponentInfo({
                            nickname: '-',
                            win: '-',
                            lose: '-'
                        })
                    }
                    break;
                case 1:
                    /*
                        type: 1,
                        ready: true/false
                        준비 상태 교환 데이터
                     */
                    if (storeIsRoomOwner) setOpponentState(data.ready);
                    break;
                default:
                    console.log("unknown type")
                    break;
            }
        })
    }
    const handleReady = () => {
        if (isReady) setIsReady(false);
        else setIsReady(true);
    }
    useEffect(() => {
        if (client.current != null) {
            client.current.publish({
                destination: "/pub/pregame/room/readyState",
                body: JSON.stringify({
                    roomCode: storeRoomCode,
                    sender: storeIsRoomOwner,
                    ready: isReady
                })
            })
        }
    }, [isReady]);
    // 콜백함수 바꿔볼것, useEffect 등록 당시에는 client가 안만들어져 있는건지, publish가 undefined라

    return(
        <div className='common'>
            {(() => {
                if (!storeLogin) return <Navigate to='/login' replace={true}/>
                if (!storeRoomCode === '-') return <Navigate to='/main' replace={true}/>
            })()}
            <ExitModal 
            show={ExitModalShow}
            onHide={() => {
                setExitModalShow(false);
            }}
            handleExit={handleExit}
            />
            <div className='container-fluid' id='roomContainer'>
                {game ? 
                <GameArea/>
                :
                <ReadyArea
                storeUid={storeUid}
                storeNickname={storeNickname}
                storeWin={storeWin}
                storeLose={storeLose}
                storeRoomCode={storeRoomCode}
                storeRoomTitle={storeRoomTitle}
                storeIsRoomOwner={storeIsRoomOwner}
                setRoomOwnerOnStore={setRoomOwnerOnStore}
                setRoomOwnerOffStore={setRoomOwnerOffStore}
                opponentState={opponentState}
                opponentInfo={opponentInfo}
                isReady={isReady}
                handleReady={handleReady}
                handleExitRoom={handleExitRoom}
                handleStart={handleStart}
                client={client.current}
                />}
                <ChatArea
                client={client.current}
                chatList={chatList}
                storeRoomCode={storeRoomCode}
                storeIsRoomOwner={storeIsRoomOwner}
                />    
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    storeUid: state.user.id,
    storeNickname: state.user.nickname,
    storeMMR: state.user.mmr,
    storeWin: state.user.win,
    storeLose: state.user.lose,
    storeLogin: state.user.login,
    storeIsRoomOwner: state.user.isRoomOwner,
    storeRoomCode: state.room.roomCode,
    storeRoomTitle: state.room.roomTitle,
})

const mapDispatchToProps = (dispatch) => ({
    resetStore: () => dispatch(userAction.reset()),
    setRoomOwnerOnStore : () => dispatch(userAction.setRoomOwnerOn()),
    setRoomOwnerOffStore : () => dispatch(userAction.setRoomOwnerOff()),
    roomResetStore: () => dispatch(roomAction.reset())
})

export default function RoomWithNavigate(props) {
    const navigate = useNavigate();
    const MainClass = connect(mapStateToProps, mapDispatchToProps)(Room)

    return <MainClass navigate={navigate}/>
}

// TODO : 채팅창 디자인 / 채팅창 구현
// socket 연결을 redux에 저장말고 여기서 하게끔 수정할 것
// 방 입장 => 방장이면 생성하자마자 입장,
// 방장이 아닌 사람이면 입장시, 자신의 정보를 상대방에게 보내고, 이를 받은 상대방이 마찬가지로 정보를 보내오는 것으로 업데이트

/*
        {
            sender: 1,
            message: "opponent test"
        },
        {
            sender: 1,
            message: "opponent test"
        },
        {
            sender: 0,
            message: "my chat test"
        },
        {
            sender: 1,
            message: "long message test long message test long message test long message test long message test"
        },
        {
            sender: 0,
            message: "my chat test"
        },
        {
            sender: 0,
            message: "my chat test"
        },
    채팅 테스트 데이터
*/