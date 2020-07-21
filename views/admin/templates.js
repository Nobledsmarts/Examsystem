import modal from '../../views/modal-component.js';
import modalMixin from '../../mixin/modal.js';


export const subjectlist = {
    props : ['subjects', 'getsubjects'],
    template : `<div class="sub row">
           <div v-for="(obj, subject, tt) in getsubjects" class="col-md-4">
                <router-link  :to='"/app/admin/subjects/" + obj.subject' tag='div' :style="obj.options.classess ? '' : obj.options.style" :class="obj.options.classes" class="p-1">
                <router-link :to="'/app/admin/newsubject/?edit=true&subject=' + obj.subject" tag="a" class="btn float-right btn-light">
                edit
                </router-link>
                    {{obj.subject}}
                    <br>
                    <div class="row">
                        <div class="col-md-12 " align='center'>
                            <img :src="obj.options.imgsrc">
                        </div>
                    </div>
                </router-link>
           </div>
        </div> 
        `
}
export const newSubject = {
    props : ['subjects'],
    components : {modal},
    mixins : [modalMixin],
    data(){
        return {
            subjectname : '',
            bgColor : '#008080',
            textColor : '#cccccc',
            imageColor : 'white',
            editedSubjectObj : '',
            modal : {
                title : '',
                body : '',
                modalClass : '',
                headerClass : '',
                showBtns : true,
            },
        }
    },
    created(){
        if(this.isValidEdit){
            this.subjectname = this.$root.$route.query.subject;
            this.editedSubjectObj = this.$store.getters.getSubjectByName(this.subjectname, true);
            this.imageColor =  this.editedSubjectObj.options.imgsrc == './img/book_2.svg' ? 'black' : 'white' ;
            this.bgColor = this.editedSubjectObj.options.style.background;
            this.textColor = this.editedSubjectObj.options.style.color;

        }
    },
    computed : {
        actText(){
            return this.isValidEdit ? 'edit' : 'add new'
        },
        getImgSrc(){
            return this.imageColor == 'white' ? './img/book_2 - w.svg' : './img/book_2.svg';
        },
        getsubjects(){
            return this.$store.getters.subjects;
        },
        getsubject(){
            return this.subjectname;
        },
        isEdit(){
            return !!Object.keys(this.$root.$route.query).length;
        },
        isValidSubject(){
            if(this.isEdit){
                return this.getsubjects.indexOf(this.$root.$route.query.subject) >= 0;
            }
            return false;
        },
        isValidEdit(){
            return this.isValidSubject && this.isEdit
        }
    },
    methods : {
        resetData(){
            this.subjectname = '';
            this.bgColor = '#008080';
            this.textColor = '#cccccc';
            this.imageColor = 'white';
            this.editedSubjectObj = '';
        },
        deleteSubject(){
            this.modal.headerClass = "";
            this.modal.title = "INFO",
            this.modal.body = "Do You Really Want To Delete Subject?",
            this.showModal('subjectDeleteModal');
        },
        deleteSubjectProceed(){
            this.dismissModal('subjectDeleteModal');
            this.$store.dispatch('deleteSubject', {
                subject : this.getsubject,
            }).then(() => {
                this.$root.$router.push('/app/admin/newsubject/');
                this.modal.headerClass = "";
                this.modal.title = "SUCCESS",
                this.modal.body = "deleted Succesfully",
                
                this.showModal('subjectaddmodal');
                this.resetData();
            })
        },
        addSubject(){
            this.$store.dispatch('addSubject', {
                subject : this.getsubject,
                isValidEdit : this.isEdit,
                isEdit : this.isEdit,
                oldsubjectname : this.$root.$route.query.subject,
                obj : {
                    subject : this.getsubject,
                    options : {
                        classes : ['col-md-12', 'shadow'],
                        imgsrc : this.getImgSrc,
                        style : {
                            background : this.bgColor,
                            color : this.textColor,
                        }
                    }
                }
            }).then(() => {
                this.modal.headerClass = "";
                this.modal.title = "success",
                this.modal.body = " Added Succesfully",
                this.showModal('subjectaddmodal');
                this.resetData();
            })
        }
    },
    template : `
    <div class="container"> 
    <modal @dismissModal="dismissModal('modal')" :modal="modal" :headerClass="'bg-info text-light'" modalClass="subjectaddmodal">
        <template v-slot:cancelBtn>
            <button type="button" class="btn btn-info" data-dismiss="modal"> 
                dismiss
            </button>
        </template>
   </modal>
   <modal @dismissModal="dismissModal('modal')" :modal="modal" :headerClass="'bg-info text-light'" modalClass="subjectDeleteModal">
        <template v-slot:proceedBtn>
        <button @click="deleteSubjectProceed" type="button" class="btn btn-danger" data-dismiss="modal"> 
            Delete
        </button>
        </template>
        <template v-slot:cancelBtn>
            <button type="button" class="btn btn-info" data-dismiss="modal"> 
                dismiss
            </button>
        </template>
   </modal>
    
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-1">
                </div>
                <div class="col-md-10 shadow bg-darkcyan text-light p-2">
                    <div class="">
                        <div class="p-1 d-flex flex-row align-items-center justify-content-around flex-wrap">
                            <div>
                                <h5 class="text-uppercase"> {{actText}} subject  </h5>
                            </div>
                            <div v-if="isEdit">
                                <button @click="deleteSubject" class="btn btn-success float-right"> delete subject </button> 
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
                            <div class="p-4">
                                <form @submit.prevent="addSubject">
                                    <div>
                                    <div class="form-group row">
                                        <p class="font-weight-bold"> Subject Name </p>
                                        <input v-model="subjectname" placeholder="Enter Subject Name" type="text" class="form-control">
                                    </div>

                                    <div class="form-group row">
                                        <p class="font-weight-bold"> Background Color </p>
                                       

                                        <input type="color" v-model="bgColor" class="form-control">
            
                                    </div>
                                    <div class="form-group row">
                                        <p class="font-weight-bold"> Text Color </p>
                                       

                                        <input type="color" v-model="textColor" class="form-control">
            
                                    </div>
                                    <div class="form-group row">
                                        <p class="font-weight-bold" style="display:block; width:100%">Image Color </p> <br>
                                        <div v-if="imageColor == 'black'" style="background : #c8cccc" class="col-md-5 mb-2 d-flex justify-content-center pt-5 pb-5 align-items-center">
                                            <img class="img-fluid" src="./img/book_2.svg">
                                        </div>
                                        <div v-if="imageColor == 'white'" style="background : #c8cccc" class="d-flex justify-content-center pt-5 pb-5 align-items-center col-md-5  mb-2">
                                        <img class="img-fluid" src="./img/book_2 - w.svg">
                                        </div>
                                        <select v-model="imageColor" class="form-control">
                                            <option> white </option>
                                            <option> black </option>
                                        </select>
                                    </div>
                                    </div>
                                    <div class="form-group row">
                                        <input style="width:100%" type="submit" class="d-block btn btn-darkcyan" :value="actText + ' subject'">
                                    </div>
                                </form>
                                <br><br>
                            </div>
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
        `
}


