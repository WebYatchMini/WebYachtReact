import { Component } from 'react'
import { connect } from 'react-redux';
import './login.css'

import * as userAction from "../actions/user"

class Login extends Component {
  state = {
    id : "",
    pw : ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  pressEnter = (e) => {
    if (e.key === 'Enter') {
      this.handleLogin();
    }
  }

handleLogin = () => {
    const { setStoreUid, setStoreNickname, setStoreLoginTrue, setStoreMmr, setStoreWin, setStoreLose } = this.props
    // const requstOption = {
    //   method : 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body : JSON.stringify({
    //     id : this.state.id,
    //     pw : this.state.pw
    //   })
    // }
    // fetch('/api/login/', requstOption)
    //   .then(res => res.json())
    //   .then(data => {
    //     if (data.status) {
    //       setStoreLoginTrue();
    //       setStoreUid(data.uid);
    //       setStoreNickname(data.nickname);
    //       setStoreMmr(data.mmr);  
    //       setStoreWin(data.win);
    //       setStoreLose(data.lose);
    //       // this.props.navigate('/');
    //       window.location.href = '/';
    //     }
    //     else {
    //       alert('아이디 혹은 비밀번호를 다시 확인해주세요');
    //     }
    //   });

          setStoreLoginTrue();
          // this.props.navigate('/');
          window.location.href = '/';
  }

  render() {
    return (
      <div>
        <div className="container " id="loginForm">
          <form>
            <div className="row justify-content-center">
              <div className="col-3">
                <div className="input-group mb3">
                  <span className="input-group-text inputText">ID</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ID"
                    name="id"
                    onChange={this.handleChange}
                    onKeyPress={this.pressEnter}
                  ></input>
                </div>
                <div className="input-group mb3">
                  <span className="input-group-text inputText">PW</span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="pw"
                    onChange={this.handleChange}
                    onKeyPress={this.pressEnter}
                  ></input>
                </div>
              </div>
              <div className="col-1">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  id="loginBtn"
                  onClick={this.handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
          <div className='row justify-content-center'>
              <div className='col-2' id='additional_option_box'>
                  <ul id='additional_option'>
                      <li><a href='/register'>sign up</a><span> /</span></li>
                      <li><a href='/forgetpw'>forgot pw?</a></li>
                  </ul>
              </div>
          </div>
        </div>
      </div>
    );
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
  setStoreMmr: (mmr) => dispatch(userAction.setMmr(mmr)),
  setStoreWin: (win) => dispatch(userAction.setWin(win)),
  setStoreLose: (lose) => dispatch(userAction.setLose(lose)),
  increaseStoreWin: () => dispatch(userAction.increaseWin()),
  increaseStroeLose: () => dispatch(userAction.increaseLose())
})

// export default function LoginWithNavigate(props) {
//   const navigate = useNavigate();
//   const LoginClass = connect(mapStateToProps, mapDispatchToProps)(Login);
//   return <LoginClass navigate={navigate}/>
// }
export default connect(mapStateToProps, mapDispatchToProps)(Login);