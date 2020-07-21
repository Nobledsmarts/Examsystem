import navigation from '../../views/navigation.js';
import subnavigation from '../../views/subnavigation.js';
import modal from '../../views/modal-component.js';
import modalMixin from '../../mixin/modal.js';
import adminCheck from '../../mixin/admin-check.js';


export default{
    components : {navigation, subnavigation, modal},
    mixins : [modalMixin, adminCheck],
    data(){
        return {
            isAdmin : null,
            isUpload : true,
            backupReady : false,
            backupName : "",
            dbfileObj : "",
            modal : {
                title : "",
                body : "",
                showBtn : true
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
        }
    },
    methods : {
        toggleCreate(){
            this.isUpload = false;
        },
        toggleUpload(){
            this.isUpload = true;
        },
        getFile(event){
            let fileR = new FileReader();
            fileR.onload = () => {
                this.dbfileObj = (JSON.parse(fileR.result));
            };
            fileR.readAsText(event.currentTarget.files[0]);
        },
        uploadBackup(){
            this.$store.dispatch('uploadDbToLocalStorage',{
                db : this.dbfileObj
            }).then(() => {
                this.modal.title = "NOTICE"
                this.modal.body = "Backup Has Been Uploaded Successfully!";
                this.showModal('backupmodal');
            });
        },
        generateBackup(){
            this.$refs.downloadlink.href = window.URL.createObjectURL(new Blob([localStorage.db], {
                type : "text/plain"
            }));
            this.$refs.downloadlink.setAttribute( 'download', (this.backupName ? this.backupName + '.txt' : '') || 'backup.txt' );
            this.backupReady = true;
        }
    },
    template : `
       <div> 
            <modal @dismissModal="dismissModal('modal')" :modal="modal" :showBtns="modal.showBtn"  :headerClass="'bg-info text-light'" modalClass="backupmodal">
            <template v-slot:cancelBtn>
                    <button type="button" class="btn btn-darkcyan" data-dismiss="modal"> 
                        Ok
                    </button>
                </template>   
            </modal>
            <navigation :isAdmin="isAdmin"></navigation>
            <br>
            <subnavigation></subnavigation>
            
            <div class="container-fluid">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-10 shadow bg-darkcyan text-light p-2">
                                <div class="">
                                    <div class="p-1 d-flex flex-row align-items-center justify-content-around flex-wrap">
                                        <div>
                                            <h5 class="text-uppercase"> {{isUpload ? 'Upload' : 'Create'}} Backup </h5>
                                        </div>
                                        <div>

                                            <button v-if="isUpload" class="btn btn-success text-uppercase" @click="toggleCreate"> Create </button>

                                            <button v-if="!isUpload" class="btn btn-success text-uppercase" @click="toggleUpload"> Upload </button>
                                        </div>
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
                                <div class="col-md-1">
                                </div>
                                    <div class="col-md-10">
                                        <div v-if="isUpload" class="p-4">
                                            <b> Backup </b> Lets You You Create Backup Of your stored data <br>
                                            Please Note that once you Upload A Backup it replaces your current stored data
                                            <br>
                                            <span class="text-success">
                                                Backup only works in browser environment
                                            </span>
                                            <br><br>
                                            <form @submit.prevent="uploadBackup">
                                                <div class="form-group">
                                                    <input @change="getFile" class="form-control-file" type="file" accept=".txt">
                                                </div>
                                                <div class="form-group">
                                                    <input class="col btn btn-darkcyan" type="submit" value="Upload Data">
                                                </div>
                                            </form>
                                        </div>
                                        <div v-else class="p-4">
                                            <b> Backup </b> Lets You You Create Backup Of your stored data <br>
                                            Please Note that once you Upload A Backup it replaces your current stored data
                                            <br>
                                            <span class="text-success">
                                                Backup only works in browser environment
                                            </span>
                                            <br><br>
                                            <form @submit.prevent="generateBackup" v-show="!backupReady">
                                                <div class="form-group">
                                                <div class="input-group">

                                                    <input v-model="backupName" class="input-group-prepend form-control" type="text" placeholder="Backup Name">
                                                    <button class="btn btn-outline-info input-group-append"> .txt </button>

                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <input class="btn col btn-darkcyan d-block" type="submit" value="Generate Backup">
                                            

                                                </div>

                                            </form>
                                            

                                        
                                            
                                            
                                            <div v-show="backupReady">
                                            <div align="center" class="p-2">
                                                <h6 align="">
                                                    Your File <b> {{backupName || 'backup'}}.txt </b> Is Ready! 
                                                    <img src="./img/file.svg" class="img-fluid" width="30px" height="30px">
                                                </h6> 
                                                Click The Button Below To Download
                                                </div>
                                                <div class="div-group">
                                                    <a ref="downloadlink" class="btn col btn-darkcyan text-light"> Download Backup
                                                    </a>
                                                </div>
                                            

                                                </div>
                                        
                                        

                                        </div>
                                        <br>

                                    </div>
                                    <div class="col-md-1">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-1">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    </div>
   `
}