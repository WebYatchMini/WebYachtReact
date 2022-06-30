import { Component } from "react";
import "./Register.css";

class Register extends Component {
  state = {
    id: "",
    pw: "",
    pw_check: "",
    nickname: "",
    hint: "",
    hint_answer: "",
    id_dup: false,
    nick_dup: false,
  };

  handleIdCheck = () => {
    var kor_pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    if (kor_pattern.test(this.state.id)) {
      alert('아이디에 한글은 사용하실 수 없습니다')
    }
    else {
      fetch('/api/search/id/' + this.state.id)
        .then(res => res.json())
        .then(data => !data ? (window.confirm("사용 가능한 아이디 입니다, 아이디를 사용하시겠습니까?") ? this.setState({id_dup:true}) : this.setState({id_dup:false})) : alert("중복된 아이디입니다, 다시 확인해주세요~"))
    }
  };

  handleNickNameCheck = () => {
    var pattern = /[^ㄱ-ㅎ&^ㅏ-ㅣ&^가-힣&^a-z&^A-Z&^0-9]/g;
    if (pattern.test(this.state.nickname)) {
      alert('사용할 수 없는 문자가 들어가있습니다')
    }
    else {
      fetch('/api/search/nickname/' + this.state.nickname)
        .then(res => res.json())
        .then(data => !data ? (window.confirm("사용 가능한 닉네임 입니다, 닉네임을 사용하시겠습니까?") ? this.setState({nick_dup:true}) : this.setState({nick_dup:false})) : alert("중복된 닉네임입니다, 다시 확인해주세요~"))
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  passwordChk = () => {
    let pw = document.getElementById("pw").value;
    let pw_check = document.getElementById("pw_check").value;

    if (pw === pw_check) return true;
    else return false;
  };

  handleRegister = () => {
    if (!this.state.id_dup) {
      alert("아이디 중복확인을 해주세요")
    }
    else if (!this.state.nick_dup) {
      alert("닉네임 중복확인을 해주세요")
    }
    else if (!this.passwordChk()) {
      alert("비밀번호가 일k치하지 않습니다");
    }
    else if (this.passwordChk() && this.state.id_dup && this.state.nick_dup) {
      let chk = window.confirm("이대로 가입하시겠습니까?");
      if (chk) {
      fetch('/api/regist', {
        method : 'POST',
        redirect : 'follow',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
          id: this.state.id,
          pw: this.state.pw,
          nickname: this.state.nickname,
          hint: this.state.hint,
          hint_answer: this.state.hint_answer,
        })
      }).then(res => res.json())
      .then(data => data.serverStatus === 2 ?
        (() => {
          alert("회원가입이 완료되었습니다");
          window.location.href = '/login'
        })() : alert("에러 발생"))
      }
    }
  };

  handleIdCancel = () => {
    this.setState({
      id_dup : false
    })
  }
  handleNickNameCancel = () => {
    this.setState({
      nick_dup : false
    })
  }

  render() {
    return (
      <div className="row justify-content-center" id="register_main">
        <div className="input-group mb-3">
          <span className="input-group-text inputText register_tag">아이디</span>
          {this.state.id_dup ? (
            <input
              type="text"
              disabled
              className="form-control"
              placeholder="아이디를 입력하세요."
              name="id"
              id="id"
              value={this.state.id}
            />
          ) : (
            <input
              type="text"
              className="form-control"
              placeholder="아이디를 입력하세요."
              name="id"
              id="id"
              onChange={this.handleChange}
            />
          )}
          {this.state.id_dup ? (
            <button
              type="button"
              className="btn btn-success"
              id="id_check_btn"
              onClick={this.handleIdCancel}
            >
              아이디 변경
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              id="id_check_btn"
              onClick={this.handleIdCheck}
            >
              중복확인
            </button>
          )}
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text inputText register_tag">비밀번호</span>
          <input
            type="password"
            className="form-control"
            placeholder="비밀번호를 입력하세요."
            name="pw"
            id="pw"
            onChange={this.handleChange}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text inputText register_tag">비밀번호 확인</span>
          <input
            type="password"
            className="form-control"
            placeholder="비밀번호를 재입력하세요."
            name="pw_check"
            id="pw_check"
            onChange={this.handleChange}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text inputText register_tag">닉네임</span>
          {this.state.nick_dup ? (
            <input
              type="text"
              disabled
              className="form-control"
              placeholder="닉네임을 입력하세요."
              name="nickname"
              id="nickname"
              value={this.state.nickname}
            />
          ) : (
            <input
              type="text"
              className="form-control"
              placeholder="닉네임을 입력하세요."
              name="nickname"
              id="nickname"
              onChange={this.handleChange}
            />
          )}
          {this.state.nick_dup ? (
            <button
              type="button"
              className="btn btn-success"
              id="nickname_check_btn"
              onClick={this.handleNickNameCancel}
            >
              닉네임 변경
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              id="nickname_check_btn"
              onClick={this.handleNickNameCheck}
            >
              중복확인
            </button>
          )}
        </div>
        <div>
          <select className="form-select" name="hint" onChange={this.handleChange}>
            <option value="0" selected="selected">
              힌트 선택
            </option>
            <option value="1">당신의 출신 초등학교는?</option>
            <option value="2">당신이 태어난 고향은?</option>
            <option value="3">당신이 좋아하는 색깔은?</option>
            <option value="4">당신의 보물 제1호는?</option>
            <option value="5">당신의 좌우명은?</option>
          </select>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text inputText register_tag">힌트의 답</span>
          <input type="text" className="form-control" name="hint_answer" onChange={this.handleChange}/>
        </div>
        <div className="btn-toolbar rg_btn_group">
          <div className="d-grid gap-2 col-4 mx-auto">
            <a
              className="btn btn-danger btn-cancle"
              id="register_btn"
              href="/"
            >
              뒤로가기
            </a>
          </div>
          <div className="d-grid gap-2 col-4 mx-auto">
            <button
              type="button"
              className="btn btn-primary btn-rg"
              id="register_btn"
              onClick={this.handleRegister}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
