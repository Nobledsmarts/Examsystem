import navigation from '../../views/navigation.js';
import subnavigation from '../../views/subnavigation.js';
import modal from '../../views/modal-component.js';
import modalMixin from '../../mixin/modal.js';
import adminCheck from '../../mixin/admin-check.js';


export default {
    components : {navigation, modal, subnavigation},
    mixins : [modalMixin, adminCheck],
    data(){
        return {
            db : {},
            subjects : {
                Chemistry : {
                    classes : ['col-md-12', 'bg-danger', 'shadow'],
                    imgsrc : './img/book_2.svg',
                },
                Physics : {
                    classes : ['col-md-12', 'bg-info', 'shadow'],
                    imgsrc : './img/book_2.svg',
                },
                Maths : {
                    classes : ['col-md-12', 'text-black-50', 'bg-light', 'shadow'],
                    imgsrc : './img/book_2.svg',
                },
                English : {
                    classes : ['col-md-12', 'bg-dark', 'shadow'],
                    imgsrc : './img/book_2 - w.svg',
                },
                Geography : {
                    classes : ['col-md-12', 'bg-secondary', 'shadow'],
                    imgsrc : './img/book_2 - w.svg',
                },
                Biology : {
                    classes : ['col-md-12', 'bg-brown', 'shadow'],
                    imgsrc : './img/book_2 - w.svg',
                },
                Civic : {
                    classes : ['col-md-12', 'bg-warning', 'shadow'],
                    imgsrc : './img/book_2.svg',
                },
                Agric : {
                    classes : ['col-md-12', 'bg-success', 'shadow'],
                    imgsrc : './img/book_2.svg',
                },
                Economics : {
                    classes : ['col-md-12', 'bg-teal', 'shadow'],
                    imgsrc : './img/book_2 - w.svg',
                },
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
            this.db = this.$store.state.db;
        }
    },
    methods : {
        addSubject(){
            let subject = "";
            let obj =  {
                subject,
                options : {
                    firstTerm : {
                        questions : [],
                        marks : 1,
                    },
                    secondTerm : {
                        questions : [],
                        marks : 1,
                    },
                    thirdTerm : {
                        questions : [],
                        marks : 1,
                    },
                }
            };
        },
        // backlink(){
        //     if(this.$root.$route.path == '/app/admin/'){
        //         this.$root.$router.push('/app/admin/newsubject/');
        //     } else {
        //         this.$root.$router.go(-1);
        //     }
        // }
    },
    computed : {
        getsubjects(){
            return this.$store.getters.subjectsObj;
        },
        // btnText(){
        //     return this.$root.$route.path == '/app/admin/' ? "Add New Subject" : "Go Back";
        // },
        isNewSubject(){
            this.$root.$route.path.indexOf('newsubject') >= 0;
        },
        schoolname(){
            return this.$store.state.schoolname
         },
    },
    template : `
        <div>  
            <navigation :isAdmin="isAdmin"></navigation>
            <br>
            <subnavigation></subnavigation>
            <div class="container-fluid">
                <router-view :getsubjects="getsubjects" :subjects="subjects" :students="db.users"></router-view>
            </div>
            <br><br>
        </div>
    `
}