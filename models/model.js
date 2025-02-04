const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema({
    email : {type : String , required : true, match : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, lowercae: true},
    // email을 받을 때 이미 존재하는 여부 따지고 특정형식을 따르며 소문자로 받아야함
    password : String,
    name : String,
    role : {type : Number, enum : ['Teacher', 'Student']},
    email_auth : Boolean,
    email_token : String,
    solved_problems : [String], //여기서 [String]이라고 하는게 문법에 맞는지에 대한 의문?
    classroom_list : [String],
    salt: String
});

const classroomSchema = new mongoose.Schema({
    name : {type : String},
    classroom_master : {type :String},
    user_list : [String],
    classroom_owner : [String],
    chatting_id : String,
    notice_list : [
        {
            content : String,
            send_date : Date
        }
    ]
});

const problemSchema = new mongoose.Schema({
    problem_description : String,
    sample_input : String,
    sample_output : String,
    input_description : String,
    output_description : String,
    solution : String,  //File 객체가 실제로 없는것으로 확인했습니다. 제 예전 프로젝트도 이 문제 때문에 우회했었네요.
    difficulty : Number,
    Category : [String],
    problem_number: {
        type: Number,
        unique: true
    },
    input_list: [{_id: Number, txt: String}],
    output_list: [{_id: Number, txt: String}],
    spj: Boolean,
    spj_code: String,
    memory_limit: Number, // Please "Byte"
    time_limit: Number // Please "ms"
});

problemSchema.plugin(autoIncrement.plugin, {
    model: 'Problem',
    field: 'problem_number',
    startAt: 10000
});

//contest는 아직 안 만들음
const chattingSchema = new mongoose.Schema({
    send_time : Date, //https://codeday.me/ko/qa/20190319/100309.html => 반환할때 node js에서 반환 값 포맷하는 법을 알려주는 url
    message : String,
    owner : String
});

const judgeResultSchema = new mongoose.Schema({
    state: {type: Number, enum : ['Pending', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'PE', 'CE', 'JF']},
    pending_number: {
        type: Number,
        unique: true
    },
    code: String,
    language: String,
    user_id: String,
    problem_number: Number,
    ErrorMessage: String
});

judgeResultSchema.plugin(autoIncrement.plugin, {
    model: 'Judge',
    field: 'pending_number',
    startAt: 100000
});

const judgeQueueSchema = new mongoose.Schema({
    server_number: Number,
    server_ip: String,
    pending_number: Number
});

const judgeServerSchema = new mongoose.Schema({
    server_number: Number,
    server_ip: String,
    queue_size: Number,
    state : {type : Number, enum : ['OK', 'Error']}
});

//참고로 몽구스는 model의 첫 번째 인자로 컬렉션 이름을 만듭니다. User이면 소문자화 후 복수형으로 바꿔서 users 컬렉션이 됩니다.
module.exports = {
    user: mongoose.model('User', userSchema),
    classroom: module.exports.classroom = mongoose.model('Classroom', classroomSchema),
    problem: module.exports.problem = mongoose.model('Problem', problemSchema),
    chatting: module.exports.chatting = mongoose.model('Chatting', chattingSchema),
    judge: module.exports.judge = mongoose.model('Judge', judgeResultSchema),
    judgeQueue: module.exports.judge = mongoose.model('JudgeQueue', judgeQueueSchema),
    judgeServer: module.exports.judge = mongoose.model('JudgeServer', judgeServerSchema)
};