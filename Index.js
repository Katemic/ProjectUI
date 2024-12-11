
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
              itemsPerPage: 24,

              //Graph
              graphData: [],
              selectedGraphSlice: 20,
              graphSliceOptions: [20, 30, 50, 100],


        }
    },

    async created() {
        
        await this.getAllMeasurements()
        //this.getNewestMeasurement()
        //this.getNewestMeasurement()
        //await this.getAllMeasurement2()

        this.$nextTick(() => {
            this.renderChart();
        });

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

    //NYT
    beforeUnmount() {
        // Remove resize listener to prevent memory leaks
        window.removeEventListener('resize', this.renderChart);
        
        // Destroy chart instance if it exists
        if (window.co2ChartInstance) {
            window.co2ChartInstance.destroy();
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
                if (this.measurements.length > 0) {
                   this.graphData = response.data.slice(0, 20).reverse();
                }
                
                console.log(this.graphData)
                this.$nextTick(() => {
                    this.renderChart(); // Ensure renderChart is called after the DOM is updated
                });

            } catch (ex) {
                alert(ex.message)
            }
        },

        async getEmoji(value){
            try{
                
                let url = baseUrl3Party
                if(value <= 1000){
                    this.emoji = "&#128516;"
                }
                else
                {
                    url += "face-negative"
                
                console.log(url)
                const response = await axios.get(url)
                this.emoji = response.data.htmlCode
                console.log(this.emoji)
                }
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
            if (value >= 1000) {
              return 'high-value';
            } else if (value > 800) {
              return 'medium-value';
            } else {
              return 'low-value';
            }
        },

        getHeaderClass(value) {
            if (value >= 1000) {
                return 'high-value';
            } else if (value > 800) {
                return 'medium-value';
            } else {
                return 'low-value';
            }
        },


        getRandomAdvice() {
            const randomIndex = Math.floor(Math.random() * this.advices.length);
            return this.advices[randomIndex];
        },

        getArrowDirection(paginatedIndex) {

            const originalIndex = (this.currentPage - 1) * this.itemsPerPage + paginatedIndex;
            if (originalIndex === this.measurements.length - 1) return '&#9188;'; // Default arrow for the last row
            const currentCO2 = this.measurements[originalIndex].cO2;
            const nextCO2 = this.measurements[originalIndex + 1].cO2;
            const tolerance = 0.0001; // Define a small tolerance value



            if (currentCO2 < nextCO2 - tolerance) {
                return '&#9650;';
            } else if (currentCO2 > nextCO2 + tolerance) {
                return '&#9660;';
            } else {
                return '&#9188;';
            }


            // if (index === this.measurements.length - 1) return '→'; // Default arrow for the last row
            // const currentCO2 = this.measurements[index].cO2;
            // const nextCO2 = this.measurements[index + 1].cO2;
            // if (currentCO2 < nextCO2) {
            //     return '↑';
            //     //^
            // } else if (currentCO2 > nextCO2) {
            //     return '↓';
            //     //⌄
            // } else {
            //     return '→';
            //     //-
            // }
        },

        getArrowClass(paginatedIndex) {
            const originalIndex = (this.currentPage - 1) * this.itemsPerPage + paginatedIndex;
    if (originalIndex >= this.measurements.length - 1) return 'arrow-right'; // Default arrow for the last row or out of bounds
    const currentCO2 = this.measurements[originalIndex].cO2;
    const nextMeasurement = this.measurements[originalIndex + 1];
    const nextCO2 = nextMeasurement ? nextMeasurement.cO2 : null;
    const tolerance = 0.0001; // Define a small tolerance value

    if (nextCO2 === null) {
        return 'arrow-right'; // Default arrow for the last row or if nextCO2 is undefined
    }

    if (currentCO2 < nextCO2 - tolerance) {
        return 'arrow-up';
    } else if (currentCO2 > nextCO2 + tolerance) {
        return 'arrow-down';
    } else {
        return 'arrow-right';
    }
        },


        formatDateTime(timeString) {
            const date = new Date(timeString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}.${month} ${hours}:${minutes}`;
        },

        // New method to update graph measurements
        updateGraphMeasurements() {
            console.log('Updating graph measurements...');
            this.graphData = this.measurements.slice(0, this.selectedGraphSlice);
            this.renderChart(); // Re-render chart when slice changes
        },

        // Method to handle slice selection
        changeGraphSlice(newSlice) {
            console.log('Changing graph slice to:', newSlice);
            this.selectedGraphSlice = newSlice;
            this.updateGraphMeasurements();
        },

        renderChart() {
            console.log('Rendering chart...');
            const ctx = document.getElementById('co2Chart').getContext('2d');
            // Use graphMeasurements for chart
            const labels = this.graphData.map(m => this.formatDateTime(m.time));
            const data = this.graphData.map(m => m.cO2);

            // Calculate min and max for better scaling
            const minCO2 = Math.min(...data);
            const maxCO2 = Math.max(...data);

            const maxYAxis = Math.ceil(maxCO2 / 500) * 500;

            // Destroy existing chart if it exists to prevent multiple chart instances
            if (window.co2ChartInstance) {
                window.co2ChartInstance.destroy();
            }

            

            window.co2ChartInstance = new Chart(ctx, {
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
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Dato og tid'
                            },
                            grid: {
                                display: true,
                                drawBorder: true
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'CO2 Levels'
                            },
                            beginAtZero: true,
                            min: Math.max(0/* , minCO2 - 100 */),
                            max: maxYAxis+500,
                            ticks: {
                                stepSize: 500,
                                callback: function(value) {
                                    return value.toFixed(0);
                                }
                            },
                            grid: {
                                display: true,
                                drawBorder: true
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
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
                console.log(this.fromDate)
            }
            if (this.toDate) {
                params.push(`dateTimeUpper=${(this.toDate)}`);
                console.log(this.toDate)
            }

            if (params.length > 0) {
                url += '?' + params.join('&');
                console.log(url)
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
        },

        reloadPage() {
            window.location.reload();
        }


    }




}).mount("#app") 