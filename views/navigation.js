import modal from './../views/modal-component.js';
import modalMixin from './../mixin/modal.js';

export default {
    props : ['isAdmin'],
    components : {modal},
    mixins : [modalMixin],
    data (){
       return {
        modal : {
            options : {
                examEnd : {
                    backdrop : 'static'
                }
            },
            title : 'Notice',
            body : 'Do You Really Want To Logout?',
            size : '',
            classess : {
                ExamSubmit : 'ExamSubmit'
            }
        } 
       }
    },
    methods : {
        promptLogout(){
            this.showModal('logoutmodal');
        },
        logout(){
            sessionStorage.removeItem('__login');
            this.dismissModal('logoutmodal');
            this.$root.$router.push('/app');
        }
    },
    template : `
    <nav class="navbar navbar-expand-sm bg-light">
    <modal headerClass="bg-danger text-light" @dismissModal="dismissModal" modalClass="logoutmodal" :modal="modal" :showCancel="false">
            <template v-slot:cancelBtn>
                <button type="button" class="btn btn-darkcyan" data-dismiss="modal"> 
                    cancel
                </button>
            </template>
            <template v-slot:proceedBtn>
                <button type="button" class="btn btn-danger" @click="logout"> 
                    logout
                </button>
            </template>
       </modal>
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle navbar-toggler" data-toggle="collapse" data-target="#navcollapse">
                    <span class="navbar-toggler-icon">
                        hey
                    </span>
                </button>
                <h5 class="examcik navbar-brand">
                    <span style="background:white" class="p-1 rounded-left pill pl-2 p-1 ">
                        Exam
                    </span>
                    <span style="color:#f5f5f5; text-shadow:0px 1px 0px darkblue; background:darkcyan" class="pill pr-2 p-1 rounded-right">
                        <img src="img/book_2 - w.svg" style="height:20px; margin-top: -5px" class="img-responsive img-fluid">
                        Cixtem
                    </span>
                </h5>
            </div>
            <div v-if="isAdmin" class="d-sm-flex justify-content-sm-end align-items-sm-center collapse navbar-collapse" id="navcollapse">
                <ul class="nav navbar-nav navbar-right">
                    <li class="nav-item">
                        <router-link to="/app/admin/students/" tag="a" exact>
                            students
                        </router-link>
                    </li>
                    <li class="active nav-item">
                        <router-link to="/app/admin/" tag="a" exact>
                            subject
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/app/admin/settings/" tag="a" exact>
                            settings
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/app/admin/backup/db/" tag="a" exact>
                            backup
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <a @click.prevent="promptLogout" href="#log">
                            logout
                        </a>
                    </li>
                </ul>
                </div>
            

        </div>
    </nav>`
}