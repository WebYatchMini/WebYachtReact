import { Component } from 'react'
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './Main.css'

import * as userAction from "../actions/user"
import * as socketAction from "../actions/socket"

function CreateRoomModal(props) {
    return (
        <Modal 
        {...props}
        size='lg'
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header>
                <h4>CREATE ROOM</h4>
            </Modal.Header>
            <Modal.Body>
                <form id="createForm">
                    <div className="input-group mb3">
                        <span className="input-group-text">TITLE</span>
                        <input type='text' className='form-control' name='CreateRoomTitle'
                        onChange={props.handleChange}
                        ></input>
                    </div>
                    <div className="input-group mb3">
                        <span className="input-group-text">PW</span>
                        {props.pwCheck ? <input type='text' className='form-control' name='CreateRoomPw' onChange={props.handleChange}></input> : <input disabled type='text' className='form-control' value=''></input>}
                        <div className="input-group-text">  
                            <input className="form-check-input" type="checkbox"
                            onClick={props.handlePwCheck}
                            ></input>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={props.onHide}>CLOSE</Button>
                <Button onClick={props.handleCreate}>CREATE</Button>
            </Modal.Footer>
        </Modal>
    );
}

function NonSelectedModal(props) {
    return( 
        <Modal 
        {...props}
        size='lg'
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header>
                <h6>선택된 방이 없습니다</h6>
            </Modal.Header>
            <Modal.Body>
                <div id='joinFaultMessage'>방을 다시 확인하고 시도해주세요</div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={props.onHide}>CLOSE</Button>
            </Modal.Footer>
        </Modal>
    );
}

function JoinPwdModal(props) {
    return (
        <Modal 
        {...props}
        size='lg'
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header>
                <h4>ENTER PASSWORD</h4>
            </Modal.Header>
            <Modal.Body>
                <form id="joinForm">
                    <div className="input-group mb3">
                        <span className="input-group-text">PW</span>
                        <input type='password' className='form-control' name='JoinRoomPwd' onChange={props.handleChange}></input>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={props.onHide}>CLOSE</Button>
                <Button onClick={props.handleJoinPwd}>JOIN</Button>
            </Modal.Footer>
        </Modal>
    );
}

class Main extends Component {
    state = {
        CreateRoomTitle: '',
        CreateRoomPw: '',
        CreateModalShow: false,
        CreatePwCheck: false,
        selectedRoomIdx: -1,
        nonSelectedModalShow: false,
        JoinRoomPwd: '',
        roomArray: []
    }

    constructor(props) {
        super(props);
        fetch('api/room/refresh')
        .then(res => res.json())
        .then(data => {
            this.state.roomArray = data;
        })
    }

