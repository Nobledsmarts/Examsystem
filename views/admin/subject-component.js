import modal from '../../views/modal-component.js';
import navigation from '../../views/navigation.js';
import subnavigation from '../../views/subnavigation.js';
import modalMixin from '../../mixin/modal.js';
import adminCheck from '../../mixin/admin-check.js';


export default {
    components : {modal, navigation, subnavigation},
    mixins : [modalMixin, adminCheck],
    data() {
        return {
            inputQuestionObj : null,
            currentSubject : '',
            subjectObj : null,
            inputQuestion : '',
            isEdited : false,
            userSelectedTerm : '',
            currentQuestionId : null,
            questionMarks : "1",
            diagram : {
                hasDiagram : false,
                src : '',
                position : '',
                positionArr : ['Before Question', 'After Question'],

            },
            modal : {
                title : '',
                body : '',
                confirm : false,
                showBtn : true,
                headerClass : "bg-danger text-light"
            },
            btn : {
                btnActions : ['Add Question', 'Edit Question'],
                btnValue : 'Add Question',
            },
            correctAns : '',
            options : {
                a : '',
                b : '',
                c : '',
                d : '',
            },
        }
    },
    computed : {
        getMarks : {
            get(){
            let term =  this.userSelectedTerm || this.term;
            return this.$store.state.db.subjects[this.$store.getters.subjectId(this.currentSubject.toLowerCase())]['term'][term].marks;
            },
            set(value){
                this.questionMarks = value;
            }
        },
        $(){
          return this.$store.state.$;
        },
        db(){
            return this.$store.getters.getdb;
        },
        term(){
            return this.$store.getters.term;
        },
        questions(){
            return this.subjectObj[this.userSelectedTerm || this.term] ? this.subjectObj[this.userSelectedTerm || this.term].questions : {};
        },
        nextQuestionKey(){
            this.keyyy = Object.keys(this.subjectObj[this.userSelectedTerm || this.term].questions).length;
            return this.keyyy;
        },
        questObj() {
            return this.subjectObj[this.userSelectedTerm || this.term].questions[this.currentQuestionId];
        },
        isPreview(){
            return !!this.$root.$route.query.preview;
        },
        getNiceTerm(){
            switch(this.userSelectedTerm){
                case "firstTerm" :
                    return "1ST TERM"
                case "secondTerm" :
                    return "2ND TERM"
                case "thirdTerm" :
                    return "3RD TERM"
            }
        },
        userTerm : {
            set(value){
                this.userSelectedTerm = value;
            },
            get(){
                return this.userSelectedTerm;
            }
        }
    },
    created(){
        let loggedData = sessionStorage.__login ? JSON.parse(sessionStorage.__login) : {isLoggedIn : false};
        let path = this.$root.$route.path;
        if((!loggedData.isLoggedIn)){
            this.$root.$router.push('/');
        } else if((path.indexOf('admin') >= 0) && !loggedData.isAdmin){
            this.$root.$router.push('/');
        } else {
            this.userSelectedTerm = this.term;
            this.currentSubject = this.$root.$route.params.subject;
            this.subjectObj = this.getSubjectObj(this.currentSubject);
            this.diagram.position = this.diagram.positionArr[0];
            // console.log(subjectObj);
        }
    },
    methods : {
        setMarks(){
            this.$store.dispatch('setMarks', {
                term : this.userSelectedTerm || this.term,
                subject : this.currentSubject,
                marks : this.questionMarks
            }).then(() => {
                this.modal.body = 'set successfully';
                this.modal.title = 'Notice';
                this.modal.showBtn = false;
                this.showModal('modal');
                return;
            });
        },
        cancelEdit(){
            // this.test();
            Object.keys(this.questObj.options).forEach(element => {
                this.options[element] = '';
            });
            this.isEdited = false;
            this.btn.btnValue = this.btn.btnActions[0];
            this.inputQuestionObj = null;
            this.inputQuestion = "";
        },

        // hasEmptyInput(obj){
        //     return ((obj) => {
        //         return Object.keys(obj).some((prop) => {
        //             return typeof obj[prop] == 'object' ? this.hasEmptyInput(obj[prop]) : !obj[prop];
        //          });
        //      })(obj);
        //  },

        hasEmptyInput(obj){
           return ((obj) => {
               return Object.keys(obj).some((el) => {
                    if(el == 'img' || el == 'hasImg'){
                        return false;
                    }
                    else if(typeof obj[el] == 'object'){
                        return (this.hasEmptyInput(obj[el]));
                    }
                        return !obj[el];
                });
            })(obj);
        },
        setQuestion (){
            this.currentSubject = this.$root.$route.params.subject;
            this.subjectObj = this.getSubjectObj(this.currentSubject);
            let obj = {
                    question : this.inputQuestion,
                    options : this.options,
                    correctAns : this.correctAns,
                    hasImg : this.diagram.hasDiagram,
                    img : {
                        position : this.diagram.position,
                        src : this.diagram.src,
                    },
                }
            if(this.hasEmptyInput(obj)){
                this.modal.body = 'Inputs Cant Be Empty';
                this.modal.title = 'Notice';
                this.modal.showBtn = false;
                this.showModal('questionAddModal');
                return;
            }
            this.$store.commit('AddQuestion', {
                term : this.userSelectedTerm || this.term,
                subject : this.currentSubject,
                isEdited : this.isEdited,
                questionNo : this.isEdited ? this.currentQuestionId : this.nextQuestionKey,
                obj,
            });
            if(this.isEdited){
                this.btn.btnValue = this.btn.btnActions[0];
                this.isEdited = false;
            }
            this.diagram = {
                hasDiagram : false,
                src : '',
                position : '',
                positionArr : ['Before Question', 'After Question'],
            };
            this.options = {
                a : '',
                b : '',
                c : '',
                d : '',
            },
            this.inputQuestionObj = null;
            this.inputQuestion = "";
            this.correctAns = "";
        },
        getTerm(term){
            return this.subjectObj[term];
        },
        getSubjectObj(value){
            return this.$store.getters.getSubjectByName(value.toLowerCase());
        },
         getfile() {
            let file = [this.$refs.img.files[0]];
            let that = this;
		    let reader = new FileReader();
            reader.addEventListener('loadend', function(e){
                let json = [reader.result];
                new Blob(json).text().then((el) => {
                    that.diagram.hasDiagram = true;
                    that.diagram.src = el;
                })
            });
            reader.readAsDataURL(file[0]);
        },
        remove(event){
            this.modal.eventType = event.currentTarget.dataset.type;
            this.modal.eventId = event.currentTarget.dataset.id;
            let msg = `do you really want to delete ${this.modal.eventId ? 'item' : 'all'}? data deleted cant be recovered`;
            this.modal.body = msg,
            this.modal.title = 'Notice',
            this.modal.showBtn = true;
            this.showModal('questionAddModal');
        },
        removeProceed(){
            this.$store.commit('removeSubjectItem', {
                subject : this.currentSubject,
                term : this.userSelectedTerm || this.term,
                type : this.modal.eventType,
                id : this.modal.eventId
            });
            this.dismissModal('questionAddModal');
        },
        previewQuestion(){
            this.$root.$router.push(`/app/user/exam?subject=${this.currentSubject}&term=${this.userSelectedTerm}`)
        },
        edit(event){
            this.currentQuestionId = Number(event.currentTarget.dataset.id) - 1;
            let inputQuestionObj = this.questObj;
            this.inputQuestion = inputQuestionObj.question;
            this.diagram.hasDiagram = inputQuestionObj.hasImg;
            this.diagram.position = inputQuestionObj.img.position;
            this.diagram.src = inputQuestionObj.img.src;
            this.correctAns = inputQuestionObj.correctAns;
            this.isEdited = true;
            
            this.btn.btnValue = this.btn.btnActions[1];
            Object.keys(inputQuestionObj.options).forEach(element => {
                this.options[element] = inputQuestionObj.options[element];
            });
        },
    },
    template : `
       <div> 
       <modal @dismissModal="dismissModal('questionAddModal')" :modal="modal" :showBtns="modal.showBtn" :headerClass="modal.headerClass">
        <template v-slot:cancelBtn>
            <button type="button" class="btn btn-info" data-dismiss="modal"> 
                cancel
            </button>
        </template>
        <template v-slot:proceedBtn>
            <button type="button" class="btn btn-danger" @click="removeProceed"> 
                delete
            </button>
        </template>
       </modal>
        <navigation :isAdmin="isAdmin"></navigation>
        <br>
        <subnavigation></subnavigation>

   
    
    <div class="container"> 
        <div class="row">
            <div class="col-md-1">
            </div>
            <div class="col-md-10 bg-darkcyan text-light shadow p-2">
                <div class="row" style="display: flex; justify-content: flex-start; align-items: center;">
                    <div class="col">
                    <div class="p-2 text-uppercase">
                        <h5>
                            {{currentSubject}}
                        </h5>
                        </div>
                    </div>
                    <div class="col">
                        <div class="p-2 text-uppercase">
                            <h5>
                                Term  : {{getNiceTerm}}
                            </h5>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-flex justify-content-center flex-row">
                            <div title="Change Current Term">
                                <select class="p-1 border-0 bg-light" v-model="userTerm">
                                    <option value='firstTerm'>First Term</option>
                                    <option value='secondTerm'>Second Term</option>
                                    <option value='thirdTerm'>Third Term</option>
                                </select>
                            </div>
                        </div>
                    </div>
                <div class="col">
                    <div class="d-flex justify-content-center flex-row" title="Preview">
                        <img class="img-fluid preview-img" src="img/preview.svg" @click="previewQuestion"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-1">
            </div>
        </div>
        <div class="row">
            <div class="col-md-1">
            </div>
            <div class="col-md-10 bg-light question-cont shadow">
                <div class="row">
                    <div class="col-md-4">
                        <div class="">
                            <div class="p-3 d-flex flex-column align-items-center justify-content-around flex-wrap">
                                <div>
                                    <h5> {{ isEdited ? 'Edit' : 'Add'}} Question </h5>
                                </div>
                                <div v-if="isEdited">
                                    <span @click="cancelEdit" class="btn-danger float-right p-1 rounded" title="Cancel Edit">
                                        Cancel 
                                    </span>
                                </div>
                        </div>
                    </div>
                        <div class="pl-md- p-4 p-md- ml-md-4" style="">
                            <form @submit.prevent="setQuestion">
                                <div class="form-group row">
                                    <textarea v-model="inputQuestion" class="col-md-12" rows="6"> </textarea>
                                </div>
                                <div class="form-group row">
                                    <div id='display'>
                                        
                                    </div>
                                    <p class="font-weight-bold"> Diagram If Any </p>
                                    <input class="h-50" style="width:100%" @change="getfile" ref="img" type="file" accept="image/*">
                                </div>
                                <div v-if="diagram.hasDiagram">

                                <div class="form-group row">
                                    <img :src="diagram.src" class="img-responsive img-fluid">

                                        <p class="font-weight-bold"> Diagram Location </p>

                                    <select v-model="diagram.position" class="h-25 p-2" style="width:100%">
                                        <option> Before Question </option>
                                        <option> After Question </option>

                                    </select>
                                </div>

                                </div>
                                <div class="form-group row">
                                    <p class="font-weight-bold d-block"> Add Options </p>
                                    <div class="input-group">
                                    <select style="width:20%;" class="input-group-prepend p-1 d-block">
                                        <option>A</option>
                                    </select>
                                    <textarea style="width:80% " v-model="options.a" type="text" class="input-group-append">
                                    </textarea>
                                    </div>
                                    </div>
                                    <div class="form-group row">

                                    <div class="input-group">
                                    <select style="width:20%" class="p-1 d-block input-group-prepend">
                                        <option>B</option>
                                    </select>
                                    <textarea style="width:80%" v-model="options.b" type="text" class="input-group-append">
                                    </textarea>
                                    </div>
                                    </div>
                                    <div class="form-group row">

                                    <div class="input-group">
                                    <select style="width:20%" class="p-1 d-block input-group-prepend">
                                        <option> C</option>
                                    </select>
                                    <textarea style="width:80% " v-model="options.c" type="text" class="input-group-append">
                                    </textarea>

                                    </div>
                                    </div>
                                    <div class="form-group row">

                                    <div class="input-group">
                                    <select style="width:20%" class="p-1 d-block input-group-prepend">
                                        <option>D</option>
                                    </select>
                                    <textarea style="width:80%" v-model="options.d" type="text" class="input-group-append">
                                    </textarea>

                                    </div>

                                </div>
                                    <p class="font-weight-bold"> Correct Answer </p>
                                <div class="form-group row">

                                    <div class="input-group">
                                    <select v-model="correctAns" style="width:100%" class="p-1 d-block input-group-prepend">
                                        <option value="a">A</option>
                                        <option value="b">B</option>
                                        <option value="c">C</option>
                                        <option value="d">D</option>

                                    </select>
                                    

                                    </div>

                                </div>
                                <div class="form-group row">

                                    <input style="width:100%" type="submit" class="d-block btn btn-darkcyan" :value="btn.btnValue">
                                </div>
                            </form>
                        </div>
                    </div>
                <div class="col-md-8">
                    <div class="">
                        <div style="width: 100%;" class="p-3 d-flex flex-row align-items-end justify-content-around flex-wrap">
                            <div>
                                <h5>
                                     Current Questions
                                </h5>
                            </div>
                            <div>
                            <div class="input-group" title="marks per question">
                                <div class="btn  btn-outline-info input-group-prepend text-uppercase">
                                    m/q
                                </div>
                                <input min="1" class="form-control" type="number" placeholder="marks per question" v-model="getMarks">
                                <button @click="setMarks" type="button" class="btn btn-darkcyan input-group-append">
                                    set
                                </button>
                            </div>
                            </div>
                            <div>
                                <button v-show="questions.length" @click="remove" data-type="all" class="btn-success float-right p-1 rounded" title="Remove All Students">
                                    remove all
                                </button>
                            </div>
                    </div>
                    <div class="p-4">
                        <div class="question-list-cont">
                        <ul class="list-unstyled question-list">
                            <li v-for="(title, i) in questions">
                                <div style="width: 100%;" class="row">
                                    <div class="count-h col-md-1" style="" align="left">
                                        <span class="badge badge-pill bg-info text-light">
                                            {{ i + 1 }} 
                                        </span>
                                    </div>

                                    <div class="title-h col-md-7">
                                        {{ title.question }} 
                                    </div>
                                    <div class="act-h col-md-4">
                                        <button :data-id="i + 1" @click="edit" class="btn-act bg-info border-0 text-light rounded" title="Edit This Question">edit</button>
                                        <button :data-id="i + 1" @click="remove" class="btn-act btn-success border-0 text-light rounded" title="Remove This Question"> remove </button>
                                    </div>
                                </div>
                            </li>
                            
                        </ul>
                        
                    </div>
                </div>
                    <br>
                </div>
            </div>
        </div>
        </div>
            <div class="col-md-1">
            </div>
        </div>
        
    </div>
    <br>
    </div>
    `
}