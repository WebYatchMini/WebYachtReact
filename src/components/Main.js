import { Component } from 'react'
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './Main.css'

import * as userAction from "../actions/user"

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
                        <input type='text' className='form-control' name='roomTitle'
                        onChange={props.handleChange}
                        ></input>
                    </div>
                    <div className="input-group mb3">
                        <span className="input-group-text">PW</span>
                        {props.pwCheck ? <input type='text' className='form-control' name='roomPw' onChange={props.handleChange}></input> : <input disabled type='text' className='form-control' value=''></input>}
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

class Main extends Component {
    state = {
        roomTitle: '',
        roomPw: '',
        modalShow: false,
        pwCheck: false,
        roomArray: []
    }

    constructor(props) {
        super(props);
        this.handleRefresh();
    }

    handlePwCheck = () => {
        this.setState({
            ...this.state,
            pwCheck: !this.state.pwCheck,
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
            console.log(data)
            this.setState({
                ...this.state,
                roomArray: data
            })
        })
    }
    handleCreate = () => {
        const requstOption = {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                title: this.state.roomTitle,
                pw : (this.state.pwCheck ? this.state.roomPw : null)
            })
        }
        fetch('/api/room/make', requstOption)
        .then(res => res.json())
        .then(() => {
            window.location.href = '/'
        })
    }
    handleLogout = () => {
        fetch('/api/logout')
    }



    render() {
        const { storeUid, storeNickname, storeWin, storeLose, storeLogin, resetStore } = this.props;
        let roomidx = 0;
        let roomList = Array.from(this.state.roomArray).map(room => (
            <div className='room'>
                <div className='password'>{room.locked ? <i className="bi bi-lock-fill"></i> : <i className="bi bi-unlock-fill"></i>}</div>
                <div className='number'>{('000000' + (roomidx = roomidx + 1).toString()).slice(-6)}</div>
                <div className='title'>{room.title}</div>
                <div className='owner'>{room.organizerName}</div>
                <div className='people'>{room.curPlayerCount} / 2</div>
                <div className='state'>{room.isStarted ? "게임중" : "대기중"}</div>
            </div>
        ));
        return(
            <div className='common'>
                {(() => {
                    if (!storeLogin) return <Navigate to='/login' replace={true}/>
                })()}
                <CreateRoomModal 
                show={this.state.modalShow}
                pwCheck={this.state.pwCheck}
                handlePwCheck={this.handlePwCheck}
                onHide={() => {
                    this.setState({
                        ...this.state,
                        modalShow: false,
                    })
                }}
                handleCreate={this.handleCreate}
                handleChange={this.handleChange}
                />
                <div className='container-fluid' id='container'>
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
                            {/* <div className='room'>
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
                            <li><button><i className="bi bi-door-open-fill"></i> ROOM JOIN</button></li>
                            <li><button><i className="bi bi-arrow-clockwise"></i> LIST REFRESH</button></li>
                            <li><button onClick={() => {
                                this.setState({
                                    ...this.state,
                                    modalShow: true,
                                })
                            }}
                            ><i className="bi bi-file-plus-fill"></i> CREATE ROOM</button></li>
                            <li><button onClick={() => {
                                this.handleLogout();
                                resetStore();
                                window.location.href = '/login';
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
    storeLogin: state.user.login
})

const mapDispatchToProps = (dispatch) => ({
    resetStore: () => dispatch(userAction.reset())
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)

/*
방 생성 /api/room/make  => post
=> 방제목, 비밀방여부 => 비밀방이면 pw입력까지 하게 하는 form 을 modal창으로 띄우게 하기.

새로고침 /api/room/refresh =>
방 제거 /api/room/remove => 아직 모름
*/

// TODO : 방장 닉네임도 방 목록에서 보이게 추가 (현재 플레이어 왼쪽에)