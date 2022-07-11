import { Component } from 'react'
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './Room.css'

import * as userAction from "../actions/user"

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
                <Button onClick={props.handleCreate}>EXIT</Button>
            </Modal.Footer>
        </Modal>
    );
}

class Room extends Component {
    state = {
        roomTitle: '',
        roomPw: '',
        modalShow: false,
        pwCheck: false,
        roomArray: []
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    };


    render() {
        const { storeUid, storeNickname, storeWin, storeLose, storeLogin } = this.props;
        return(
            <div className='common'>
                {(() => {
                    if (!storeLogin) return <Navigate to='/login' replace={true}/>
                })()}
                <ExitModal 
                show={this.state.modalShow}
                pwCheck={this.state.pwCheck}
                handlePwCheck={this.handlePwCheck}
                onHide={() => {
                    this.setState({
                        modalShow: false,
                    })
                }}
                handleCreate={this.handleCreate}
                handleChange={this.handleChange}
                />
                <div className='container-fluid' id='roomContainer'>
                    <div className='test' id='header'>
                        TITLE
                    </div>
                    <div className='test' id='user-1'>
                        <div className='userInfo'>
                            <div>NickName</div>
                            <div>WIN</div>
                            <div>LOSE</div>
                        </div>
                    </div>
                    <div className='test' id='user-2'>
                        <div className='userInfo'>
                            <div>NickName</div>
                            <div>WIN</div>
                            <div>LOSE</div>
                        </div>
                    </div>
                    <div className='test' id='menu'>
                        <div>
                            <button></button>
                            <button></button>
                        </div>
                    </div>
                    <div className='test' id='chat'>
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

export default function RoomWithNavigate(props) {
    const navigate = useNavigate();
    const MainClass = connect(mapStateToProps, mapDispatchToProps)(Room)
    return <MainClass navigate={navigate}/>
}
// export default connect(mapStateToProps, mapDispatchToProps)(Main)

// TODO : 방장 닉네임도 방 목록에서 보이게 추가 (현재 플레이어 왼쪽에)