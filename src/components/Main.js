import { Component } from 'react'
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom'
import './Main.css'

import * as userAction from "../actions/user"

class Main extends Component {

    handleLogout = () => {
        fetch('/api/logout')
    }

    render() {
        const { storeUid, storeNickname, storeWin, storeLose, storeLogin, resetStore } = this.props
        return(
            <div className='common'>
                {(() => {
                    if (!storeLogin) return <Navigate to='/login' replace={true}/>
                })()}
                <div className='container-fluid' id='container'>
                    <div className='test' id='lobby'>
                        <div className='roomIndex'>
                            <div className='password'><i class="fa fa-lock" aria-hidden="true"></i> / <i class="fa fa-unlock" aria-hidden="true"></i></div>
                            <div className='number'>Room No.</div>
                            <div className='title'>Title</div>
                            <div className='people'>Player</div>
                            <div className='state'>State</div>
                        </div>
                        <div id='roomList'>
                            <div className='room'>
                                <div className='password'><i class="fa fa-lock" aria-hidden="true"></i></div>
                                <div className='number'>000001</div>
                                <div className='title'>제목</div>
                                <div className='people'>1/2</div>
                                <div className='state'>대기중</div>
                            </div>
                        </div>
                    </div>
                    <div className='test' id='myInfo'>
                        <div className='myInfoLogo'>MY INFO</div>
                        <div className='myInfoArea'>
                            
                        </div>
                    </div>
                    <div className='test' id='etc'>
                        <div className='sideLogo'>SIDE MENU</div>
                        <ul>
                            <li><button>ROOM JOIN</button></li>
                            <li><button>LIST REFRESH</button></li>
                            <li><button>CREATE ROOM</button></li>
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
방 생성 /api/room/make
새로고침 /api/room/refresh
방 제거 /api/room/remove
*/