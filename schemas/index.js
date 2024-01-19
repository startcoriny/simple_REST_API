import mongoose from 'mongoose'; //Mongoose는 MongoDB와 상호작용하기 위한 ODM(Object Data Modeling) 라이브러리

const connect = () => { //MongoDB에 연결하는 역할
    mongoose
        .connect( //connect 메서드를 사용하여 연결정보를 입력하고 MongoDB에 연결시도
            'mongodb+srv://coriny:coriny1234@express-mongo.xcoqu31.mongodb.net/?retryWrites=true&w=majority', // MongoDB클러스터의 주소와 사용자 인증 정보를 포함한 연결 문자열입력 & 환경 변수로 관리
            {
                dbName: 'todo_memo', // todo_memo 데이터베이스명을 사용합니다.
            },
        )
        .then(() => console.log('MongoDB 연결에 성공하였습니다.'))
        .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', (err) => { // DB연결에 에러가 발생하면 해당에러를 콘솔에 출력
    console.error('MongoDB 연결 에러', err);
});

export default connect;