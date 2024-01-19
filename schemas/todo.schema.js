import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({ //스키마 정의하기
    value: {
        type: String,
        require: true, // value(할일) 필수 요소
    },
    order: {
        type: Number,
        require: true, // order(순서) 필수 요소
    },
    doneAt: {
        type: Date,
        require: true, // doneAt(완료날짜) 필수요소 x
    },
});

// 프론트엔드 서빙을 위한 코드
TodoSchema.virtual('todoId').get(function () {
    return this._id.toHexString();
});
TodoSchema.set('toJSON', {
    virtuals: true,
});


// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Todo', TodoSchema);