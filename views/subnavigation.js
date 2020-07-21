export default {
    computed : {
        btnText(){
            return this.$root.$route.path == '/app/admin/' ? "Add New Subject" : "Go Back";
        },
    },
    methods : {
        backlink(){
            if(this.$root.$route.path == '/app/admin/'){
                this.$root.$router.push('/app/admin/newsubject/');
            } else {
                this.$root.$router.go(-1);
            }
        }
    },
    template : `
        <div class="container-fluid">
            <div class="row">               
                <div class="col-md-12" style="border:1px solid #fff; background-color: #fff;">
                    <a @click="backlink" class="btn text-light btn-darkcyan">
                        {{btnText}}
                    </a>
                </div>
            </div>
            <br>
        </div>
    `
}