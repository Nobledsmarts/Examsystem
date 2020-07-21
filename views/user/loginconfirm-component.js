export default {
    data(){
        return {
            currentStudentsData : {
                name : ''
            },
            todaysSubject : '',
            duration : '',
            formartDuration : '',
        }
    },
    computed : {
        getCurrentStudentsData : {
            get(){
                return this.$store.state.currentStudentsData;
            },
            set(value){
                this.currentStudentsData = value;
            }
        },
        getTodaysSubject : {
            get(){
                return this.$store.state.db.settings.currentExam['subject'];
            },
            set(value){
                this.todaysSubject = value;
            }
        },
        getDuration : {
            get(){
                return this.$store.state.db.settings.currentExam['duration'];
            },
            set(value){
                this.duration = value;
            }
        },
        getFormartDuration : {
            get(){
                return this.$store.getters.formartDuration;
            },
            set(value){
                this.formartDuration = value;
            }
        }  
    },
    created(){
        let loggedData = sessionStorage.__login ? JSON.parse(sessionStorage.__login) : {};
        this.currentStudentsData = loggedData.currentStudentsData;
        let isTheSame;
        let storedData = sessionStorage.proceedData ? JSON.parse(sessionStorage.proceedData) : {};
        let storedDataArr = Object.keys(storedData);
        if(storedDataArr.length && Object.keys(this.currentStudentsData).length){
            isTheSame = Object.keys(storedData.getCurrentStudentsData).every((el) => {
                let data1 = storedData.getCurrentStudentsData[el];
                let data2 = this.currentStudentsData[el];
                return el == 'subjects' ? this.compare(data1, data2) : (data1 == data2);
            })
            if(! isTheSame ){
                this.storeSession();
            } 
        } else {
            if(sessionStorage.proceedData){
                let data = JSON.parse(sessionStorage.proceedData);
                this.formartDuration = data.getFormartDuration;
                this.duration = data.getDuration;
                this.todaysSubject = data.getTodaysSubject;
                this.currentStudentsData = data.getCurrentStudentsData;
            } else {
                this.storeSession();
            }
        }
    },
    methods : {
        compare(arr1, arr2){
            return arr1.every((el, i) => {
                return el == arr2[i];
            });
        },
        storeSession(){
            sessionStorage.proceedData = JSON.stringify({
                getFormartDuration : this.getFormartDuration,
                getDuration : this.getDuration,
                getCurrentStudentsData : this.currentStudentsData,
                getTodaysSubject : this.getTodaysSubject,
            });
        },
        startExam(){
            if(sessionStorage.finished){
                sessionStorage.removeItem('finished');
            };
            this.$store.dispatch('startExam', {
                vm : this.$root,
                path : '/app/user/exam'
            })
            
        }
    },
    beforeRouteEnter(to, from, next){
        let loggedData = sessionStorage.__login ? JSON.parse(sessionStorage.__login) : {isLoggedIn : false};
        if(! loggedData.isLoggedIn ){
            next({path : '/'});
        }
        next();   
    },
    template : `
    <div class="container-fluid full-bg">
    <div class="row">
        <div class="col">
        <h3 class="examcik">
            <span style="background:white" class="p-1 rounded-left pill pl-2 p-1 ">
                Exam
            </span>
            <span style="color:#f5f5f5; text-shadow:0px 1px 0px darkblue; background:darkcyan" class="pill pr-2 p-1 rounded-right">
            <img src="img/book_2 - w.svg" style="height:20px; margin-top: -5px" class="img-responsive img-fluid">
            Cixtem
        </span> </h3>
     </div>
    </div>
    <div class="content-center">
         <div class="row">
             <div class="col-md-2"></div>   
             <div class="col-md-8">   
                 <div align="center">
                     <img class="mb-3 mt-3 rounded-circle" src="img/avatar2.png" style="width:150px; height:150px">
                     <table class="table table-striped table-bordered table-hover text-light" style="">
                         <tbody>
                             <tr>
                                 <td> Name </td> <td> {{ currentStudentsData['name'] }} </td>
                             </tr>
                             <tr>
                                 <td> subject </td> <td> {{todaysSubject || getTodaysSubject}} </td>
                             </tr>
                             <tr>
                                 <td>exam duration </td> <td> {{formartDuration || getFormartDuration}} </td>
                             </tr>
                         </tbody>
                     </table>
                     
                     <input @click='startExam' class="d-block col-12 btn btn-success text-light" type="submit" value='start exam'>

                 </div>
                 <br><br>
                 <div  align="center">
                 <small> not my account? click here </small>
                 </div>
             </div>
             <div class="col-md-2"></div>   
         </div>
     </div>
 </div>
    `
}
