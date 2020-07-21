import modal from '../../views/modal-component.js';
import modalMixin from '../../mixin/modal.js';


export default {
    components : {modal},
    mixins : [modalMixin],
    data(){
        return {
            avatarsrc : 'img/avatar2.png',
            adminpass : '',
            isAnAdmin : false,
            errorMsg : '',
            modal : {
                title : 'HELLO',
                body : 'body goes here',
                modalClass : '',
                headerClass : '',
                showBtns : true,
            }
            }
    },
    computed : {
        disabled(){
            return this.isAnAdmin ? false : true;
        },
        schoolname(){
            return this.$store.state.schoolname
         },
        userRegNo : {
            set(value){
                this.$store.dispatch('checkReg', value);
            },
            get(){
                return this.userReg;
            }
        }
    },
    mounted(){
        this.$refs.password.focus();
    },
    watch : {
        adminpass(){
            if(this.$store.getters.adminpass == this.adminpass){
                this.isAnAdmin = true;
            } else {
                this.isAnAdmin = false;
            }
        }
    },
    methods : {
        validateLogin(){
            let vm = this.$root;
            let nextPath = '/app/admin/';

            this.$store.dispatch('validateLogin', {
                usertype : 'admin',
                password : this.adminpass,
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
                            isAdmin : true,
                        });
                        vm.$router.push(nextPath);
                    }
                }
            })
        },
    },
    template : `
    <div class="container-fluid full-bg">
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
    <div class="content-center">
         <div class="row">
             <div class="col-md-2"></div>   
             <div class="col-md-8">
             
                 <div align="center">
                 <br>
                 <h5 class="text-white"> Admin Login </h5>   
                 <br>
                     <img class="mb-3 mt-3 rounded-circle" v-bind:src="avatarsrc" style="width:150px; height:150px">
                     <form @submit.prevent='validateLogin' action="/confirmdetails.html">
                         <div class="form-group">
                         <span class="text-danger">{{ errorMsg }}</span>
                             <input v-model='adminpass' placeholder="Password" class="form-control" type="Password" ref="password">
                         </div>
                         <input :disabled='disabled' class="d-block col-12 btn btn-success" type="submit" value='submit'>
                     </form>
                 </div>
                 <br><br>
                 <div  align="center">
                 <small> <router-link to='teacher' class="text-dark"> Teacher login </router-link>
                  | login as principal | <router-link to='admin' class="text-dark"> Admin login </router-link> </small>
                 </div>
             </div>
             <div class="col-md-2"></div>   
         </div>
     </div>
 </div>`
}

