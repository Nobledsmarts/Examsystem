    import {db} from './db.js';
    import {store} from './store.js';
    import {routes} from './routes.js';

    localStorage.db = localStorage.db ? localStorage.db : (JSON.stringify(db) || JSON.stringify({}));
    
    const router = new VueRouter({
        routes,
    });
    new Vue({
        store,
        router,
        created(){
            this.$store.state.db = (JSON.parse(localStorage.db) || JSON.parse(db));
        },
    }).$mount('#app');
