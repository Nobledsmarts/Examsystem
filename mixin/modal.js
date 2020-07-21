export default{
    methods : {
        dismissModal(cont){
            $(`.${cont}`).modal('hide');
        },
        showModal(cont, obj){
            obj = obj || {},
            $(`.${cont}`).modal(obj);
        },
    }
}