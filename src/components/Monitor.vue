<template>
  <div class="container">
    <md-whiteframe md-elevation='5' style="margin-bottom: 10px;">
      <md-whiteframe md-tag="md-toolbar" class="md-dense" md-elevation="2">
        <md-layout md-flex="90" md-flex-xsmall="80">
          <span :class="'md-headline'">Sensor Data</span>
        </md-layout>
        <md-layout>
          <md-button @click.native="fullScreen = !fullScreen" class="md-dense md-icon-button">
            <md-icon >fullscreen</md-icon>
          </md-button>
        </md-layout>
      </md-whiteframe>
      <md-layout md-gutter="16" style="padding: 20px;">
        <md-layout md-flex="100">
          <md-layout :md-flex="fullScreen ? 50 : 25" md-flex-xsmall="100" :key='"temps"-index' v-for="(sen, index) in sortedSensors" style="justify-content: center;">
            <div :class="fullScreen ? 'md-display-3' : 'md-headline'"  > {{sen.name || sen.sensor}}: {{Math.round(sen.temp*100)/100}}­°F</div>
          </md-layout>
        </md-layout>
        <md-layout md-row>
          <md-layout ref="chartLayout" md-flex="100" md-flex-xsmall="100">
            <canvas class="chart md-whiteframe md-whiteframe-2dp" id="myChart" ref="myCanvas" width="800" :height="300"></canvas>
          </md-layout>
        </md-layout>
      </md-layout>
    </md-whiteframe>
    <md-layout md-gutter="16">
      <md-layout md-flex="75" md-flex-xsmall="100" style="margin-bottom: 10px;">
         <md-whiteframe md-elevation='5' >
          <md-whiteframe md-tag="md-toolbar" class="md-dense" md-elevation="4">
            <div :class="'md-headline'">Wort Chill Calculator</div>
          </md-whiteframe>
          <md-layout md-gutter="16" style="padding: 20px; 20px; 10px; 20px;">
            <md-layout md-flex="50">
              <md-input-container>
              <label for="wortSensor">Wort Sensor</label>
                <md-select name="wortSensor" v-model="wortSensor">
                  <md-option :key="'wortSensor'+index" v-for="(sen, index) in sensorData" :value="sen.sensor">{{sen.sensor}}</md-option>
                </md-select>
              </md-input-container>
            </md-layout>
            <md-layout md-flex="50">
              <md-input-container>
                <label>Target Temp</label>
                <md-input type="number" v-model="targetTemp"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex="25" md-flex-xsmall="50">
              <md-input-container>
                <label for="ambient-sensor">Ambient Sensor</label>
                <md-select :disabled="overrideAmbient" name="ambient-sensor" v-model="ambientSensor">
                  <md-option :key="'ambientsensor'+index" v-for="(sen, index) in sensorData" :value="sen.sensor">{{sen.sensor}}</md-option>
                </md-select>
              </md-input-container>
            </md-layout>
            <md-layout md-flex="25" md-flex-xsmall="50">
              <md-input-container>
                <label>Ambient Temp</label>
                <md-input :disabled="!overrideAmbient" type="number" v-model="ambientTemp"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout style="align-items: center;" md-flex="50" md-flex-xsmall="100">
                <md-switch v-model="overrideAmbient" id="my-test1" name="my-test1" class="md-primary">Override Ambient Sensor</md-switch>
            </md-layout>
            <md-layout :class="fullScreen ? 'md-display-3' : 'md-headline'" md-flex="100">
              {{Math.round(chillTime / 1000 / 60)}} Minutes
              <md-tooltip md-direction="top">Chill Rate: {{k.toExponential()}}</md-tooltip>
            </md-layout>
          </md-layout>
        </md-whiteframe>
      </md-layout>
      <md-layout md-flex-xsmall="100" md-flex="25" style="margin-bottom: 10px;">
         <md-whiteframe style="width: 100%" md-elevation='5' >
          <md-whiteframe md-tag="md-toolbar" class="md-dense" md-elevation="4">
            <div :class="'md-headline'">Relay</div>
          </md-whiteframe>
            <md-layout md-flex="100">
              <md-button @click.native="toggleRelay" style='margin: 0px 0px 0px 0px; width:100%; height: 100%' :class="['md-raised', relayStatus ? 'md-warn' : '']">Toggle</md-button>
            </md-layout>
        </md-whiteframe>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
import Chart from 'chart.js'
import mqtt from 'mqtt'
import monitor from '../api/monitor'
import _ from 'lodash'
import moment from 'moment'

var templateColors = (index, alpha) => {
  let colors = [
    `rgba(255, 99, 132, ${alpha})`,
    `rgba(54, 162, 235, ${alpha})`,
    `rgba(255, 206, 86, ${alpha})`,
    `rgba(75, 192, 192, ${alpha})`
  ]
  return colors[index]
}
var templateDataSet = (i) => {
  return {
    sensor: i,
    radius: 0,
    lineTension: 0.1,
    type: 'line',
    label: `Sensor ${i}`,
    borderWidth: 1,
    backgroundColor: templateColors(i, 0.2),
    borderColor: templateColors(i, 1),
    data: []
  }
}

var tempChart

