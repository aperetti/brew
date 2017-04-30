<template>
<div class="container">
  <md-button @click.native="dialog('newKeg', true)">New</md-button>
  <md-layout md-gutter="16">
    <md-layout v-if="onTap && onTap.length > 0" v-for="(keg, index) in onTap" :key="'keg-'+index" md-flex="50" md-flex-xsmall="100" >
      <md-card md-with-hover style="width: 100%">
        <md-card-area md-inset>
          <md-card-media md-ratio="16:9">
            <img src="../assets/amber.jpg" alt="Coffee House">
          </md-card-media>
          <md-card-header>
            <md-layout>
              <md-layout md-flex="50">
                <h2 class="md-title">{{keg.name}}</h2>
              </md-layout>
              <md-layout>
                <h2 class="md-title" v-if="pullingKeg === keg.sensor && keg.sensor !== null">{{pullSize}} Oz</h2>
              </md-layout>
            </md-layout>
            <div class="md-subhead">
              <i :class="['fa',  pullingKeg === keg.sensor && keg.sensor !== null  ? 'fa-spinner fa-spin' : '']"></i>
              <span>{{keg.size}} Gallons</span>
            </div>
          </md-card-header>

          <md-card-content v-html="keg.description">
            
          </md-card-content>
        </md-card-area>

        <md-card-content>
          <h3 class="md-subheading">Availability</h3>
          <md-tooltip md-direction="top">{{keg.size - Math.round(keg.used*10) / 10}} / {{keg.size}} Gallons Remain</md-tooltip>
          <md-progress :class="(keg.size - keg.used) / keg.size <= .2 ? 'md-warn' : ''" :md-progress="(keg.size - keg.used) / keg.size * 100">
          </md-progress>
        </md-card-content>

        <md-card-actions>
          <md-button style="margin-right: auto" @click.native="dialog('deleteKeg', true, index)">Delete</md-button>
          <md-button v-if="!keg.tapped" class="md-primary" @click.native="dialog('tapKeg', true, index)">Tap</md-button>
          <md-button v-if="keg.tapped && !keg.kicked" class="md-warn" @click.native="dialog('kickKeg', true, index)">Kick</md-button>
          <md-button class="md-primary" @click.native="dialog('editKeg', true, index)">Edit</md-button>
        </md-card-actions>
      </md-card>
    </md-layout>
  </md-layout>

  <!-- New Keg Dialog-->
  <md-dialog md-open-from="#fab" md-close-to="#fab" ref="newKeg">
    <md-dialog-title>Create a new keg</md-dialog-title>
    <md-dialog-content>
      <form>
        <md-input-container>
          <label>Name</label>
          <md-input v-model="newKeg.name"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Description</label>
          <md-input v-model="newKeg.description"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Size (g)</label>
          <md-input v-model="newKeg.size" type="number"></md-input>
        </md-input-container>
      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click.native="resetNewKeg">Cancel</md-button>
      <md-button class="md-primary" @click.native="createNewKeg">Create</md-button>
    </md-dialog-actions>
  </md-dialog>

 <!-- Edit Keg Dialog-->
      <md-dialog :md-open-from="'#fab'" :md-close-to="'#fab'" :ref="'editKeg'">
        <md-dialog-title>Edit Keg</md-dialog-title>
        <md-dialog-content>
          <form>
            <md-input-container>
              <label>Name</label>
              <md-input v-model="tempKeg.name"></md-input>
            </md-input-container>
            <md-input-container>
              <label>Description</label>
              <md-textarea v-model="tempKeg.description"></md-textarea>
            </md-input-container>
            <md-input-container>
              <label>Size (g)</label>
              <md-input v-model="tempKeg.size" type="number"></md-input>
            </md-input-container>
            <md-input-container>
              <label>Used (g)</label>
              <md-input v-model="tempKeg.used" type="number"></md-input>
            </md-input-container>
            <md-input-container>
              <label>Sensor</label>
              <md-input v-model="tempKeg.sensor"></md-input>
            </md-input-container>
            <md-button>Test Sensor</md-button>
          </form>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click.native="dialog('editKeg')">Cancel</md-button>
          <md-button class="md-primary" @click.native="saveEdit()">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
 
  <!-- Kick Keg -->
  <md-dialog-confirm
    md-title="Kick Keg"
    md-content-html="Are you sure you want to <b>kick</b> the keg?"
    md-ok-text="OK"
    md-cancel-text="Cancel"
    @close="kickKeg"
    ref="kickKeg">
  </md-dialog-confirm>

    <!-- Tap Keg --> 
  <md-dialog-confirm
    md-title="Tap Keg"
    md-content-html="Are you sure you want to <b>tap</b> the keg?"
    md-ok-text="OK"
    md-cancel-text="Cancel"
    @close="tapKeg"
    ref="tapKeg">
  </md-dialog-confirm>

    <!-- Delete Keg --> 
  <md-dialog-confirm
    md-title="Delete Keg"
    md-content-html="Are you sure you want to <b>delete</b> the keg?"
    md-ok-text="OK"
    md-cancel-text="Cancel"
    @close="deleteKeg"
    ref="deleteKeg">
  </md-dialog-confirm>
  
    <!-- Saving Snack Bar -->
    <md-snackbar md-position="top center" ref="consumeBar" :md-duration="4000">
      <span>{{pullMessage}}</span>
    </md-snackbar>
  <!-- Saving Snack Bar -->
    <md-snackbar md-position="bottom center" ref="savedbar" :md-duration="4000">
      <md-progress v-if="saving" md-indeterminate></md-progress>
      <span v-else>Changes have been saved!</span>
    </md-snackbar>
