import express from 'express'; //express 사용을 위한 import
import connect from './schemas/index.js'; // app.js에서 connect함수를 하용하기 위함 import
import TodosRouter from './routes/todos.router.js'; //todos.router.js의 router를 사용하기 위한 import

const app = express(); //라우트, 미들웨어, HTTP 요청 처리 등을 정의하기 위한 Express애플리케이션의 인스턴스 생성
const PORT = 3000; //포트번호 설정

connect();//MongoDB와의 연결 시도

// app.use - 미들웨어 설정
app.use(express.json()); // 클라이언트의 요청(Request)을 받을때 req.body에 접근하여 body데이터를 사용할 수 있도록 설정
app.use(express.urlencoded({extended:true})); //폼데이터나 쿼리스트링 형식의 URL-encoded데이터를 이해하고 처리할 수 있도록 설정
                                             //extended: true는 쿼리스트링 라이브러리를 사용하도록 확장된 옵션을 설정하는 것

app.use(express.static('./assets')); // 클라이언트에게 정적파일들을 제공하기위한 미들웨어 설정. 

const router = express.Router(); // 라우터 인스턴스 생성 - express.Router는 라우팅을 모듈화하고 더 효율적으로 구성할 수 있게 해주는 기능

router.get('/',(req,res)=>{
    return res.json({messege:'안녕'});
});

app.use('/api',[router,TodosRouter]); // api로 시작된 경로는 router와 TodosRouter로 클라이언트의 요청이 전달

app.listen(PORT, () => { // Express 애플리케이션에서 지정된 포트에서 실행, 웹 서버를 실행하고 클라이언트 요청 받을수 있도록 구성.
    console.log(PORT, '포트로 서버가 열렸어요!');
});