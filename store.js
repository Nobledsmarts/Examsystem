export const store = new Vuex.Store({
    state : {
        userReg : '1',
        schoolname : 'ExamCixtem',
        db : {},
    },
    getters : {
        term(state) { 
            let obj = {
                '1' : "firstTerm",
                '2' : "secondTerm",
                '3' : "thirdTerm",
            }
            return obj[state.db.settings.termId];
        },
        getSubjectByName(state) {
            return function(subject, getall){
                return getall ? state.db.subjects[this.subjectId(subject)] : state.db.subjects[this.subjectId(subject)]['term']
            }
        },
        getdb(state){
            return state.db;
        },
        subjectId(state, subject){
            let obj = state.db.subjects;
            return (subject) => {
                for(let i = 0; i < obj.length; i++){
                   if(obj[i].subject == subject.toLowerCase()){
                    return i;
                   } else {
                       continue;
                   }
                }
            }
            
        },
        getStudentsSetting(state){ return state.db.settings.students.perpage},
        termId(state) { return state.db.settings.termId },
        adminpass(state) { return state.db['_']['admin']['pass']},
        currentExam(state) { return state.db.settings.currentExam},
        subjects(state) { return state.db.subjects.map((el) => { return (el.subject) }); },
        subjectsObj(state) { return state.db.subjects },
        questions(state) { return state.db.subjects[this.getters.subjectId(state.currentExam.subject)]['term'][state.term]['questions']},
        formartDuration(state){
            let durationArr = state.db.settings.currentExam.duration.split(':');
            return ((+durationArr[0]) ? (durationArr[0] + 'hr : ' + durationArr[1] + 'min') : durationArr[1] + 'min'); 
        },
    },
    mutations : {
        updateReg(state, payload){
            state.userReg = payload;
        },
        AddQuestion(state, payload){
            state.db.subjects[this.getters.subjectId(payload.subject)]['term'][payload.term]['questions'].splice(payload.questionNo, payload.isEdited ? 1 : 0, payload.obj);
            this.commit('updateLocalStorage');

        },

        addSubject(state, payload){
            if(! payload.isValidEdit ){
                state.db.subjects[this.getters.subjects.length] = payload.obj;
            } else {
                if(this.getters.subjects.indexOf(payload.subject) >= 0){
                    state.db.subjects[this.getters.subjectId(payload.subject)]['options'] = payload.obj.options;
                } else if(payload.isEdit && (payload.oldsubjectname != payload.subject)) {
                    if(this.getters.subjects.indexOf(payload.oldsubjectname) >= 0){
                        state.db.subjects[this.getters.subjectId(payload.oldsubjectname)].subject = payload.subject;
                        state.db.subjects[this.getters.subjectId(payload.subject)]['options'] = payload.obj.options;
                    } else {
                        state.db.subjects[this.getters.subjects.length] = payload.obj;
                    }
                }
            }
            this.commit('updateLocalStorage');
            this.commit('updateStateDb');
        },
        addStudent(state, payload){
            state.db.users.reg.splice(payload.No, payload.isEdited ? 1 : 0, payload.obj);
            this.commit('updateLocalStorage');
        },
        uploadDbToLocalStorage(state, payload){
            localStorage.db = JSON.stringify(payload.db);
            this.commit('updateStateDb');
        },
        updateStateDb(state){
            state.db = JSON.parse(localStorage.db);
        },
        updateLocalStorage(state){
            localStorage.db = JSON.stringify(state.db);
        },
        deleteSubject(state, payload){
            if(this.getters.subjects.indexOf(payload.subject) >= 0){
                let subjectId = this.getters.subjectId(payload.subject);
                // console.log(state.db.subjects[this.getters.subjectId(payload.subject)]);
                state.db.subjects.splice(subjectId, 1);
                this.commit('updateLocalStorage');
                this.commit('updateStateDb');
            }
        },
        removeSubjectItem(state, payload){
            if(! payload.id ) {
                state.db.subjects[this.getters.subjectId(payload.subject)]['term'][payload.term]['questions'] = [];
            } else {
                state.db.subjects[this.getters.subjectId(payload.subject)]['term'][payload.term]['questions'].splice(payload.id - 1, 1);
            }
            this.commit('updateLocalStorage');
        },
        removeStudent(state, payload){
            state.db.users.reg.splice(payload.id, 1);
            this.commit('updateLocalStorage');
        },
        setCurrentExamData(state, payload){
            state.db.settings.currentExam = payload;
            this.commit('updateLocalStorage');
        },
        setMarks(state, payload){
            state.db.subjects[this.getters.subjectId(payload.subject)]['term'][payload.term].marks = payload.marks;
            this.commit('updateLocalStorage');
        },
        saveStudentsSetting(state, payload){
            // console.log(payload);
            // console.log(state.db.settings.students.perpage);
            // return
            state.db.settings.students.perpage = payload.studentsPerPage;
            this.commit('updateLocalStorage');
            this.commit('updateStateDb');
        }
       
    },
    actions : {
          
        saveStudentsSetting(context, payload){
            context.commit('saveStudentsSetting', payload);
        }, 
        uploadDbToLocalStorage(context, payload){
            context.commit('uploadDbToLocalStorage', payload);
        },
        removeStudent(context, payload){
            context.commit('removeStudent', payload);
            return {
                isSuccess : true,
            }
        },
        deleteSubject(context, payload){
            context.commit('deleteSubject', payload);
        },
        addSubject(context, payload){
            context.commit('addSubject', payload);
        },
        addStudent(context, payload){
            context.commit('addStudent', payload);
            return {
                isSuccess : true,
            }
        }, 
        startExam(context, payload){
            payload.vm.$router.push(payload.path);
        },
        setMarks(context, payload){
            context.commit('setMarks', payload);
            return {
                isSuccess : false,
            }
        },
        setCurrentExamData(context, payload){
            context.commit('setCurrentExamData', payload);
        },
        validateLogin(context, payload){
            if(payload.usertype == 'student'){
                let usersReg = Object.keys(this.state.db.users.reg);
                if( ! (usersReg.indexOf(payload.userReg) !== -1) ){
                    return {
                        isSuccess : false,
                        error : "Invalid Reg No"
                    }
                }
               
                let hasQuestion = !!Object.keys((this.state.db.subjects[this.getters.subjectId(this.state.db.settings.currentExam.subject)]['term'][this.getters.term]['questions'])).length;
                if(! hasQuestion){
                    return {
                        isSuccess : false,
                        error : "No Question has been set for this Subject, Login To Admin Panel to Set Question"
                    }
                }
                this.state.currentStudentsData = this.state.db.users.reg[payload.userReg];
                return {
                    isSuccess : true,
                    currentStudentsData : this.state.db.users.reg[payload.userReg]
                }

            } else if(payload.usertype == 'admin'){
                if( ! payload.password == this.getters.adminpass){
                    return {
                        isSuccess : false,
                        error : "Incorrect Password",
                    }
                } 
                return {
                    isSuccess : true,
                }                                     
            }
        }
    },
});