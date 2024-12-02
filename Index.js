
const baseUrl = "https://airqualityrest20241202114729.azurewebsites.net/api/AirQualities"

Vue.createApp({
    data() {
        return {
            measurements: [],
            error: null,
            showFilter: false,
            newestMeasurement : null,
        }
    },

    async created() {
        this.getAllMeasurements()
        
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
            this.getMeasurements(baseUrl)
        },

        getByLocation(text) {
            const url = baseUrl + "?location=" + text
            this.getMeasurements(url)
        },

        async getMeasurements(url) {
            try {
                const response = await axios.get(url)
                this.measurements = response.data
            } catch (ex) {
                alert(ex.message)
            }
        },

        async getNewestMeasurement() {
            try {
                const response = await axios.get(baseUrl+"/last")
                this.newestMeasurement = response.data
            }
            catch(ex) {
                alert(ex.message)
            }
            
        },
    }



    
}).mount("#app")