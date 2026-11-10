import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type { User, NewUser, LoginForm } from "../types/user";
import { createUser, getUsers, requestLogin } from "../api/users";

const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 회원 목록 조회
    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((err) => console.log('회원 목록 조회 오류!', err));
    }, []);

    // 회원가입 함수: 서버(DB)에 저장한 뒤, DB가 만든 id를 받기 위해 목록을 다시 불러옵니다.
    const signup = async (newUser: NewUser) => {
        await createUser(newUser);
        setUsers(await getUsers());
    }

    // 로그인 함수 (성공하면 true, 실패하면 false 반환)
    // 서버가 회원 정보를 돌려주면 성공, 오류(401 등)가 나면 실패입니다.
    const login = async (loginForm: LoginForm) => {
        try {
            const user = await requestLogin(loginForm);
            setCurrentUser(user);
            return true;
        } catch {
            return false;
        }
    }

    // 회원가입 함수
    const signup = ( newUser: NewUser) => {
        // 가입한 1명 회원
        const user: User = {...newUser, id: Date.now()}
        setUsers([...users, user])
    }

    // 로그인 함수
    const login = (loginForm: LoginForm) => {
        // 회원 목록에서 로그인한 1명의 회원 검색
        const found = users.find(user => 
            user.username === loginForm.username && 
                user.password === loginForm.password)
        if(!found) 
            return false; // 회원이 없어서 false로 반환함
        setCurrentUser(found);  //회원이 있는경우 true 반환
        return true;
    }

    // 로그아웃 함수
    const logout = () => {
        setCurrentUser(null);
    }

    return(
        <UserContext.Provider value={{ 
            users, 
            signup,
            currentUser,
            login,
            logout
         }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;