import { Component } from 'react'
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom'

import * as userAction from "../actions/user"

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            nickname: '',
            win: 0,
            lose: 0,
            login: true
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

    render() {
        const { storeUid, storeNickname, storeWin, storeLose, setStoreUid, setStoreNickname, increaseStoreWin, increaseStroeLose } = this.props
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
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    storeUid: state.user.id,
    storeNickname: state.user.nickname,
    storeWin: state.user.win,
    storeLose: state.user.lose
})

const mapDispatchToProps = (dispatch) => ({
    setStoreUid: (id) => dispatch(userAction.setUid(id)),
    setStoreNickname: (nickname) => dispatch(userAction.setNickname(nickname)),
    increaseStoreWin: () => dispatch(userAction.increaseWin()),
    increaseStroeLose: () => dispatch(userAction.increaseLose())
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)