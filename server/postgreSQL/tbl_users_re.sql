
-- tsdb/jsuser 접속 확인
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(12)  NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(50)  NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  role        VARCHAR(10)  NOT NULL DEFAULT 'user'
              CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

DROP TABLE users;

select * from users;

-- 관리자 권한 
UPDATE users SET role='admin' WHERE id=1;