export const settings = {
    props : ['subjects'],
    components : {modal},
    mixins : [modalMixin],
    data(){
        return {
            hours : 0,
            minutes : 0,
            subject : '',
            studentPerPage : '',
            isStudentSettings : false,
            modal : {
                title : '',
                body : '',
                modalClass : '',
                headerClass : '',
                showBtns : true,
            },
        }
    },
    created(){
        let data = (this.$store.getters.currentExam);
        let  duration = data.duration.split(':');
        this.hours = +(duration[0]);
        this.minutes = +(duration[1]);
        this.subject = data.subject;
        this.studentPerPage = this.$store.getters.getStudentsSetting;
    },
    computed : {
        currentSubject(){

        },
        niceHours(){
           return this.hours ? (this.hours > 1 ? this.hours + 'hours' :  this.hours +  'hour') : "";
        },
        niceMinutes(){
           return this.minutes ? (this.minutes > 1 ? this.minutes + 'minutes' :  this.minutes +  'minute') : "";
        },
        duration(){
           return this.hours + ':' + (this.minutes < 10 ? '0' + this.minutes : this.minutes);
        }
    },
    methods : {
        setCurrentExamData(){
            if(!Number(this.minutes) && !Number(this.hours)){
                this.modal.title = "Error",
                this.modal.headerClass = "bg-danger text-light",
                this.modal.body = "Minutes Cant Be 0",
                this.showModal('examSettingModal');
                return;
            } 
            this.$store.dispatch('setCurrentExamData', {
                subject : this.subject,
                duration : this.duration,
            }).then(() => {
                this.modal.headerClass = "";
                this.modal.title = "success",
                this.modal.body = " Added Succesfully",
                this.showModal('examSettingModal');
            })
        },
        saveStudentsSetting(){
            this.$store.dispatch('saveStudentsSetting', {
                studentsPerPage : this.studentPerPage
            }).then(() => {
                this.modal.headerClass = "";
                this.modal.title = "success",
                this.modal.body = " Saved Succesfully",
                this.showModal('examSettingModal');
            })
        }
    },
    template : `
    <div class="container"> 
    <modal @dismissModal="dismissModal('modal')" :modal="modal" :headerClass="modal.headerClass" modalClass="examSettingModal">
        <template v-slot:cancelBtn>
            <button type="button" class="btn btn-info" data-dismiss="modal"> 
                dismiss
            </button>
        </template>
   </modal>
    
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-1">
                </div>
                <div class="col-md-10 shadow bg-darkcyan text-light p-2">
                    <div class="">
                        <div class="p-1 d-flex flex-row align-items-center justify-content-around flex-wrap">
                            <div>
                                <h5 class="text-uppercase"> {{isStudentSettings ? 'Students settings' : 'Set Todays Exam'}} </h5>
                            </div>
                            <div v-if="!isStudentSettings">
                                <button class="btn btn-success" @click="isStudentSettings = true"> students settings</button>
                            </div>
                            <div v-if="isStudentSettings">
                                <button class="btn btn-success" @click="isStudentSettings = false"> exam settings</button>
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
                            <div v-if="!isStudentSettings" class="p-4">
                                <form @submit.prevent="setCurrentExamData">
                                    <div>
                                    <div class="form-group row">
                                        <p class="font-weight-bold"> Choose Subject </p>
                                        <select v-model="subject" class="form-control">
                                            <option :value="subject.toLowerCase()" v-for="index , subject in subjects">
                                                {{subject}}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="form-group row">
                                        <p class="font-weight-bold"> Duration </p>
                                        <br>
                                        <b> : </b>
                                        <p>
                                            {{niceHours}}  {{niceMinutes}}
                                        </p>

                                        <div class="input-group">
                                        <select v-model="hours" class="input-group-prepend">
                                            <option> hours </option>
                                            <option> 0 </option>
                                            <option> 1 </option>
                                            <option> 2 </option>
                                            <option> 3 </option>
                                            <option> 4 </option>
                                            <option> 5 </option>
                                            <option> 6 </option>
                                        </select>
                                        <input type="range" max="59" v-model="minutes" min="0" placeholder="minutes" class="form-control input-group-append">
                                        </div>
                                    </div>
                                    </div>
                                    <div class="form-group row">
                                        <input style="width:100%" type="submit" class="d-block btn btn-darkcyan" value="Save Setting">
                                    </div>
                                </form>
                                <br><br>
                            </div>
                            <div v-else class="p-4">
                                <form @submit.prevent="setCurrentExamData">
                                    <div>
                                    <div class="form-group row">
                                        <p class="font-weight-bold"> Students Per Page </p>
                                        <input v-model="studentPerPage" class="form-control" type="number" placeholder="Number Of Students To Display Per Page">
                                    </div>
                                    </div>
                                    <div class="form-group row">
                                        <input @click="saveStudentsSetting" style="width:100%" type="submit" class="d-block btn btn-darkcyan" value="Save Setting">
                                    </div>
                                </form>
                                <br><br>
                            </div>
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
        `
}


