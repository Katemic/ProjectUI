
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
                
            ],
            testThing: null,
            advices: [
                "Øg ventilationen ved at åbne vinduer.",
                "Brug luftrensere med HEPA-filtre.",
                "Tilføj indendørs planter for at forbedre luftkvaliteten.",
                "Reducer brugen af stearinlys og røgelse.",
                "Undgå at ryge indendørs.",
                "Brug udsugningsventilatorer i køkkener og badeværelser.",
                "Vedligehold regelmæssigt HVAC-systemer.",
                "Begræns brugen af kemikaliebaserede rengøringsprodukter."
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
        getRowClass(value) {
            if (value > 1000) {
              return 'high-value';
            } else if (value > 500) {
              return 'medium-value';
            } else {
              return 'low-value';
            }
          },
          getRandomAdvice() {
            const randomIndex = Math.floor(Math.random() * this.advices.length);
            return this.advices[randomIndex];
        },

        getArrowDirection(index) {
            if (index === this.measurements.length - 1) return '→'; // Default arrow for the last row
            const currentCO2 = this.measurements[index].cO2;
            const nextCO2 = this.measurements[index + 1].cO2;
            if (currentCO2 < nextCO2) {
                return '↑';
            } else if (currentCO2 > nextCO2) {
                return '↓';
            } else {
                return '→';
            }
        }

    }


    
    
}).mount("#app") 