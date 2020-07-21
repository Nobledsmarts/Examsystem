import modal from '../../views/modal-component.js';
import modalMixin from '../../mixin/modal.js';

export default  {
    components : {modal} ,
    mixins : [modalMixin],
    data(){
        return {
            userReg : "0",
            avatarsrc : 'img/avatar2.png',
            modal : {
                title : 'HELLO',
                body : 'body goes here',
                modalClass : '',
                headerClass : '',
                showBtns : true,
            },
            backup : ""
        }
    },
    computed : {
        subjects(){
            return this.$store.getters.subjects;
        },
        todaysSubject(){
            return this.$store.state.db.settings.currentExam['subject'];
        },
        
        schoolname(){
           return this.$store.state.schoolname
        },
    },
    methods : {
        validateLogin(){
            let vm = this.$root;
            let nextPath = '/app/user/login/confirm';
            this.$store.dispatch('validateLogin', {
                usertype : 'student',
                userReg : this.userReg,
            }).then((obj) => {
                if(obj){
                    if( !obj.isSuccess ){
                        this.modal.headerClass = 'bg-danger text-light';
                        this.modal.title = 'Error';
                        this.modal.body = obj.error;
                        this.modal.showBtns = false;
                        this.showModal('modal');
                    } else {
                        sessionStorage.__login = JSON.stringify({
                            isLoggedIn : true,
                            isAdmin : false,
                            currentStudentsData : obj.currentStudentsData,
                        });
                        vm.$router.push(nextPath);
                    }
                }
            })
        },
    },
    template : `
    
    <div class="container-fluid full-bg">
    <a :href="backup" ref="downloadlink"></a>
        <modal @dismissModal="dismissModal('modal')" :showBtns="modal.showBtns" :modal="modal" :headerClass="modal.headerClass"  ref="modalc">
        <template v-slot:cancelBtn>
            <button type="button" class="btn btn-info" data-dismiss="modal"> 
                cancel
            </button>
        </template>
        <template v-slot:proceedBtn>
            <button type="button" class="btn btn-danger" @click=""> 
                delete
            </button>
        </template>
       </modal>
        <div class="row" style="">
            <div class="col">
                <h3 class="examcik">
                    <span style="background:white" class="p-1 rounded-left pill pl-2 p-1 ">
                        Exam
                    </span>
                    <span style="color:#f5f5f5; text-shadow:0px 1px 0px darkblue; background:darkcyan" class="pill pr-2 p-1 rounded-right">
                        <img src="img/book_2 - w.svg" style="height:20px; margin-top: -5px" class="img-responsive img-fluid">
                        Cixtem
                    </span>
                </h3>
            </div>
        </div>
        <div class="content-center" style=""> 
            
            <div class="row">
                <div class="col-md-2"></div>   
                <div class="col-md-8">   
                    <div align="center">
                        <img class="mb-3 mt-3 rounded-circle" :src="avatarsrc" style="width:150px; height:150px">
                        <form @submit.prevent='validateLogin' action="/confirmdetails.html">
                            <div class="form-group">
                                <input v-model='userReg' placeholder="Reg Number" class="form-control" type="text">
                            </div>
                            <div class="form-group">
                            <select v-model="todaysSubject" class="form-control">
                                <option>
                                {{ todaysSubject }}
                                </option>
                                <option v-for="subject of subjects" v-if="subject != todaysSubject" disabled>
                                    {{ subject }}
                                </option>
                            </select>
                            </div>
                            <div class="form-group">
                                <select class="form-control">
                                    <option>SS3</option>
                                </select>
                            </div>
                            <input class="d-block col-12 btn btn-success" type="submit" value='submit'>
                        </form>
                    </div>
                    <br><br>
                <div  align="center">
                    <small>
                        <router-link to='login/teacher' class="text-dark">
                            Teacher login
                        </router-link>
                        | login as principal |
                        <router-link to='/app/admin/login' class="text-dark">
                            Admin login
                        </router-link>
                    </small>
                </div>
            </div>
                <div class="col-md-2"></div>   
            </div>
        </div>
    </div>`
}