export const students = {
    props : ['students', 'subjects'],
    components : {modal},
    mixins : [modalMixin],
    data(){
        return {
            isAddStudent : false,
            filterInput : "",
            searchfilter : "name",
            isEdited : false,
            modal : {
                title : 'HELLO',
                body : 'body goes here',
                modalClass : '',
                headerClass : '',
                showBtns : true,
            },
            removeId : "",
            EditedNo : "",
            newStudent : {
                firstname : "",
                middlename : "",
                lastname : "",
                gender : "",
                age : "",
                subjects : [],
            }
        }
    },
    computed : {
        currentPage(){
            let query = this.$root.$route.query;
            return Object.keys(query).length ? query.page : 1;
        },
        totalStudents(){
            return this.students.reg.length;
        },
        allStudents(){
             if(! this.filterInput ) return (this.students.reg.slice((this.currentPage == 1 ? this.currentPage - 1 : (this.currentPage - 1) * this.limit ), )).slice(0, this.limit)
             
             return ([...this.students.reg].filter((el) => {
                if( this.searchfilter != 'subjects'){
                   return el[this.searchfilter].toLowerCase().indexOf(this.filterInput.toLowerCase()) != -1;
                } else if(this.searchfilter == 'subjects') {
                    return el.subjects.filter((subject) => {
                        return (subject.indexOf(this.filterInput.toLowerCase()) != -1);
                    }).length;
                }
             }).slice((this.currentPage == 1 ? this.currentPage - 1 : (this.currentPage - 1) * this.limit ), )).slice(0, this.limit).slice(0, this.limit);

        },
        newStudentsFullname(){
            return this.newStudent.firstname + " " + this.newStudent.middlename + " " + this.newStudent.lastname;
        },
        pages(){
            return this.get_page_num(this.totalStudents, this.limit);
        }
    },
    created(){
        this.limit = this.$store.getters.getStudentsSetting;
    },
    methods : {
        toggleAddForm(){
            this.isAddStudent = true;
        },
        editStudent(event){
            this.isAddStudent = true;
            this.isEdited = true;
            this.EditedNo = event.currentTarget.dataset.id;
            let data = (this.$store.state.db.users.reg[event.currentTarget.dataset.id]);
            Object.keys(data).forEach((el)=>{
                this.newStudent[el] = data[el];
            })
        },
        removeStudent(event){
            this.removeId = event.currentTarget.dataset.id;
            this.modal.title = "Notice";
            this.modal.body = "Do you really want to remove student?"
            this.modal.showBtns = true;
            this.showModal('removeModal');
        },
        checkInputs(){
            let hasEmptyInput = Object.keys(this.newStudent).some((el)=>{
                return this.newStudent[el] == ""
            });
            if(hasEmptyInput){
                this.modal.headerClass = "bg-danger text-light";
                this.modal.title = "Notice";
                this.modal.body = "Inputs Cant Be Empty!";
                this.modal.showBtns = false;
                this.showModal('errorModal');
            } else {
                this.storeData();
            }
        },
        get_page_num(total, limit){
            let i = 0,
            arr = [];
            if(total > limit && limit > 0){
                while(total > limit){
                    total = total - limit;
                    i++;
                }
                for(let counter = 1; counter <= i + 1; ++counter){
                    arr[arr.length] = counter;
                }
                return arr;
            } else {
                return [];
            }
        },
        storeData(){
            this.$store.dispatch('addStudent', {
                No : this.isEdited ? this.EditedNo : this.$store.state.db.users.reg.length,
                isEdited : this.isEdited,
                obj : {
                    name : this.newStudentsFullname,
                    firstname : this.newStudent.firstname,
                    middlename : this.newStudent.middlename,
                    lastname : this.newStudent.lastname,
                    age : this.newStudent.age,
                    subjects : this.newStudent.subjects,
                    gender : this.newStudent.gender
                }
            }).then((obj) =>{
                if(obj.isSuccess){
                    this.isEdited = false;
                    this.EditedNo = "";
                    this.isAddStudent = false;
                    this.clearStudentData();
                }
            })
        },
        clearStudentData(){
            // Object.keys(this.newStudent).forEach((el) => {
            //     this.newStudent[el] = (typeof this.newStudent[el] == 'string' ? "" : []);
            // });
            this.newStudent = {
                firstname : "",
                middlename : "",
                lastname : "",
                gender : "",
                age : "",
                subjects : [],
            }
        },
        removeProceed(event){
            let studentId = this.removeId;
            this.$store.dispatch('removeStudent', {
                id : studentId
            }).then(() => {
                this.dismissModal('removeModal');
                this.removeId = "";
            })

            
        },
    },
    template : `
    <div class="container">
        <modal @dismissModal="dismissModal('modal')" :showBtns="modal.showBtns" :modal="modal" :headerClass="modal.headerClass"  ref="modalc" modalClass="removeModal">
        <template v-slot:cancelBtn>
            <button type="button" class="btn btn-info" data-dismiss="modal" @click="removeId = ''"> 
                cancel
            </button>
        </template>
        <template v-slot:proceedBtn>
            <button type="button" class="btn btn-danger" @click="removeProceed"> 
                remove
            </button>
        </template>
   </modal>
   <modal @dismissModal="dismissModal('modal')" :showBtns="modal.showBtns" :modal="modal" :headerClass="modal.headerClass"  ref="modalc" modalClass="errorModal">
        <template v-slot:cancelBtn>
            <button type="button" class="btn btn-info" data-dismiss="modal" @click="removeId = ''"> 
                cancel
            </button>
        </template>
        <template v-slot:proceedBtn>
            <button type="button" class="btn btn-danger" @click="removeProceed"> 
                remove
            </button>
        </template>
   </modal>
    
    <div class="col-md-12">
            <div class="row">
                <div class="col-md-1">
                </div>
                <div class="col-md-10 shadow bg-darkcyan text-light p-2">
                    <div class="">
                        <div class="p-1 d-flex flex-row align-items-center justify-content-around flex-wrap">
                        <div>
                        <h5 class="text-uppercase"> Students </h5>
                    </div>
                    <div v-if="isAddStudent">
                        <button class="btn btn-success" @click="isAddStudent = false; isEdited = false"> cancel </button>
                    </div>
                    <div v-else>
                        <button class="btn btn-success" @click="toggleAddForm"> Add New </button>
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
                    <div class="p-4" align="center">
                        <div v-if="isAddStudent">
                            <form>
                                <div class="form-group">
                                    <div class="clearfix">
                                        <label class="float-left">
                                            First Name
                                        </label>
                                    </div>
                                    <div class="input-group">
                                        <input v-model="newStudent.firstname" type="text" class="form-control input-group-append" placeholder="Students First Name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="clearfix">
                                        <label class="float-left">

                                            Middle Name
                                        </label>
                                    </div>
                                    <div class="input-group">
                                        
                                        <input v-model="newStudent.middlename" type="text" class="form-control input-group-append" placeholder="Students Middle Name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="clearfix">
                                        <label class="float-left">
                                            Last Name
                                        </label>
                                    </div>
                                    <div class="input-group">
                                        <input v-model="newStudent.lastname" type="text" class="form-control input-group-append" placeholder="Students Last Name">
                                    </div>
                                </div>
                                <div class="form-group">
                                        <div class="clearfix">
                                            <label class="float-left">
                                                Gender
                                            </label>
                                        </div>
                                        <div class="input-group">
                                            <select v-model="newStudent.gender" class="form-control">
                                                <option value="male">
                                                    Male
                                                </option>
                                                <option value="female">
                                                    Female
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                <div class="form-group">
                                    <div class="clearfix">
                                        <label class="float-left">
                                            Age
                                        </label>
                                    </div>
                                    <div class="input-group">
                                        <input v-model="newStudent.age" type="number" class="form-control input-group-append" placeholder="Students Age">
                                    </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="clearfix">
                                            <label class="float-left">
                                                Subjects
                                            </label>
                                        </div>
                                        <div class="input-group">
                                            <select v-model="newStudent.subjects" multiple class="form-control">
                                                <option :value="key.toLowerCase()" v-for="obj, key in subjects">
                                                    {{key}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                            </form>
                            <button type="button" @click="checkInputs" class="d-block col-12 btn-darkcyan text-light btn-outline-success p-2">
                            {{ isEdited ? 'Edit Student' : 'Register New  Student' }}
                        </button>
                        <br>
                        </div>
                        <div v-if="!isAddStudent">
                            <form>
                                <div class="form-group">
                                <div class="input-group">
                                    
                                    <input v-model="filterInput" type="text" class="form-control input-group-prepend" placeholder="Search By Name">
                                    
                                    <select v-model="searchfilter" class="">
                                        <option disabled>Filter By</option>
                                        <option value="name">Name</option>
                                        <option value="gender">Gender</option>
                                        <option value="age">Age</option>
                                        <option value="subjects">Subjects</option>
                                    </select>
                                        
                                    <button class="input-group-append btn-success btn text-light">
                                        Search
                                    </button>
                                    </div>
                                </div>

                            </form>
                        <div class="table-responsive" align="center">
                            <table class="table-striped table table-bordered table-hover table-responsive" align="center">
                                <thead class="">
                                    <tr>
                                        <th> Name </th>
                                        <th> Gender </th>
                                        <th> Age </th>
                                        <th> subjects </th>
                                        <th> Edit </th>
                                        <th> Remove </th>
                                    </tr>
                                </thead>
                                <tbody v-if="allStudents.length" class="list-unstyled h-25 p-2" style="width:100%">
                                    <tr v-for="(studentsData, i) in allStudents">
                                        <td>
                                            {{studentsData.name}}
                                        </td>
                                        <td>
                                            {{studentsData.gender}}
                                        </td>
                                        <td>
                                            {{studentsData.age}}
                                        </td>
                                        <td>
                                            {{studentsData.subjects.join(', ')}}
                                        </td>
                                        <td>
                                        <button :data-id="i" @click="editStudent" class="btn btn-info">Edit</button>
                                        </td>
                                        <td>
                                        <button :data-id="i" @click="removeStudent" class="btn btn-success">Remove</button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else="allStudents.length">
                                    <tr>
                                        <td> No Records Found  </td>
                                        <td> No Records Found  </td>
                                        <td> No Records Found  </td>
                                        <td> No Records Found  </td>
                                        <td>
                                            <button disabled class="btn btn-info">Edit</button>
                                        </td>
                                        <td>  
                                            <button disabled class="btn btn-success">Remove</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button v-if="false" type="button" @click="toggleAddForm" class="d-block col-12 btn-darkcyan text-light  p-2">
                            Add New  Student
                        </button>
                        <br>
                        <div v-if="pages.length">
                            <ul class="pagination" id="pgn">
                                <li v-for="i in pages" class="pagination-item">
                                    <router-link :to="'?page=' + i" tag="a" class="page-link" :disabled="currentPage == i ? true : false" :data-id="i" :class="currentPage == i ? 'active' : ''">
                                        {{i}}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    
                        </div>
                        <br><br>
                    </div>
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
        `
}