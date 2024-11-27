Vue.createApp({
    data() {
        return {
            measurements: [],
            error: null,
            showFilter: false
            
        }
    },


    methods: {

        showFilterMenu() {
            if (this.showFilter == false || this.showFilter == "") {
                this.showFilter = true
            } else {
                this.showFilter = false
            }
        }
    }
}).mount("#app")