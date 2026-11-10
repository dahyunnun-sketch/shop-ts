import api from './api';
import type { LoginForm, NewUser, User } from '../types/user';

interface LoginResponse {
  message: string;
  user: User;
}

// 회원 목록 조회
export const getUsers = async () => {
  const response = await api.get<User[]>('/users');
  return response.data;
}

// 로그인: 성공하면 회원 정보를 돌려주고, 실패(401)하면 오류가 납니다.
export const requestLogin = async (loginForm: LoginForm) => {
  const response = await api.post<LoginResponse>('/users/login', loginForm);
  return response.data.user;
}

// 회원 가입: role은 보내지 않습니다. 서버(DB)의 기본값 'user'가 들어갑니다.
export const createUser = async (newUser: NewUser) => {
  const { username, password, name, email } = newUser;
  await api.post('/users', { username, password, name, email });
}