</div>
</template>

<script>
import Kegs from '@/api/kegs'
import mqtt from 'mqtt'

var newKeg = {
  name: null,
  description: null,
  sensor: null,
  size: null
}

var kegTimeOut
export default {
  mounted () {
    var client = mqtt.connect('wss://brew.photoredux.com:9095')
    client.on('connect', () => {
      console.log('loaded')
      client.subscribe('/sensor/flow/#', {qos: 1}, function (topic) {
        console.log('Subcribed to flow sensor', topic)
      })
      client.on('message', (topic, message) => {
        var topics = topic.split('/')
        if (topics[1] === 'sensor' && topics[2] === 'flow') {
          if (topics.length === 4) {
            let sensor = topics[3]
            console.log(sensor)
            this.onTap.map((el, i) => {
              if (el.sensor === sensor) {
                this.consume(sensor)
              }
            })
            // Show the Keg in use and start adding consumption
          }
        }
      })
    })
  },
  beforeRouteEnter (to, from, next) {
    Kegs.get()
      .then(res => {
        next(vm => {
          vm.onTap = res.data
        })
      }).catch(() => next(false))
  },
  watch: {
    $route: () => {
      Kegs.get()
        .then(res => {
          this.onTap = res.data
        })
    }
  },
  data () {
    return {
      onTap: null,
      newKeg: Object.assign({}, newKeg),
      pullingKeg: null,
      pullSize: 0,
      editKeg: 0,
      tempKeg: {},
      saving: false,
      pullMessage: ''
    }
  },
  methods: {
    setEditKeg (kegIndex) {
      this.editKeg = kegIndex
      this.dialog('editKeg', true)
    },
    saveEdit () {
      this.saving = true
      this.$refs['savedbar'].open()
      Kegs.save(this.tempKeg)
        .then(res => {
          this.saving = false
          this.onTap[this.editKeg] = res.data
          this.dialog('editKeg')
        })
        .catch(e => {
          console.log('Error Saving Keg')
        })
    },
    dialog (ref, status, editKegIndex = 0) {
      this.editKeg = editKegIndex
      this.tempKeg = Object.assign({}, this.onTap[editKegIndex])
      return status ? this.$refs[ref].open() : this.$refs[ref].close()
    },
    resetNewKeg () {
      console.log(newKeg)
      this.newKeg = Object.assign({}, newKeg)
      this.dialog('newKeg')
    },
    createNewKeg () {
      Kegs.new(this.newKeg)
        .then(res => {
          console.log(res.data)
          this.dialog('newKeg')
          this.onTap.push(res.data)
          Object.assign(this.newKeg, newKeg)
        })
    },
    kickKeg (type) {
      if (type === 'ok') {
        this.saving = true
        this.$refs['savedbar'].open()
        Kegs.kick(this.onTap[this.editKeg])
          .then(res => {
            this.saving = false
            this.onTap[this.editKeg] = res.data
          })
      }
    },
    tapKeg (type) {
      if (type === 'ok') {
        this.saving = true
        this.$refs['savedbar'].open()
        Kegs.tap(this.onTap[this.editKeg])
          .then(res => {
            this.saving = false
            this.onTap[this.editKeg] = res.data
          })
      }
    },
    getKegs () {
      Kegs.get().then(res => {
        console.log(res.data)
        this.onTap = res.data
      })
    },
    deleteKeg (type) {
      if (type === 'ok') {
        this.saving = true
        this.$refs['savedbar'].open()
        Kegs.delete(this.onTap[this.editKeg]._id)
          .then(res => {
            this.saving = false
            this.getKegs()
          })
      }
    },
    consume (i) {
      this.pullingKeg = i
      this.pullSize += 1
      var size = Number(this.pullSize)
      this.pullMessage = `Please enjoy your ${size}oz drink!`
      clearTimeout(kegTimeOut)
      setTimeout(() => {
        this.$refs['consumeBar'].open()
        this.pullingKeg = null
        this.pullSize = 0
        Kegs.get()
        .then(res => {
          this.onTap = res.data
        })
      }, 10000)
    }
  }
}
</script>
