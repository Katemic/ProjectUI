
const baseUrl = "https://airqualityrest20241202114729.azurewebsites.net/api/AirQualities"
//const baseUrl = "http://localhost:5041/api/AirQualities"


Vue.createApp({
    data() {
        return {
            measurements: [],
            error: null,
            showFilter: false,
            newestMeasurement : null,
            selectedOption: null,
            options: [
                {name: 'Graf'},
                {name: 'Best and worst'}
                
            ]
        }
    },

    async created() {
        
        this.getAllMeasurements()
        //this.getNewestMeasurement()
        //this.getNewestMeasurement()

        console.log("Created has been called")
        
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
                const response2 = await axios.get(baseUrl+"/last")
                this.newestMeasurement = response2.data

            } catch (ex) {
                alert(ex.message)
            }
        },

        formatTime(timeString) {
            const date = new Date(timeString);
            return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
          },

          formatDate(timeString) {
            const date = new Date(timeString);
            return date.toLocaleDateString('en-GB');
          },

        async getNewestMeasurement() {
            try {
                console.log(this.newestMeasurement)
                const response = await axios.get("http://localhost:5041/api/AirQualities/last")
                console.log(this.newestMeasurement)
                this.newestMeasurement = response.data
                console.log(this.newestMeasurement)
            }
            catch(ex) {
                alert(ex.message)
            }
            
        },
    }


    
    
}).mount("#app") 