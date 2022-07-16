import { Component, createRef } from 'react'
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom'
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
function TestModal(props) {
    return (
        <Modal 
        {...props}
        size='lg'
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Body>
                <div>
                </div>
            </Modal.Body>
        </Modal>
    );
}


class Room extends Component {
    state = {
        ExitmodalShow: false,
        TestModalShow: false,
        game: false,
        chatList: [{
            type: 1,
            message: "opponent test"
        },
        {
            type: 1,
            message: "opponent test"
        },
        {
            type: 0,
            message: "my chat test"
        },
        {
            type: 1,
            message: "long message test long message test long message test long message test long message test"
        },
        {
            type: 0,
            message: "my chat test"
        },
        {
            type: 0,
            message: "my chat test"
        },],
        opponentInfo: {
            nickname: '-',
            win: '-',
            lose: '-'
        },
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
            },
            onStompError: (frame) => {
                console.log(frame);
            }
        });
    }
    chatSubscribe = () => {
        this.client.current.subscribe(`/sub/chat/room/${this.props.storeRoomCode}`, (body) => {
            const chat = {
                type: 1,
                message: body
            }
            this.appendChatList(chat);
        });
    }
    chatPublish = (m) => {
        if (!this.client.current.connected) {
            console.log("소켓 연결 X")
            return;
        }

        this.client.current.publish({
            destination: "pub/chat/",
            body: JSON.stringify({
                roomCode: this.props.storeRoomCode,
                sender: this.props.storeNickname,
                message: m
            })
        })
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
        // this.chatPublish(message);
        const chat = {
            type: 0,
            message: message
        }
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
    render() {
        const { storeUid, storeNickname, storeWin, storeLose, storeLogin, storeRoomTitle } = this.props;
        let chatList = Array.from(this.state.chatList).map((chat) => (
            <div className={chat.type === 0 ? "chatBox mine" : "chatBox opponent"}>
                <div className={chat.type === 0 ? "chat mine" : "chat opponent"}>{chat.message}</div>
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
                <TestModal
                backdrop="static"
                keyboard={false}
                animation={false}
                fullscreen={true}
                show={this.state.TestmodalShow}
                onHide={() => {
                    this.setState({
                        TestmodalShow: false,
                    })
                }}
                />
                <div className='container-fluid' id='roomContainer'>
                    <div className='test' id='header'>
                        {storeRoomTitle}
                    </div>
                    <div className='test' id='user-1'>
                        <div className='userInfo'>
                            <div>{storeNickname}</div>
                            <div>{storeWin}</div>
                            <div>{storeLose}</div>
                        </div>
                    </div>
                    <div className='test' id='user-2'>
                        <div className='userInfo'>
                            <div>{this.state.opponentInfo.nickname}</div>
                            <div>{this.state.opponentInfo.win}</div>
                            <div>{this.state.opponentInfo.lose}</div>
                        </div>
                    </div>
                    <div className='test' id='menu'>
                        <div>
                            <button onClick={() => {
                                this.setState({
                                    ExitmodalShow: true
                                })
                            }}
                            >ExitModal</button>
                            <button onClick={() => {
                                this.setState({
                                    TestmodalShow: true
                                })
                            }}>TestModal</button>
                        </div>
                    </div>
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
    storeRoomTitle: state.room.roomTitle
})

const mapDispatchToProps = (dispatch) => ({
    resetStore: () => dispatch(userAction.reset()),
})

export default function RoomWithNavigate(props) {
    const navigate = useNavigate();
    const MainClass = connect(mapStateToProps, mapDispatchToProps)(Room)
    return <MainClass navigate={navigate}/>
}

// TODO : 채팅창 디자인 / 채팅창 구현
// socket 연결을 redux에 저장말고 여기서 하게끔 수정할 것.