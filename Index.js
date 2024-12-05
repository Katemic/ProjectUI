
const baseUrl = "https://airqualityrest20241202114729.azurewebsites.net/api/AirQualities"
//const baseUrl = "http://localhost:5041/api/AirQualities"
const baseUrl3Party = "https://emojihub.yurace.pro/api/random/group/"


Vue.createApp({
    data() {
        return {
            measurements: [],
            error: null,
            showFilter: false,
            newestMeasurement : null,
            selectedOption: null,
            fromDate: '',
            toDate: '',
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
              ],

              emoji: null,

              //pagination
              filteredMeasurements: [],
              currentPage: 1,
              itemsPerPage: 24

        }
    },

    async created() {
        
        this.getAllMeasurements()
        //this.getNewestMeasurement()
        //this.getNewestMeasurement()
        //await this.getAllMeasurement2()

        //this.renderChart();
        console.log("Created has been called")
        
    },

    computed: {
        totalPages() {
            return Math.ceil(this.filteredMeasurements.length / this.itemsPerPage);
        },
        paginatedMeasurements() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredMeasurements.slice(start, end);
        }
    },

    methods: {

        // async getAllMeasurement2() {
        //     try {
        //         console.log('Fetching measurements...');
        //         const response = await axios.get(baseUrl);
        //         this.measurements = response.data.slice(0, 20).reverse(); // Get the 20 newest measurements
        //         this.newestMeasurement = this.measurements[this.measurements.length - 1];
        //         console.log('Measurements fetched:', this.measurements);
        //     } catch (ex) {
        //         console.error('Error fetching measurements:', ex.message);
        //         alert(ex.message);
        //     }
        // },





        showFilterMenu() {
            // if (this.showFilter == false || this.showFilter == "") {
            //     this.showFilter = true
            // } else {
            //     this.showFilter = false
            // }
            this.showFilter = !this.showFilter;
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
                this.filteredMeasurements = this.measurements;
                const response2 = await axios.get(baseUrl+"/last")
                this.newestMeasurement = response2.data
                this.getEmoji(this.newestMeasurement.cO2)

            } catch (ex) {
                alert(ex.message)
            }
        },

        async getEmoji(value){
            try{
                
                let url = baseUrl3Party
                if(value <= 1000){
                    url += "face-positive"
                }
                else
                {
                    url += "face-negative"
                }
                console.log(url)
                const response = await axios.get(url)
                this.emoji = response.data.htmlCode
                console.log(this.emoji)
            }
            catch(ex){
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
                //^
            } else if (currentCO2 > nextCO2) {
                return '↓';
                //⌄
            } else {
                return '→';
                //-
            }
        },

        renderChart() {
            console.log('Rendering chart...');
            const ctx = document.getElementById('co2Chart').getContext('2d');
            console.log('Rendering chart...');
            const labels = this.measurements.map(m => this.formatTime(m.time));
            const data = this.measurements.map(m => m.cO2);

            console.log('Labels:', labels);
            console.log('Data:', data);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'CO2 Levels',
                        data: data,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'CO2 Levels'
                            }
                        }
                    }
                }
            });
        },

        async filterMeasurements() {
           let url = baseUrl;
            const params = [];

            if (this.fromDate) {
                params.push(`dateTimeLower=${(this.fromDate)}`);
            }
            if (this.toDate) {
                params.push(`dateTimeUpper=${(this.toDate)}`);
            }

            if (params.length > 0) {
                url += '?' + params.join('&');
            }

            await this.getMeasurements(url);
            //pagination
            this.currentPage = 1;
        },

        resetFilter() {
            this.fromDate = '';
            this.toDate = '';
            this.getAllMeasurements();
            //pagination
            this.currentPage = 1;
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        }


    }




}).mount("#app") 