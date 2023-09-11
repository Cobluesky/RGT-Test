// 서버 실행을 위한 express, JSON 데이터 처리를 위한 body-parser, mysql 사용을 위한 mysql 모듈을 설치합니다.
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express(); 
const port = 5000; // 포트를 선언합니다.

app.use(bodyParser.json());


//DB Connection 정보를 삽입합니다.
//원래대로라면 암호화를 위해 .env나 git에 submodule로 관리합니다만, 편의를 위해 생략하겠습니다.
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3262',
  database: 'test'
}); 

//DB와 연결합니다.
db.connect(err => {
  if (err) {
    console.error('MySQL 연결 실패. :', err);
    return;
  }
  console.log('MySQL 접속 성공');
});

//데이터 조회를 위한 get 부분입니다.
//과제에는 포함되지 않는 부분입니다만, 편의를 위해 만들었습니다.
app.get('/get', (req, res) => {
    const data = req.query.data;

    const sql = 'SELECT * FROM orders';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('데이터를 조회할 수 없습니다.', err);
            res.status(500).json({ message: "데이터를 조회할 수 없습니다." });
            return;
        }
        
        console.log(data);

        res.json(result);
    });
});

//과제 2의 post로 데이터 삽입 부분입니다.
app.post('/post', (req, res) => {
  const {
    order_id,
    product_name,
    options,
    table_no,
    quantity,
    order_date,
    order_time,
    robot_status,
    seq,
    dong,
    ho,
    orderer_name,
  } = req.body;

  //과제 2-1의 데이터 중복체크를 위해 해당 데이터가 존재하는지 검사합니다.
  const checkDuplicateSql = 'SELECT * FROM orders WHERE order_id = ?';

  db.query(checkDuplicateSql, [order_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('중복 체크에 오류 발생:', checkErr);
      res.status(500).json({ message: '중복 체크에 오류 발생', requestData: req.body });
      return;
    }

    //중복데이터가 존재한다면, 삭제합니다.
    if (checkResult.length > 0) {
      const deleteSql = 'DELETE FROM orders WHERE order_id = ?';

      db.query(deleteSql, [order_id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('삭제 오류 발생:', deleteErr);
          res.status(500).json({ message: '삭제 오류 발생', requestData: req.body });
          return;
        }
      });
    }

    //삭제한후 데이터를 삽입합니다.
    const insertSql =
      'INSERT INTO orders (order_id, product_name, options, table_no, quantity, order_date, order_time, robot_status, seq, dong, ho, orderer_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    //order_id의 포맷을 유지하기 위해 formatting을 합니다.
    const formatted_order_id = order_id.toString().padStart(4, '0');

    db.query(
      insertSql,
      [
        formatted_order_id,
        product_name,
        options,
        table_no,
        quantity,
        order_date,
        order_time,
        robot_status,
        seq,
        dong,
        ho,
        orderer_name,
      ],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error('삽입 오류 발생:', insertErr);
          res.status(500).json({ message: '삽입 오류 발생', requestData: req.body });
          return;
        }
        console.log('데이터 삽입 성공');

        res.json({ message: `주문번호: ${formatted_order_id} : 수신` }); // 데이터 처리가 완료되었음을 알립니다.
      }
    );
  });
});

app.listen(port, () => {
  console.log(`서버가 실행중입니다. 포트 : ${port}`);
});