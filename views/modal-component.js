export default {
    props : {
        modal : Object,
        showBtns : {
            type : Boolean,
            default : true,
        },
        modalClass : String,
        showCancel : {
            type : Boolean,
            default : true,
        },
        headerClass : String,
        size : {
            type : String,
            default : 'modal-md',
        }
    },
    computed:{
        showBtn(){
            return this.showCancel == 'true' ? true : false;
        },
        class(){
            return this.modalClass;
        }
    },
    methods : {
        dismissModal(){
            this.$emit('dismissModal', this.modalClass);
        }
    },
    template : `
        <div :class="modalClass" class="modal fade" role="dialog">
            <div :class="size" class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div :class="headerClass" class="modal-header text-center">
                        <h4 class="modal-title" v-html="modal.title">
                        </h4>
                        <!-- {{modal}} -->
                        <button v-if="showCancel" type="button" class="close" @click="dismissModal"> 
                                &times;
                        </button>
                    </div>
                    <div  class="modal-body">
                        <div v-html="modal.body"></div>
                    </div>
                    
                    <div v-if="showBtns" class="modal-footer d-flex align-items-center justify-content-between">
                        <div>
                            <slot name="proceedBtn"></slot>
                        </div>
                        <div>
                            <slot name="cancelBtn"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}