    handlePwCheck = (prevState) => {
        this.setState({
            CreatePwCheck: !prevState.CreatePwCheck,
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    };
    handleRefresh = () => {
        fetch('api/room/refresh')
        .then(res => res.json())
        .then(data => {
            this.setState({
                roomArray: data
            })
        })
    }
    handleCreate = () => {
        const requstOption = {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                title: this.state.CreateRoomTitle,
                roomPwd : (this.state.CreatePwCheck ? this.state.CreateRoomPw : null)
            })
        }
        fetch('/api/room/make', requstOption)
        .then(res => res.json())
        // 성공시, 페이지 이동하게끔 코드 작성하기
    }
    handleJoin = () => {
        const idx = this.state.selectedRoomIdx;
        if (idx === -1) {
            this.setState({
                nonSelectedModalShow: true
            })
        }
        else {
            if (this.state.roomArray[idx].locked) {
                this.setState({
                    joinPwdModalShow: true
                })
            }
            else {
                const requstOption = {
                    method : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body : JSON.stringify({
                        roomCode : this.state.roomArray[this.state.selectedRoomIdx].roomCode,
                        roomPwd : null
                    })
                }
                fetch('api/room/join', requstOption)
                .then(res => res.json())
                .then(data => console.log(data))
                // 성공시 페이지 이동하게끔 코드 작성하기
            }
        }
    }
    handleJoinPwd = () => {
        const requstOption = {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                roomCode : this.state.roomArray[this.state.selectedRoomIdx].roomCode,
                roomPwd : this.state.JoinRoomPwd
            })
        }
        fetch('api/room/join', requstOption)
        .then(res => res.json())
        .then(data => console.log(data))
        // 성공시 페이지 이동하게끔 코드 작성하기
    }
    
    handleLogout = () => {
        fetch('/api/logout')
    }


    render() {
        const { storeUid, storeNickname, storeWin, storeLose, storeLogin, storeSocket, resetStore, connectStore } = this.props;
        let roomList = Array.from(this.state.roomArray).map((room, index) => (
            <div className={this.state.selectedRoomIdx === index ? `room selected` : `room`} onClick={() => {
                if (this.state.selectedRoomIdx !== index) {
                    this.setState({
                        selectedRoomIdx: index
                    });
                }
                else {
                    this.setState({
                        selectedRoomIdx: -1
                    })
                }
            }}>
                <div className='password'>{room.locked ? <i className="bi bi-lock-fill"></i> : <i className="bi bi-unlock-fill"></i>}</div>
                <div className='number'>{('000000' + (index + 1).toString()).slice(-6)}</div>
                <div className='title'>{room.title}</div>
                <div className='owner'>{room.organizerName}</div>
                <div className='people'>{room.curPlayerCount} / 2</div>
                <div className='state'>{room.started ? "게임중" : "대기중"}</div>
            </div>
        ));
        return(
            <div className='common'>
                {(() => {
                    if (!storeLogin) return <Navigate to='/login' replace={true}/>
                })()}
                <CreateRoomModal 
                show={this.state.CreateModalShow}
                pwCheck={this.state.CreatePwCheck}
                handlePwCheck={this.handlePwCheck}
                onHide={() => {
                    this.setState({
                        CreateModalShow: false,
                    })
                }}
                handleCreate={this.handleCreate}
                handleChange={this.handleChange}
                />
                <NonSelectedModal
                show={this.state.nonSelectedModalShow}
                onHide={() => {
                    this.setState({
                        nonSelectedModalShow: false,
                    })
                }}
                />
                <JoinPwdModal
                show={this.state.joinPwdModalShow}
                onHide={() => {
                    this.setState({
                        joinPwdModalShow: false,
                    })
                }}
                handleChange={this.handleChange}
                handleJoinPwd={this.handleJoinPwd}
                />
                <div className='container-fluid' id='lobbyContainer'>
                    <div className='test' id='lobby'>
                        <div className='roomIndex'>
                            <div className='password'><i className="bi bi-lock-fill"></i> / <i className="bi bi-unlock-fill"></i></div>
                            <div className='number'>Room No.</div>
                            <div className='title'>Title</div>
                            <div className='owner'>Owner</div>
                            <div className='people'>Player</div>
                            <div className='state'>State</div>
                        </div>
                        <div id='roomList'>
                            {roomList}
                            {/* <div className={this.state.selectedRoomIdx === 0 ? `room selected` : `room`} onClick={() => {
                                if (this.state.selectedRoomIdx !== 0) {
                                    this.setState({
                                        selectedRoomIdx: 0
                                    });
                                }
                                else {
                                    this.setState({
                                        selectedRoomIdx: -1
                                    })
                                }
                            }}>
                                <div className='password'><i className="bi bi-lock-fill"></i></div>
                                <div className='number'>000001</div>
                                <div className='title'>제목</div>
                                <div className='owner'>testid3</div>
                                <div className='people'>1 / 2</div>
                                <div className='state'>대기중</div>
                            </div> */}
                        </div>
                    </div>
                    <div className='test' id='myInfo'>
                        <div className='myInfoLogo'>MY INFO</div>
                        <div className='myInfoArea'>
                            <div>{storeNickname}({storeUid})</div>
                            <div>WIN: {storeWin}</div>
                            <div>LOSE: {storeLose}</div>
                        </div>
                    </div>
                    <div className='test' id='etc'>
                        <div className='sideLogo'>SIDE MENU</div>
                        <ul>
                            <li><button onClick={this.handleJoin}><i className="bi bi-door-open-fill"></i> ROOM JOIN</button></li>
                            <li><button onClick={this.handleRefresh}><i className="bi bi-arrow-clockwise"></i> LIST REFRESH</button></li>
                            <li><button onClick={() => {
                                this.setState({
                                    CreateModalShow: true,
                                })
                            }}
                            ><i className="bi bi-file-plus-fill"></i> CREATE ROOM</button></li>
                            <li><button onClick={() => {
                                this.handleLogout();
                                resetStore();
                                this.props.navigate('/login');
                                // window.location.href = '/login';
                            }}
                            ><i className="bi bi-box-arrow-right"></i> LOGOUT</button></li>
                            <li><button><i className="bi bi-question-circle-fill"></i> HELP</button></li>
                        </ul>
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
    storeSocket: state.socket.client
})

const mapDispatchToProps = (dispatch) => ({
    resetStore: () => dispatch(userAction.reset()),
    connectStore: () => dispatch(socketAction.connect())
})

export default function MainWithNavigate(props) {
    const navigate = useNavigate();
    const MainClass = connect(mapStateToProps, mapDispatchToProps)(Main)
    return <MainClass navigate={navigate}/>
}
// export default connect(mapStateToProps, mapDispatchToProps)(Main)

/*
방 생성 /api/room/make  => post
=> 방제목, 비밀방여부 => 비밀방이면 pw입력까지 하게 하는 form 을 modal창으로 띄우게 하기.

새로고침 /api/room/refresh =>
방 제거 /api/room/remove => 아직 모름
방 나가기 /room/exit이랑 roomCode
*/

// TODO : 방 입장 구현 + 소켓 생성

/* 방 정보 필드값
    private final String roomCode;
    private final String title;
    private final boolean isLocked;     => locked로 옴
    private final String organizerName;
    private final boolean isStarted;    => started로 옴
    private final int curPlayerCount;
*/

/* 시험용 데이터
{
            roomCode: "123456",
            title: "test1",
            organizerName: "test1",
            curPlayerCount: 1,
            locked: true,
            started: false,
        }, {
            roomCode: "234567",
            title: "test2",
            organizerName: "test2",
            curPlayerCount: 1,
            locked: true,
            started: false,
        }, {
            roomCode: "234567",
            title: "test3",
            organizerName: "test3",
            curPlayerCount: 1,
            locked: false,
            started: false,
        }
*/