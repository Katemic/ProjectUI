const baseUrl = "https://airqualityrest20241202114729.azurewebsites.net/api/AirQualities";
//const baseUrl = "http://localhost:5041/api/AirQualities";

const app = Vue.createApp({
    data() {
        return {
            measurements: [],
            error: null,
            showFilter: false,
            newestMeasurement: null,
            selectedOption: null,
            options: [
                { name: 'Graf' },
                { name: 'Best and worst' }
            ],
            chart: null
        }
    },
    async created() {
        await this.getAllMeasurements();
        console.log("Created has been called");
    },
    methods: {
        showFilterMenu() {
            this.showFilter = !this.showFilter;
        },
        getAllMeasurements() {
            this.getMeasurements(baseUrl);
        },
        getByLocation(text) {
            const url = baseUrl + "?location=" + text;
            this.getMeasurements(url);
        },
        async getMeasurements(url) {
            try {
                const response = await axios.get(url);
                this.measurements = response.data;
                const response2 = await axios.get(baseUrl + "/last");
                this.newestMeasurement = response2.data;
                if (this.chart) {
                    this.updateChart();
                } else {
                    this.createChart();
                }
            } catch (ex) {
                alert(ex.message);
            }
        },
        formatTime(timeString) {
            const date = new Date(timeString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        },
        formatDate(timeString) {
            const date = new Date(timeString);
            return date.toLocaleDateString('en-GB');
        },
        async getNewestMeasurement() {
            try {
                console.log(this.newestMeasurement);
                const response = await axios.get("http://localhost:5041/api/AirQualities/last");
                console.log(this.newestMeasurement);
                this.newestMeasurement = response.data;
                console.log(this.newestMeasurement);
            } catch (ex) {
                alert(ex.message);
            }
        },
        createChart() {
            const ctx = document.getElementById('myChart').getContext('2d');
            const oldestMeasurements = this.measurements.slice(0, 20);
            const labels = oldestMeasurements.map(m => `${this.formatDate(m.time)} ${this.formatTime(m.time)}`);
            const data = oldestMeasurements.map(m => m.cO2);

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'CO2 niveau',
                        data: data,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },
        updateChart() {
            const oldestMeasurements = this.measurements.slice(0, 20);
            const labels = oldestMeasurements.map(m => `${this.formatDate(m.time)} ${this.formatTime(m.time)}`);
            const data = oldestMeasurements.map(m => m.cO2);

            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data;
            this.chart.update();
        }
    }
}).mount("#app");