export default {
  name: 'monitor',
  mounted () {
    var ctx = window.document.getElementById('myChart')
    tempChart = new Chart(ctx, {
      options: {
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0    // minimum will be 0, unless there is a lower value.
            }
          }]
        },
        fullWidth: true,
        maintainAspectRation: false,
        responsive: false
      },
      type: 'line',
      data: {
        labels: [],
        datasets: [
          templateDataSet(1),
          templateDataSet(2),
          templateDataSet(3),
          templateDataSet(4)
        ]
      }
    })

    monitor.getSensorBuffer()
      .then(res => {
        this.test = res.data.graphData
        this.sensorData = res.data.sensorData
        var chart = tempChart.config.data
        var graphData = res.data.graphData
        graphData.forEach(v => {
          chart.labels.push(moment.unix(v.time / 1000).format('LTS'))
          v.data.forEach(s => {
            var idx = _.findIndex(chart.datasets, o => o.sensor === s.sensor)
            chart.datasets[idx].data.push(s.temp)
          })
        })
        tempChart.update()
      })

    window.setInterval(this.updateGraph, 10000)
    var client = mqtt.connect('wss://brew.photoredux.com:9095')
    client.on('connect', () => {
      console.log('loaded')
      client.subscribe('/sensor/#', {qos: 1}, function (topic) {
        console.log('Subcribed to temperature reading ', topic)
      })
      client.subscribe('/relay/#', {qos: 1}, (topic) => console.log('Subscribed to relay ', topic))
      client.on('message', (topic, message) => {
        var topics = topic.split('/')
        if (topics[1] === 'sensor' && topics[2] === 'ds18b20') {
          if (topics.length === 4) {
            let sensor = _.toNumber(topics[3])
            this.updateSensor(sensor, _.toNumber(message.toString()))
          }
        } else if (topics[1] === 'relay' && topics[2] === 'status') {
          this.relayStatus = !_.toNumber(message.toString())
        }
      })
    })
  },
  data () {
    return {
      test: null,
      ambientSensor: null,
      k: 0,
      overrideAmbient: false,
      wortSensor: null,
      targetTemp: null,
      ambientTemp: null,
      fullScreen: false,
      tempChart: {},
      sensorChart: {},
      sensorData: [],
      relayStatus: false
    }
  },
  methods: {
    updateSensor (sensor, temp) {
      var index = _.findIndex(this.sensorData, (o) => o.sensor === sensor)
      if (index === -1) {
        this.sensorData.push({
          sensor: sensor,
          temp: temp,
          runningTemp: [{temp: temp, time: Date.now()}]
        })
      } else {
        var update = this.sensorData[index]
        update.temp = temp
        update.lastUpdate = Date.now()
        if (Date.now() - _.last(update.runningTemp).time > 10000) {
          update.runningTemp.push({temp: temp, time: Date.now()})
          update.runningTemp = _.takeRight(update.runningTemp, 500)
        }
      }
    },
    updateGraph () {
      var datasets = tempChart.config.data.datasets
      var labels = tempChart.config.data.labels
      labels.push(moment().format('LTS'))
      tempChart.config.data.labels = _.takeRight(labels, 500)
      this.sensorData.map(sensor => {
        var idx = _.findIndex(datasets, o => o.sensor === sensor.sensor)
        if (Date.now() - sensor.lastUpdate < 15000) {
          datasets[idx].data.push(sensor.temp)
        } else {
          datasets[idx].data.push(0)
        }
        datasets[idx].data = _.takeRight(datasets[idx].data, 500)
      })
      tempChart.update()
    },
    toggleRelay: function () {
      monitor.toggleRelay(7)
        .then((res) => console.log(res))
    }
  },
  computed: {
    sortedSensors () {
      return _.sortBy(this.sensorData, (o) => o.sensor)
    },
    chillTime () {
      if (this.targetTemp && this.wortSensor && ((!this.overrideSensor && this.ambientSensor) || (this.ovverrideSesnor && this.ambientTemp))) {
        var tTemp = _.toNumber(this.targetTemp)
        var cSensor = this.sensorData[_.findIndex(this.sensorData, (o) => o.sensor === this.wortSensor)]
        var aSensor = this.sensorData[_.findIndex(this.sensorData, (o) => o.sensor === this.ambientSensor)]
        var aTemp = this.overrideAmbient ? this.ambientTemp : aSensor.temp
        var tempInitial = cSensor.runningTemp.length >= 3 ? _.nth(cSensor.runningTemp, -3).temp : _.head(cSensor.runningTemp).temp
        var tempNow = _.last(cSensor.runningTemp).temp
        var timeInititial = cSensor.runningTemp.length >= 3 ? _.nth(cSensor.runningTemp, -3).time : _.head(cSensor.runningTemp).time
        var timeDelta = _.last(cSensor.runningTemp).time - timeInititial
        var k = Math.log((tempNow - aTemp) / (tempInitial - aTemp)) / (-1 * timeDelta)
        var time = Math.log((tTemp - aTemp) / (tempInitial - aTemp)) / (-1 * k)
        this.k = k
        return time
      } else {
        return null
      }
    }
  }
}
</script>


<style scoped>
canvas {
  margin: 0 auto;
  display: block;
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.chart {
  padding: 10px;
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: 20px;
}
</style>

