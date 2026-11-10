import express from 'express'
import pg from 'pg'
import cors from 'cors'

// express 객체 생성
const app = express();
const PORT = 8000;

app.use(cors());

// 본문 요청 파싱 - 상품등록, 회원가입
app.use(express.json());

// DB 연결
const db = new pg.Client({
    host: "localhost",
    user: "jsuser",
    password: "pwjs",
    database: "tsdb"
})

try{
    await db.connect();
    console.log("PostgreSQL 연결 성공!");
}catch(err){
    console.error("PostgreSQL 연결 실패!", err.message);
}

// 기본 라우터
app.get("/", (req, res) => {
    res.send("<h1>쇼핑몰 서버 API 개발</h1>")
})

// 상품 목록 조회
app.get("/api/products", async (req, res) => {
    const sql = "SELECT * FROM products";
    try{
        const result = await db.query(sql); //db에서 꺼내온 데이터
        res.json(result.rows);  //요청한 곳에 반환
    }catch(err){
        console.error("상품 목록 조회 오류!!", err);
        res.send("상품 목록 조회 오류!!")
    }
});

// 상품 1건 조회
app.get("/api/products/:id", async (req, res) => {
    const pid = req.params.id;  //id 받아오기
    const sql = "SELECT * FROM products WHERE id = $1";
    try{
        const result = await db.query(sql, [pid]); //db에서 꺼내온 데이터
        res.json(result.rows[0]);  //요청한 곳에 반환
    }catch(err){
        console.error("상품 조회 오류!!", err);
        res.send("상품 조회 오류!!")
    }
});

// 상품 등록
app.post("/api/products", async (req, res) => {
    const { pName, category, price, description, image} = req.body;
    const sql = "INSERT INTO products(p_name, category, price, description, "
       + " image) VALUES ($1, $2, $3, $4, $5)";
    try{
        await db.query(sql, [pName, category, price, description, image ?? null]);
        res.send("상품 등록 완료!");
    }catch(err){
         console.error("상품 등록 오류!!", err);
        res.send("상품 등록 오류!!")
    }
})

// 회원 목록
app.get("/api/users", async (req, res) => {
    const sql = "SELECT * FROM users";
    try {
        const result = await db.query(sql);
        res.json(result.rows); // 요청한 곳으로 json형식으로 반환
    } catch (err) {
        console.error("회원 목록 조회 오류!!", err);
        res.send("회원 목록 조회 오류!!")
    }
})

// 로그인
app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE "
            + "username=$1 AND password=$2 ";
    try {
        const result = await db.query(sql, [username, password]);
        if(result.rows.length === 0){
            return res.send("아이디 또는 비밀번호가 일치하지 않습니다.")
        }
        res.json({
            messege: "로그인 성공",
            user: result.rows[0]
        }); // 요청한 곳으로 json형식으로 반환
    } catch (err) {
        console.error("회원 로그인 중 오류!!", err);
        res.send("회원 로그인 중 오류!!")
    }
})

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행중... http://localhost:${PORT}`);
})