const baseUrl = "https://airqualityrest20241202114729.azurewebsites.net/api/AirQualities"
//const baseUrl = "http://localhost:5041/api/AirQualities"
const baseUrl3Party = "https://emojihub.yurace.pro/api/random/group/"


Vue.createApp({
    data() {
        return {
            allMeasurements: [], // Store all measurements
            measurements: [], // Used for pagination and display
            graphMeasurements: [], // Used specifically for the graph
            error: null,
            showFilter: false,
            newestMeasurement: null,

            // New data properties for graph slicing
            graphSliceOptions: [20, 30, 50, 100], // Available slice options
            selectedGraphSlice: 20, // Default selected slice
            
            fromDate: null,
            toDate: null,
            selectedOption: null,
            options: [
                {name: 'Graf'},
                {name: 'Best and worst'}
            ],
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
        await this.getAllMeasurement2();
        this.renderChart();
        
        // Add resize listener for chart responsiveness
        window.addEventListener('resize', this.renderChart);
    },

    beforeUnmount() {
        // Remove resize listener to prevent memory leaks
        window.removeEventListener('resize', this.renderChart);
        
        // Destroy chart instance if it exists
        if (window.co2ChartInstance) {
            window.co2ChartInstance.destroy();
        }
    },

    methods: {
        async getAllMeasurement2() {
            try {
                console.log('Fetching measurements...');
                const response = await axios.get(baseUrl);
                // Store ALL measurements
                this.allMeasurements = response.data.reverse(); 
                
                // Slice ONLY the graph data
                this.graphMeasurements = this.allMeasurements.slice(0, 20);
                
                // Set full measurements for table
                this.measurements = this.allMeasurements;
                
                // Set newest measurement (from ALL measurements)
                this.newestMeasurement = this.allMeasurements[0];
                
                console.log('All Measurements:', this.allMeasurements.length);
                console.log('Graph Measurements:', this.graphMeasurements.length);
            } catch (ex) {
                console.error('Error fetching measurements:', ex.message);
                alert(ex.message);
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

        showFilterMenu() {
            this.showFilter = !this.showFilter;
        },

        formatTime(timeString) {
            const date = new Date(timeString);
            return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
        },

        formatDate(timeString) {
            const date = new Date(timeString);
            return date.toLocaleDateString('en-GB');
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
            if (index === this.measurements.length - 1) return '→';
            const currentCO2 = this.measurements[index].cO2;
            const nextCO2 = this.measurements[index + 1].cO2;
            if (currentCO2 < nextCO2) {
                return '↑';
            } else if (currentCO2 > nextCO2) {
                return '↓';
            } else {
                return '→';
            }
        },

        // New method to update graph measurements
        updateGraphMeasurements() {
            this.graphMeasurements = this.allMeasurements.slice(0, this.selectedGraphSlice);
            this.renderChart(); // Re-render chart when slice changes
        },

        // Method to handle slice selection
        changeGraphSlice(newSlice) {
            this.selectedGraphSlice = newSlice;
            this.updateGraphMeasurements();
        },

        renderChart() {
            console.log('Rendering chart...');
            const ctx = document.getElementById('co2Chart').getContext('2d');
            // Use graphMeasurements for chart
            const labels = this.graphMeasurements.map(m => this.formatTime(m.time));
            const data = this.graphMeasurements.map(m => m.cO2);

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
                                text: 'Time'
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
                params.push(`dateTimeLower=${this.fromDate}`);
            }
            if (this.toDate) {
                params.push(`dateTimeUpper=${this.toDate}`);
            }

            if (params.length > 0) {
                url += '?' + params.join('&');
            }

            await this.getMeasurements(url);
        },

        async getMeasurements(url) {
            try {
                const response = await axios.get(url);
                this.measurements = response.data;
                this.renderChart(); // Re-render chart with new data
            } catch (ex) {
                alert(ex.message);
            }
        },

        resetFilter() {
            this.fromDate = null;
            this.toDate = null;
            this.getAllMeasurement2();
        }
    }
}).mount("#app")