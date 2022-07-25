import { Component, createRef } from 'react'
import { connect } from 'react-redux';
import { Navigate, useNavigate, Route, Routes } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './Room.css'

import * as userAction from "../actions/user"

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
                    <div className='HostMark'>{props.storeIsRoomOwner ? <i class="bi bi-star-fill"></i> : ""}</div>
                    <div>{props.storeNickname}</div>
                    <div>{props.storeWin}</div>
                    <div>{props.storeLose}</div>
                </div>
            </div>
            <div className='test' id='user-2'>
                <div className='userInfo'>
                    <div className='HostMark'>{!props.storeIsRoomOwner ? <i class="bi bi-star-fill"></i> : ""}</div>
                    <div>{props.opponentInfo.nickname}</div>
                    <div>{props.opponentInfo.win}</div>
                    <div>{props.opponentInfo.lose}</div>
                </div>
            </div>
            <div className='test' id='menu'>
                <div>
                    <button onClick={props.handleExitRoom}>ExitModal</button>
                    <button onClick={props.handleGameArea}>TestModal</button>
                </div>
            </div>
        </div>
    );
}

function GameArea(props) {
    return (
        <div className='content test' id='gameArea'>
        </div>
    );
}

class Room extends Component {
    state = {
        ExitmodalShow: false,
        TestModalShow: false,
        game: false,
        chatList: [],
        opponentInfo: {
            nickname: '-',
            win: '-',
            lose: '-'
        }
    }

    componentDidMount() {
        this.chatConnect();
        return () => this.chatDisconnect();
    }
    componentDidUpdate() {
        this.chatConnect();
        return () => this.chatDisconnect();
    }
    client = createRef();

    chatDisconnect = () => {
        this.client.current.deactivate();
    }
    chatConnect = () => {
        this.client.current = new StompJs.Client({
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
                this.chatSubscribe();
                // 같은 방에 있는 사용자들의 정보를 먼저 보내고 받기
                // 방 입장시 보내는 정보이므로, type: 1로 해서 보낼 것.
            },
            onStompError: (frame) => {
                console.log(frame);
            }
        });
        this.client.current.activate();
    }
    chatSubscribe = () => {
        this.client.current.subscribe(`/sub/chat/room/${this.props.storeRoomCode}`, (body) => {
            body = JSON.parse(body);
            this.appendChatList(body)
        });
    }
    chatPublish = (m) => {
        if (!this.client.current.connected) {
            console.log("소켓 연결 X")
            return;
        }

        this.client.current.publish({
            destination: "pub/chat/message",
            body: JSON.stringify({
                roomCode: this.props.storeRoomCode,
                sender: 0,
                message: m
            })
        }) // 상대방이 내 데이터를 받게 되므로 sender를 1로 지정
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    };

    handleExit = () => {
        this.props.navigate('/main');
    }


    pressEnter = (e) => {
        if (e.key === 'Enter' && e.target.value.length !== 0) {
            this.sendMessage(e.target.value);
            e.target.value = '';
        }
    }
    sendMessage = (message) => {
        this.chatPublish(message);
        const chat = {
            sender: 0,
            message: message
        } // 내 채팅 데이터 이므로 sender를 0으로 지정
        this.appendChatList(chat);
    }
    appendChatList = (chat) => {
        this.setState({
            chatList : [...this.state.chatList, chat]
        }, () => {
            let chatList = document.getElementById("chatList")
            chatList.scrollTop = chatList.scrollHeight;
        })
    }

    handleExitRoom = () => {
        this.setState({
            ExitmodalShow: true
        })
    }
    handleGameArea = () => {
        this.props.navigate('/room/game')
    }
    render() {
        const { storeUid, storeNickname, storeWin, storeLose, storeLogin, storeRoomTitle, storeIsRoomOwner, setRoomOwnerOffStore } = this.props;
        let chatList = Array.from(this.state.chatList).map((chat) => (
            <div className={chat.sender === 0 ? "chatBox mine" : "chatBox opponent"}>
                <div className={chat.sender === 0 ? "chat mine" : "chat opponent"}>{chat.message}</div>
            </div>
        ));
        return(
            <div className='common'>
                {(() => {
                    if (!storeLogin) return <Navigate to='/login' replace={true}/>
                })()}
                <ExitModal 
                show={this.state.ExitmodalShow}
                onHide={() => {
                    this.setState({
                        ExitmodalShow: false,
                    })
                }}
                handleExit={this.handleExit}
                />
                <div className='container-fluid' id='roomContainer'>
                    {/* 방장이 게임 시작 -> 게임 모드로 들어가야 하는데 어떻게 해야할지 모르겠음 */}
                    {/* 일단 하나 확실한건 Route로는 아무래도 좋은 방법은 아닌거 같음.*/}
                    {/* Route 말고 이전에 했던 SPA 방식중에서 탭으로 이동해서 보이게 하는 방식이 적절해보임*/}
                    <Routes>
                        <Route exact path='/' 
                        element={<ReadyArea
                            storeNickname={storeNickname}
                            storeWin={storeWin}
                            storeLose={storeLose}
                            storeRoomTitle={storeRoomTitle}
                            storeIsRoomOwner={storeIsRoomOwner}
                            opponentInfo={this.state.opponentInfo}
                            handleExitRoom={this.handleExitRoom}
                            handleGameArea={this.handleGameArea}
                            />}
                        />
                        <Route path='/game'
                        element={<GameArea/>}
                        />
                    </Routes>
                    <div className='test' id='chat'>
                        <div id='chatList'>{chatList}</div>
                        <div id='chatForm'>
                            <input className='form-control' name='chatMessage' onKeyPress={this.pressEnter}></input>
                        </div>
                    </div>    
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    storeUid: state.user.id,
    storeNickname: state.user.nickname,
    storeMMR: state.user.mmr,
    storeWin: state.user.win,
    storeLose: state.user.lose,
    storeLogin: state.user.login,
    storeRoomCode: state.room.roomCode,
    storeRoomTitle: state.room.roomTitle,
    storeIsRoomOwner: state.user.isRoomOwner
})

const mapDispatchToProps = (dispatch) => ({
    resetStore: () => dispatch(userAction.reset()),
    setRoomOwnerOffStore : () => dispatch(userAction.setRoomOwnerOff())
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