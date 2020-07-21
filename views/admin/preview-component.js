import modal from '../../views/modal-component.js';
import navigation from '../../views/navigation.js';
import modalMixin from '../../mixin/modal.js';
import adminCheck from '../../mixin/admin-check.js';


export default {
    components : {modal, navigation},
    mixins : [modalMixin, adminCheck],
    data() {
       return{
            questions : {},
            currentQuestionId : 0,
            currentQuestion : {},
            answers : {},
            selected : '',
            date : '',
            stop : '',
            currentTime : '',
            testing : '',
            minutes : '',
            seconds : '',
            hours : '',
            allocatedTime : '',
            wholesec : '',
            valueof : '',
            gettime : '',
            answered : [],
            interval : '',
            modal : {
                options : {
                    examEnd : {
                        backdrop : 'static'
                    }
                },
                title : 'Notice',
                body : '',
                size : '',
                classess : {
                    ExamSubmit : 'ExamSubmit'
                }
            }
       }
    },
    computed : {
        getMarks () {
            return this.$store.state.db.subjects[this.currentExam.subject.toLowerCase()][this.term].marks;
        },
        examEnd(){
            return !!sessionStorage.finished;
        },
        questionLength(){
            return Object.keys(this.questions).length;
        },
        currentExam(){
            return this.$store.getters.currentExam;
        },
        formartDuration(){
            return this.$store.getters.formartDuration;
        },
        question(){
            return this.questions[this.currentQuestionId];
        },
        db(){
            return this.$store.getters.getdb;
        },
        x(){
            return this.$store.getters.questions;
        },
        term(){
            return this.$store.getters.term;
        },
        isAnswered(){
            return (questId) => (!this.answers[questId - 1]) ? "" : "answered-question";  
        }
    },
    created(){
        let query = this.$root.$route.query;
        if(query.subject){
            this.query = query;
            this.isPreview = true;
        }
        this.questions = this.$store.state.db.subjects[query.subject.toLowerCase()][query.term || 'firstTerm']['questions'];
    },
    mounted(){
        if(this.examEnd){
            this.calculateScores();
            this.showExamEndModal()
       } else {
        // this.startExam();
       }
    },
    watch : {
        selected(newValue){
            this.answers[this.currentQuestionId] = newValue;
        }
    },
    methods : {
        getDateFromUser(){
            let timeArr = (this.currentExam.duration).split(':');
            let hour = Number(timeArr[0]);
            let minutes = Number(timeArr[1]);
            return (hour * 3600000 + minutes * 60000);
        },
        startExam(){
            if( !sessionStorage.finished ){
                let dc = sessionStorage.dc ? new Date(JSON.parse(sessionStorage.dc)) : new Date();
                sessionStorage.dc = JSON.stringify(dc);
                let stop = new Date(dc.valueOf() + (this.getDateFromUser()));
                this.currentTime = dc;
                this.date =  dc.getMinutes() + 'min : ' + dc.getSeconds() + ' secs';
                this.stopTime = sessionStorage.stopTime ? new Date(JSON.parse(sessionStorage.stopTime)) :stop;
                sessionStorage.stopTime = JSON.stringify(stop);
                this.stop = stop.getMinutes() + 'min : ' + stop.getSeconds() + ' secs';
                this.allocatedTime = this.format(stop.valueOf() - this.currentTime.valueOf());
                this.interval = setInterval(() => {
                    this.currentTime = new Date();
                    this.currentTimeRd = this.currentTime.getMinutes() + 'min : ' + this.currentTime.getSeconds() + ' secs';
                    let timeLeftDuration = this.stopTime.valueOf() - this.currentTime.valueOf();
                    let timeLeft = this.format(timeLeftDuration);
                    this.minutes = timeLeft.minutes;
                    this.hours = timeLeft.hours;
                    this.seconds = timeLeft.seconds;
                    if(timeLeft.totalSeconds <= 10 && timeLeft.totalSeconds > 0){
                        if(this.$refs.timercount){
                            if( ! this.$refs.timercount.classList.contains('blink') ){
                                this.$refs.timercount.classList.add('blink');
                            }
                        }
                    }
                    if(timeLeft.totalSeconds <= 0){
                        this.calculateScores();
                        this.showExamEndModal();
                        sessionStorage.dc = sessionStorage.stopTime;
                        clearInterval(this.interval);
                        sessionStorage.removeItem('dc');
                        sessionStorage.removeItem('stopTime');
                        sessionStorage.finished = true;
                    }
                },1000);
            }
        },
        showExamEndModal(){
            this.modal.headerClass = 'bg-danger text-light'
            this.modal.title = 'Time Exhausted';
            this.modal.body = `
                <div align="center">
                <h4> YOUR SCORE : ${this.getScores()} </h4>
                <h6> PERCENTAGE : ${ Math.trunc(Math.floor(this.getScores() / (this.questionLength * this.getMarks) * 100))} % </h6>
                        you answered ${this.getScores()} out of ${this.questionLength} questions correctly
                </div>
            `;
            this.showModal('ExamEnd', this.modal.options.examEnd);
        },
        changeQuestion(event){
            let id = Number(event.target.dataset.id) - 1;
            if(this.currentQuestionId == id){
                return;
            }
            this.currentQuestionId = id;
            this.selected = this.answers[this.currentQuestionId] || '';
        },
        nextQuestion(){
            if(((this.currentQuestionId + 1) == this.questionLength)){
                return;
            }
            this.currentQuestionId++;
            this.selected = this.answers[this.currentQuestionId] || '';
        },
        prevQuestion(){
            if(this.currentQuestionId == 0){
                return;
            }
            this.currentQuestionId--;
            this.selected = this.answers[this.currentQuestionId] || '';

        },
        format(diff){
            return {
                hours : Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
                minutes : Math.floor(diff % (1000 * 60 * 60) / (1000 * 60 )),
                seconds : Math.floor(diff % (1000 * 60 ) / (1000)),
                totalSeconds : Math.trunc(Math.round(diff / 1000))
            }
        },
        calculateScores(){
            let answers = this.answers;
            let qsts = this.questions;
            let score = 0;
            for(let i = 0; i < qsts.length; i++){
                if(answers[i] == qsts[i].correctAns){
                    score+= Number(this.getMarks);
                }
            }
            this.score = score || 0;
        },
        formartQuestion(quest){
            return "<h5 style='letter-spacing : -1px; word-spacing: -3px;'>" + quest + "</h5 style='word-spacing : 0'>";
            // return quest.replace(/\n/gm, "<br>");
        },
        getScores(){
            return this.score;
        },
        submitProceed(){
            this.getScores();
            sessionStorage.dc = sessionStorage.stopTime;
            clearInterval(this.interval);
            setTimeout(() => {
                sessionStorage.removeItem('dc');
                sessionStorage.removeItem('stopTime');
                sessionStorage.finished = true;
            })
            this.dismissModal('ExamSubmit');
            this.calculateScores();
            this.showExamEndModal()
        },
        submitExam(){
            let msg = `do you really want to submit`;
            this.modal.body = msg,
            this.modal.title = 'Notice',
            this.showModal('ExamSubmit');
        },
    },
    beforeRouteLeave(to, from, next){
        if(sessionStorage.finished){
            if(JSON.parse(sessionStorage.finished)){
                this.dismissModal('ExamSubmit');
                this.dismissModal('ExamEnd');
                next({ redirect : '/'});
            }
        }

        next();
    },
    template : `
    <div>
        <modal headerClass="text-info" @dismissModal="dismissModal" modalClass="ExamSubmit" :modal="modal" :showCancel="false">
            <template v-slot:cancelBtn>
                <button type="button" class="btn btn-info" data-dismiss="modal"> 
                    cancel
                </button>
            </template>
            <template v-slot:proceedBtn>
                <button type="button" class="btn btn-danger" @click="submitProceed"> 
                    Submit
                </button>
            </template>
       </modal>

       <modal headerClass="bg-danger text-light" @dismissModal="dismissModal" modalClass="ExamEnd" :modal="modal"  :showCancel="false"> 
       </modal>

       <navigation :isAdmin="isAdmin"></navigation>

        <br>
        <div class="container-fluid" align="center">
            <div class="row">               
                <div class="col-md-12" style="border:1px solid #fff; background-color: #fff;">
                    <div class="row p-2 text-uppercase" style="">
                        <div class="col d-flex justify-content-center align-items-center">
                            <h6>
                                Term - <span class='text-info'> {{term}} Exam </span>
                            </h6>
                        </div>
                        
                        <div class="col d-flex flex-xs-column flex-sm-wrap justify-content-center align-items-center">
                             <span class="timercount bg-success font-weight-bold rounded-left">
                             Timer
                             </span>
                             <span ref="timercount" class='p-0 timercount font-weight-bold rounded-md-right'>
                                :
                                </span>   
                                <span ref="timercount" class='timercount font-weight-bold rounded-md-right'>
                                         {{hours == 0 ? '0  ' : hours + '  '}}
                                </span>
                                <span ref="timercount" class='p-0 timercount font-weight-bold rounded-md-right'>
                                :
                                </span>
                                <span ref="timercount" class='timercount font-weight-bold rounded-md-right'>
                                       {{ minutes ? minutes + '  ' : '0  '}}
                                </span>
                                <span ref="timercount" class='p-0 timercount font-weight-bold rounded-md-right'>
                                :
                                </span>
                                <span ref="timercount" class='timercount font-weight-bold rounded-right'>
                                        {{ seconds ? seconds : "00" }}
                                </span>
                        </div>
                        <div class="col d-flex justify-content-center align-items-center">
                            <h6>
                                Duration : 
                                    <span class='text-info'>
                                         {{formartDuration}} 
                                    </span>
                            </h6>
                        </div>
                        <div class="col d-flex justify-content-center align-items-center">
                            <h6>
                                Subject : 
                                <span class='text-info'>
                                    {{currentExam.subject}}
                                </span>
                            </h6>
                        </div> 
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-8 exam-main-content shadow bg-light" style="border:1px solid #fff">
                    <br>
                    <div class="p-2" style="display: flex; flex-direction: column; justify-items: center;">

                        <div v-if="question">

                        <h6 class="text-capitalize">
                            <div v-if="question.hasImg">
                                <div v-if="question.img.position == 'Before Question'" style="">
                                Question :  {{question.question}}
                                    <br><br>
                                    <img :src="question.img.src" class="img-fluid" style="height:200px; min-width:80%">
                                </div>
                                <div v-else-if="question.img.position == 'After Question'">
                                    <img :src="question.img.src" class="img-fluid" style="height:200px;">
                                    <br><br>
                                Question :  <span :bind="question.question"></span>

                                </div>
                            </div>
                            <div v-else="question.hasImg">
                                Question {{currentQuestionId + 1}} : <pre class="font-weight-bold" style="white-space : pre-wrap" v-html="formartQuestion(question.question)"></pre> 
                            </div>
                            
                        </h6>
                        <div align='left' style="">
                    <form>
                        <div v-for="(options, value) in question.options" class="form-group">
                            <input :disabled="examEnd" type="radio" :value='value' name='userAnswer' v-model="selected" :id='value' ref="opt"> 
                            <label :for='value'>
                                [{{ value.toUpperCase() }}]  - {{options}}
                            </label>
                        </div>
                    </form>
                    </div>

                </div>
        </div>

            </div>
               <div class="col-md-2">
                    <button @click="submitExam" class="btn btn-danger btn-block btn-md"> 
                        submit
                    </button>
                </div>
           </div>
           <div class="row">
            <div class="col-md-2"></div>
               <div class="col-md-8 bg-light p-2">
                <div class="clearfix">
                    <span @click="prevQuestion" class="float-left btn btn-info">Previous</span>
                    <span @click="nextQuestion" class="float-right btn btn-info">Next</span>
                </div>
            </div>
               <div class="col-md-2"></div>
           </div>
           <br>
           <div class="row">
            <div class="col-md-1"></div>
               <div class="col-md-10 p-2" style="">
                <small>
                <div v-if="questionLength">
                    <ul class="pagination" id="pgn">
                        <li v-for="i in questionLength" class="pagination-item">
                            <a @click="changeQuestion" class="page-link" :data-id="i" :class="[i == currentQuestionId + 1 ? 'active' : '', isAnswered(i)]">
                                {{i}}
                            </a>
                        </li>
                    </ul>
                </div>
                    
            </small>
            </div>
               <div class="col-md-1"></div>
           </div>
        </div>
        </div>
        `
};
