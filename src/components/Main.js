import { Component } from 'react'
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom'

import * as userAction from "../actions/user"

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.storeUid,
            nickname: props.storeNickname,
            mmr: props.storeMMR,
            win: props.storeWin,
            lose: props.storeLose,
            login: props.storeLogin
        }
    }

    pressEnter = (e) => {
        if (e.key === 'Enter') {
          this.setState({
            [e.target.name]: e.target.value,
          })
        }
      }

    setUid = (uid) => {
        this.setState(() => {
            return {
                ...this.state,
                id: uid
            } 
        })
    }

    setNickname = (nickname) => {
        this.setState(() => {
            return {
                ...this.state,
                nickname: nickname
            }
        })
    }

    setWin = (win) => {
        this.setState(() => {
            return {
                ...this.state,
                win: win
            }
        })
    }

    setLose = (lose) => {
        this.setState(() => {
            return {
                ...this.state,
                lose: lose
            }
        })
    }

    setLoginTrue = () => {
        this.setState(() => {
            return {
                ...this.state,
                login: true
            }
        })
    }

    setLoginFalse = () => {
        this.setState(() => {
            return {
                ...this.state,
                login: false
            }
        })
    }

    increaseWin = () => {
        this.setState((prevState) => {
            return {
                ...this.state,
                win: prevState.win + 1
            }
        })
    }

    increaseLose = () => {
        this.setState((prevState) => {
            return {
                ...this.state,
                lose: prevState.lose + 1
            }
        })
    }

    handleLogout = () => {
        fetch('/api/logout')
    }

    render() {
        const { storeUid, storeNickname, storeWin, storeLose, storeLogin, setStoreUid, setStoreNickname, setStoreLoginTrue, setStoreLoginFalse, increaseStoreWin, increaseStroeLose, resetStore } = this.props
        return(
            <div className='common'>
                {(() => {
                    if (!this.state.login) return <Navigate to='/login' replace={true}/>
                })()}
                <div>
                    <div>uid: {this.state.id} / stored uid: {`${storeUid}`}</div>
                    <div>nickname: {this.state.nickname} / stored nickname: {`${storeNickname}`}</div>
                    <div>win: {this.state.win} / stored win: {`${storeWin}`}</div>
                    <div>lose: {this.state.lose} / stored lose: {`${storeLose}`}</div>
                    <div>login: {this.state.login ? 1 : 0} / stored login: {`${storeLogin}`}</div>
                </div>
                <div>
                    <div>
                        <input
                        placeholder='setUid'
                        name='id'
                        onKeyPress={
                            (e) => {
                                this.pressEnter(e);
                                if (e.key === 'Enter') setStoreUid(e.target.value);
                            }
                        }
                        ></input>
                    </div>
                    <div>
                        <input
                        placeholder='setNickname'
                        name='nickname'
                        onKeyPress={
                            (e) => {
                                this.pressEnter(e);
                                if (e.key === 'Enter') setStoreNickname(e.target.value);
                            }
                        }
                        ></input>
                    </div>
                    <div onClick={() => {
                        this.increaseWin();
                        increaseStoreWin();
                    }}>win +</div>
                    <div onClick={() => {
                        this.increaseLose();
                        increaseStroeLose();
                    }}
                    >lose +</div>
                    <div onClick={() => {
                        this.setLoginTrue();
                        setStoreLoginTrue();
                    }}
                    >make login true</div>
                    <div onClick={() => {
                        this.setLoginFalse();
                        setStoreLoginFalse();
                    }}
                    >make login false</div>
                    <div onClick={() => {
                        console.log(this.state);
                    }}>
                        get log
                    </div>

                    <button
                    onClick={() => {
                        this.handleLogout();
                        resetStore();
                        window.location.href = "/login";
                    }}
                    >로그아웃
                    </button>
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
    setStoreUid: (id) => dispatch(userAction.setUid(id)),
    setStoreNickname: (nickname) => dispatch(userAction.setNickname(nickname)),
    setStoreLoginTrue: () => dispatch(userAction.setLoginTrue()),
    setStoreLoginFalse: () => dispatch(userAction.setLoginFalse()),
    increaseStoreWin: () => dispatch(userAction.increaseWin()),
    increaseStroeLose: () => dispatch(userAction.increaseLose()),
    resetStore: () => dispatch(userAction.reset())
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)