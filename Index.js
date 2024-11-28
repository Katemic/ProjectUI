const baseUrl = ""

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
        },
        getAllMeasurements() {
            this.getAllMeasurements(baseUrl)
        },
        getByLocation(text) {
            const url = baseUrl + "?location=" + text
            this.getMeasurements(url)
        },async getMeasurements(url) {
            try {
                const response = await axios.get(url)
                this.measurements = response.data
            } catch (ex) {
                alert(ex.message)
            }
        }

    }
}).mount("#app")