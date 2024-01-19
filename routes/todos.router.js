// /routes/todos.router.js

import express from 'express';
import Todo from '../schemas/todo.schema.js'

const router = express.Router();

/* 데이터 삽입 */
router.post('/todos', async (req, res) => {
    // 클라이언트에게 전달 받은 value데이터를 구조분해할당을 사용하여 변수에 저장
    const { value } = req.body

    // value가 존재하지 않을 때, 클라이언트에게 에러 메시지를 전달
    if (!value) {
        return res
            .status(400)
            .json({ errorMessage: '해야할 일 데이터가 존재하지 않습니다.' });
    }

    // MongoDB데이터베이스에서 Todo모델의 데이터를 검색하고 order필드를 기준으로 내림차순(-)으로 정렬한후 최대값 찾는 과정.
    const todoMaxOrder = await Todo.findOne().sort('-order').exec();

    // 'order' 값이 가장 높은 도큐멘트의 1을 추가하거나 없다면, 1을 할당
    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1

    // Todo모델을 이용해, 새로운 '해야할 일'을 생성
    const todo = new Todo({ value, order });

    // 생성한 '해야할 일'을 MongoDB에 저장
    await todo.save();

    return res.status(201).json({ todo });
});



/* 데이터 조회 */
router.get('/todos', async (req, res) => {

    // Todo모델을 이용해, MongoDB에서 'order'값이 가장 높은 '해야할일'을 찾음
    const todos = await Todo.find().sort('-order').exec();

    // 찾은 해야할 일을 클라이언트에게 전달.
    return res.status(200).json({ todos });
});




/* 데이터 순서 변경, 할일 완료, 내용수정 */
router.patch('/todos/:todoId', async (req, res) => {
    // 바뀌기전 할일의 id값
    const { todoId } = req.params // 동기적으로 변하는 :todoId값을 가져옴

    // 바꿔질 할일의 번호, 완료 시점
    const { order, done, value } = req.body // body의 값을 가져옴

    // validation - 유효성검사
    const currentTodo = await Todo.findById(todoId).exec();
    if (!currentTodo) {
        return res
            .status(404)
            .json({ errmessege: '존재하지 않는 todo데이터' })
    }

    if (order) { //order가 있다면 순서를 변경하는 로직
        const changeTarget = await Todo.findOne({order}).exec();
        if (changeTarget) {
            changeTarget.order = currentTodo.order;
            await changeTarget.save(); // 변경사항 저장
        }
        currentTodo.order = order;
    }

    if (done !== undefined) {
        // 변경하려는 '해야할 일'의 doneAt 값을 변경합니다.
        currentTodo.doneAt = done ? new Date() : null;
    }

    if(value){ // 변경하려는 해야할일(value)의 내용을 변경
        currentTodo.value = value;
    }

    currentTodo.save();
    return res.status(200).json({}); // 
});



/* 할 일 삭제 */
router.delete('/todos/:todoId',async (req,res)=>{
    const {todoId} = req.params;

    // 삭제하려는 '해야할 일'을 가져오는데 없으면 존재 x알림
    const currentTodo = await Todo.findById(todoId).exec() // 명시적으로 id를 찾는다고 했으므로 값만 넣어주면 됨.
    if(!currentTodo){
        return res
            .status(404)
            .json({errermessage:'존재하지 않는 데이터'})
    }

    // 주어진 id값으로 데이터 베이스에 해당하는 해야할 일 삭제
    await Todo.deleteOne({_id:todoId}).exec(); // 1가지를 삭제하는거지 id를 찾아서 삭제하는게 아니므로 명시적으로 지정해주어야 함
    return res.status(200).json({});
});

export default router;