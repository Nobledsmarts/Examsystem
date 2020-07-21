export default{
    data(){
        return {
            isAdmin : null,
        }
    },
    created(){
        let loggedData = sessionStorage.__login ? JSON.parse(sessionStorage.__login) : {isLoggedIn : false, isAdmin : false};
        this.isAdmin = loggedData.isAdmin;
    },
    beforeRouteEnter(to, from, next){
        let loggedData = sessionStorage.__login ? JSON.parse(sessionStorage.__login) : {isLoggedIn : false};
        if((!loggedData.isLoggedIn)){
            next({path : '/app'});
        } else if((to.path.indexOf('admin') >= 0) && !loggedData.isAdmin){
            next({path : '/app'});
        }
        next();
    },
}