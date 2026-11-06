import { useState } from "react";
import type { LoginForm } from "../types/user";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

// 로그인 폼 초기화
const initialForm: LoginForm = {
  username: "",
  password: ""
}

const SignIn = () => {
    const [form, setForm] = useState<LoginForm>(initialForm);
    const [error, setError] = useState<string | null>(null);
    const { login } = useUser();
    const navigate = useNavigate();

    // 폼에 입력된 데이터 가져오기
    const { username, password } = form;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value })  // 입력 데이터 저장
    }

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 기본 동작 막기
    

    // 유효성 검사
    if(!username){
        setError("아이디를 입력하세요");
        return;
    }
    if(!password){
        setError("비밀번호를 입력하세요");
        return;
    }

    // 로그인 함수 호출
    const success = login({username, password});
    if(!success){
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
        return;
    }
    alert("로그인 되었습니다.");
    navigate('/');
}

    return(
        <div className="sign-in">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleInputChange}
            placeholder="아이디를 입력하세요"
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="sign-in_error">{error}</p>}
        <button type="submit">로그인</button>
      </form>
        </div>
    )
}


export default SignIn;