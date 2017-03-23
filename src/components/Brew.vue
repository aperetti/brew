<template>
  <div class="container">
    <md-whiteframe>
      <md-layout :key="'section'+index" v-for="(section, index) in sections" :class="['has-ripple md-title', (index === activeSection) ? 'md-primary' : '']" md-flex='15' @click.native='activeSection = index'>
        <md-ink-ripple />
          {{section}}
      </md-layout>
    </md-whiteframe>
    <md-whiteframe v-show="activeSection === 0" style="padding-top: 20px; padding-left: 30px; padding-right: 30px;" md-elevation="3">
      <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: .5">Brew</h2>
            <md-button @click.native='saveBrew' class='md-raised'>SAVE</md-button>
            <md-button @click.native='$refs.deletedialog.open()' class='md-raised'>DELETE</md-button>
          </md-toolbar>
          <md-layout :md-gutter='8' md-row>
            <md-layout md-flex='75' md-flex-xsmall='100'>
            <md-input-container >
              <label>Brew Name</label>
              <md-input v-model='form.name'></md-input>
            </md-input-container>
            </md-layout>
            <md-layout>
            <md-input-container>
              <label for='status'>Status</label>
              <md-select name='status' v-model='form.status'>
                <md-option value='Available'>Available</md-option>
                <md-option value='Finished'>Finished</md-option>
              </md-select>
            </md-input-container>
            </md-layout>
          </md-layout>

          <!-- Style -->
          <md-layout :md-gutter='8' md-row>
            <md-layout md-flex='15' md-flex-xsmall='100'>
              <md-input-container>
                <label>Batch Size</label>
                <md-input v-model='form.batchSize'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='5' md-flex-xsmall='100'>
              <md-input-container>
                <label>Unit</label>
                <md-input disabled v-model='form.batchUnit'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='15' md-flex-xsmall='100'>
              <md-input-container>
                <label>Batch #</label>
                <md-input type="number" v-model='form.batchNumber'></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>

          <!-- Dates -->
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: .1">Dates</h2>
          </md-toolbar>
          <md-layout :md-gutter='8' md-row>
            <md-layout md-flex='25' md-flex-xsmall='100'>
            <md-input-container>
              <label>Brew</label>
              <md-input type='date' v-model='form.dates.brewed'></md-input>
            </md-input-container>
            </md-layout> 
            <md-layout md-flex='25' md-flex-xsmall='100'>
              <md-input-container>
                <label>Racked</label>
                <md-input type='date' v-model='form.dates.racked'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='25' md-flex-xsmall='100'>
              <md-input-container>
                <label>Bottled</label>
                <md-input type='date' v-model='form.dates.bottled'></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>

          <!-- Cost -->
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: .1">Costs</h2>
          </md-toolbar>
          <md-layout :md-gutter='8' md-row>
            <md-layout md-flex='20' md-flex-xsmall='100'>
            <md-input-container>
              <label>Fermentables</label>
              <md-input type='number' v-model='form.costs.sugars'></md-input>
            </md-input-container>
            </md-layout> 
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container>
                <label>Hops</label>
                <md-input type='number' v-model='form.costs.hops'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container>
                <label>Yeast</label>
                <md-input type='number' v-model='form.costs.yeast'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container>
                <label>Other</label>
                <md-input type='number' v-model='form.costs.other'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container disabled>
                <label>Total</label>
                <md-input v-model='costTotal'></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>

          <!-- Notes -->
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: .1">Notes</h2>
            <md-button @click.native="addType('notes')" class="md-icon-button md-raised md-dense md-primary">
              <md-icon>add</md-icon>
            </md-button>
          </md-toolbar>
          <md-layout :key='"note"+index' v-for='(note, index) in form.notes' :md-gutter='8' md-row>
            <md-layout md-flex='60' md-flex-xsmall='100'>
              <md-input-container >
                <label>Note</label>
                <md-textarea v-model='note.note'></md-textarea>
              </md-input-container>
              </md-layout>
            <md-layout md-flex='30' md-flex-xsmall='100' style='align-items:flex-start;'>
              <md-input-container >
                <label>Date Time</label>
                <md-input type='datetime-local' v-model='note.time'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='5' md-flex-xsmall='100' style='align-items: center; color: grey;'>
              <md-button @click.native='removeType("notes", index)' class="md-icon-button md-raised md-dense">
                <md-icon>delete</md-icon>
              </md-button>
            </md-layout>
          </md-layout>
    </md-whiteframe>
    <md-whiteframe v-show="activeSection === 1" style="padding-top: 20px; padding-left: 30px; padding-right: 30px;" md-elevation="3">
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: .1">Fermentables</h2>
            <md-button @click.native='addType("fermentables")' class="md-icon-button md-raised md-primary md-dense">
              <md-icon>add</md-icon>
            </md-button>
          </md-toolbar>
          <md-layout :key='"fermentable" + index' v-for='(fermentable, index) in form.fermentables' :md-gutter='8' md-row>
            <md-layout md-flex='30' md-flex-xsmall='100'>
              <md-input-container >
                <label>Name</label>
                <md-input v-model='fermentable.name'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='15' md-flex-xsmall='100'>
              <md-input-container >
                <label>Weight (kg)</label>
                <md-input type="number" v-model='fermentable.weight'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='10' md-flex-xsmall='100'>
              <md-input-container >
                <label>Yield</label>
                <md-input type="number" v-model='fermentable.yield'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='15' md-flex-xsmall='100'>
              <md-input-container >
                <label>Color SRM</label>
                <md-input type="number" v-model='fermentable.color'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='10' md-flex-xsmall='100'>
                <label>Late</label>
                <md-switch class='md-primary' v-model='fermentable.late'></md-switch>
            </md-layout>
            <md-layout md-flex='15' md-flex-xsmall='100'>
              <md-input-container >
                <label>Time (m)</label>
                <md-input v-model='fermentable.time'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='5' md-flex-xsmall='100' style='align-items: center; color: grey;'>
              <md-button @click.native='removeType("fermentables", index)' class="md-icon-button md-raised md-dense">
                <md-icon>delete</md-icon>
              </md-button>
            </md-layout> 
          </md-layout>
          <!-- Spices -->
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: .1">Spices</h2>
            <md-button @click.native="addType('spices')" class="md-icon-button md-raised md-dense md-primary">
              <md-icon>add</md-icon>
            </md-button>
          </md-toolbar>
          <md-layout :key='"spice"+index' v-for='(spice, index) in form.spices' :md-gutter='8' md-row>
            <md-layout md-flex='25' md-flex-xsmall='100'>
              <md-input-container >
                <label>Name</label>
                <md-input v-model='spice.name'></md-input>
              </md-input-container>
              </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container >
                <label>Weight (kg)</label>
                <md-input v-model='spice.weight'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='10' md-flex-xsmall='100'>
              <md-input-container >
                <label>Use</label>
                <md-input v-model='spice.use'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='5' md-flex-xsmall='100'>
              <md-input-container >
                <label>a.a</label>
                <md-input v-model='spice.aa'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='15' md-flex-xsmall='100'>
              <md-input-container >
                <label>Time (m)</label>
                <md-input v-model='spice.time'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container >
                <label for='form'>Form</label>
                <md-select name='form' v-model='form.status'>
                  <md-option value='Whole'>Whole</md-option>
                  <md-option value='Pellets'>Pellets</md-option>
                  <md-option value='Plug'>Plug</md-option>
                  <md-option value='Crushed'>Crushed</md-option>
                  <md-option value='Ground'>Ground</md-option>
                </md-select>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='5' md-flex-xsmall='100' style='align-items: center; color: grey;'>
              <md-button @click.native='removeType("spices", index)' class="md-icon-button md-raised md-dense">
                <md-icon>delete</md-icon>
              </md-button>
            </md-layout> 
          </md-layout>
          <!-- Yeast -->
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: .1">Yeast</h2>
          </md-toolbar>
          <md-layout :key='"yeast"+index' v-for='(yeast, index) in form.yeast' :md-gutter='8' md-row>
            <md-layout md-flex='50' md-flex-xsmall='100' md-row :md-gutter='8' style='align-items:flex-start;'>
              <md-layout md-flex='100' md-flex-xsmall='100'>
              <md-input-container>
                <label>Name</label>
                <md-input v-model='yeast.name'></md-input>
              </md-input-container>
              </md-layout>
              <md-layout md-flex='50' md-flex-xsmall='100'>
                <md-input-container>
                  <label>Type</label>
                  <md-input v-model='yeast.type'></md-input>
                </md-input-container>
              </md-layout>
              <md-layout md-flex='50' md-flex-xsmall='100'>
                <md-input-container>
                  <label>Form</label>
                  <md-input v-model='yeast.form'></md-input>
                </md-input-container>
              </md-layout>
              <md-layout md-flex='50' md-flex-xsmall='100'>
                <md-input-container>
                  <label>Attenuation</label>
                  <md-input v-model='yeast.attenuation'></md-input>
                </md-input-container>
              </md-layout>
              <md-layout md-flex='25' md-flex-xsmall='100'>
                <md-input-container >
                  <label>Weight</label>
                  <md-input v-model='yeast.weight'></md-input>
                </md-input-container>
              </md-layout>
              <md-layout md-flex='15' md-flex-xsmall='100'>
                <md-input-container >
                  <label>Unit</label>
                  <md-input disabled v-model='yeast.unit'></md-input>
                </md-input-container>
              </md-layout>
            </md-layout>
            <md-layout>
              <md-input-container >
                <label>Preperation</label>
                <md-textarea v-model='yeast.timeadded'></md-textarea>
              </md-input-container>
            </md-layout>
          </md-layout>
          <!-- NUTRIENTS -->
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: .1">Nutrients</h2>
            <md-button @click.native='addType("nutrients")' class="md-icon-button md-raised md-primary md-dense">
              <md-icon>add</md-icon>
            </md-button>
          </md-toolbar>
          <md-layout :key='"nutrient"+index' v-for='(nutrient, index) in form.nutrients' :md-gutter='8' md-row>
            <md-layout md-flex='30' md-flex-xsmall='100'>
              <md-input-container >
                <label>Nutrient Name</label>
                <md-input v-model='nutrient.name'></md-input>
              </md-input-container>
              </md-layout>
            <md-layout md-flex='10' md-flex-xsmall='100'>
              <md-input-container >
                <label>Weight</label>
                <md-input v-model='nutrient.weight'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='5' md-flex-xsmall='100'>
              <md-input-container >
                <label>Unit</label>
                <md-input v-model='nutrient.unit'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='15' md-flex-xsmall='100'>
              <md-input-container >
                <label>Time (m)</label>
                <md-input v-model='nutrient.timeadded'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='5' md-flex-xsmall='100' style='align-items: center; color: grey;'>
              <md-button @click.native='removeType("nutrients", index)' class="md-icon-button md-raised md-dense">
                <md-icon>delete</md-icon>
              </md-button>
            </md-layout> 
          </md-layout>
    </md-whiteframe>

    <!-- Mash -->
    <md-whiteframe v-show="activeSection === 2" style="padding-top: 20px; padding-left: 30px; padding-right: 30px;" md-elevation="3">
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: 1">Mash</h2>
          </md-toolbar>
          <md-layout :md-gutter='8' md-row>
          <md-layout md-flex='25' md-flex-xsmall='100'>
            <md-input-container>
              <label>Grain Temp</label>
              <md-input v-model='form.mash.grainTemp'></md-input>
            </md-input-container>
            </md-layout>
            <md-layout md-flex='25' md-flex-xsmall='100'>
            <md-input-container>
              <label>Sparge Temp</label>
              <md-input v-model='form.mash.spargeTemp'></md-input>
            </md-input-container>
            </md-layout>  
            <md-layout md-flex='25' md-flex-xsmall='100'>
              <md-input-container>
                <label>ph</label>
                <md-input v-model='form.mash.ph'></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>
          <md-layout md-flex='100' md-flex-xsmall='100'>
              <md-input-container>
                <label>Notes</label>
                <md-textarea v-model='form.mash.notes'></md-textarea>
              </md-input-container>
            </md-layout>
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: 1">Steps</h2>
          </md-toolbar>
          <md-layout v-if="form.mash.steps" :key='"mash"+index' v-for='(step, index) in form.mash.steps' :md-gutter='8' md-row>
            <md-layout md-flex='100' md-flex-xsmall='100' style="float: left; white-space: nowrap;">
              <md-layout :md-gutter='8' md-row>
                <md-layout md-flex='75' md-flex-xsmall='100'>
                  <md-input-container>
                    <label>Name</label>
                    <md-input v-model='step.name'></md-input>
                  </md-input-container>
                  </md-layout>
                  <md-layout md-flex='10' md-flex-xsmall='100'>
                  <md-input-container>
                    <label>Temp</label>
                    <md-input v-model='step.temp'></md-input>
                  </md-input-container>
                  </md-layout>
                  <md-layout md-flex='15' md-flex-xsmall='100'>
                  <md-input-container>
                    <label>End Temp</label>
                    <md-input v-model='step.endTemp'></md-input>
                  </md-input-container>
                  </md-layout>
                  <md-layout md-flex='15' md-flex-xsmall='100'>
                  <md-input-container>
                    <label>Time</label>
                    <md-input v-model='step.time'></md-input>
                  </md-input-container>
                  </md-layout>                      
                  <md-layout md-flex='15' md-flex-xsmall='100'>
                  <md-input-container>
                    <label>Ramp Time</label>
                    <md-input v-model='step.rampTime'></md-input>
                  </md-input-container>
                  </md-layout>        
                  <md-layout md-flex='20' md-flex-xsmall='100'>
                    <md-input-container>
                      <label>Type</label>
                      <md-input v-model='step.type'></md-input>
                    </md-input-container>
                  </md-layout>
                  <md-layout md-flex='15' md-flex-xsmall='100'>
                    <md-input-container>
                      <label>Water Ratio</label>
                      <md-input v-model='step.waterRatio'></md-input>
                    </md-input-container>
                  </md-layout>
                </md-layout>
            </md-layout>
          </md-layout>
    </md-whiteframe>

    <md-whiteframe v-show="activeSection === 3" style="padding-top: 20px; padding-left: 30px; padding-right: 30px;" md-elevation="3">
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: 1">Gravity</h2>
          </md-toolbar>
          <md-layout :key='"grav"+index' v-for='(grav, index) in Object.keys(form.gravity)' :md-gutter='8' md-row>
          <md-layout md-flex='20' md-flex-xsmall='100' style="float: left; white-space: nowrap;">
              {{grav | camel}}
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container >
                <label>Volume</label>
                <md-input v-model='form.gravity[grav].volume'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container >
                <label>Gravity Measured</label>
                <md-input v-model='form.gravity[grav].gravityMeasured'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container >
                <label>Temperature (°F)</label>
                <md-input v-model='form.gravity[grav].temperature'></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container >
                <label>Gravity Corrected</label>
                <md-input v-model='form.gravity[grav].gravityCorrected'></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>
    </md-whiteframe>

    <md-whiteframe v-show="activeSection === 4" style="padding-top: 20px; padding-left: 30px; padding-right: 30px;" md-elevation="3">
          <md-toolbar md-theme="transparent" class="md-dense">
            <h2 class="md-title" style="flex: 1">Admin</h2>
          </md-toolbar>
          <md-layout :md-gutter='8' md-row>
            <md-layout md-flex='100' md-flex-xsmall='100'>
              <md-input-container style="flex:1" >
                <label>Upload</label>
                <md-file id="beerfile" v-model="beerFile" name="Upload Beer XML"></md-file>
              </md-input-container >
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container style="flex:1" >
                <label>Batch Size (L)</label>
                <md-input v-model="batchSize" ></md-input>
              </md-input-container >
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
              <md-input-container style="flex:1" >
                <label>Boil Size (L)</label>
                <md-input v-model="boilSize" ></md-input>
              </md-input-container >
            </md-layout>
            <md-layout md-flex='20' md-flex-xsmall='100'>
               <md-button @click.native='updateSize' class='md-raised md-primary'>Update Size</md-button>
            </md-layout>
          </md-layout>
    </md-whiteframe>

    <!-- new brew dialog -->
    <md-dialog-prompt
      v-model="newName"
      md-title="What's the name of the brew?"
      md-input-placeholder="Brew Name"
      md-ok-text="done"
      md-cancel-text="cancel"
      @close="onNewClose"
      ref="newdialog">
    </md-dialog-prompt>
     <md-dialog-confirm
      md-title="Are you sure you would like to delete the brew?"
      md-content-html="Deletions are permenent. This brew will not be recoverable."
      md-ok-text="confirm"
      md-cancel-text="cancel"
      @close="onDeleteClose"
      ref="deletedialog">
    </md-dialog-confirm>
    <md-snackbar md-position="bottom center" ref="snackbar" :md-duration="0x7FFFFFFF">
      <md-progress v-if="saving" md-indeterminate></md-progress>
      <span v-else>Entries have changed. Save needed.</span>
      <md-button class="md-accent" md-theme="light-blue" @click.native="saveBrew">Save</md-button>
    </md-snackbar>
    <md-snackbar md-position="bottom center" ref="savedbar" :md-duration="4000">
      <span>Saved! Continue to make changes!</span>
    </md-snackbar>
  </div>
</template>

<script>
import brew from '@/api/brew'
import Brauhaus from 'brauhaus'
import beerxml from 'beerxml'
console.log(beerxml)
var form = () => {
  return {
    abv: null,
    abw: null,
    agingDays: null,
    agingTemp: null,
    author: null,
    batchSize: null,
    batchUnit: 'L',
    batchNumber: null,
    boilSize: null,
    boilStartTime: null,
    boilEndTime: null,
    bottlingPressure: null,
    bottlingTemp: null,
    brewDayDuration: null,
    buToGu: null,
    bv: null,
    calories: null,
    color: null,
    description: null,
    fg: null,
    fgPlato: null,
    ibu: null,
    ibuMethod: null,
    mashEfficiency: null,
    og: null,
    ogPlato: null,
    price: null,
    primaryDays: null,
    primaryTemp: null,
    primingCornSugar: null,
    primingDme: null,
    primingHoney: null,
    primingSugar: null,
    realExtract: null,
    secondaryDays: null,
    secondaryTemp: null,
    servingSize: null,
    steepEfficiency: null,
    steepTime: null,
    tertiaryDays: null,
    tertiaryTemp: null,
    timelineMap: null,
    name: '',
    status: '',
    dates: {
      brewed: null,
      racked: null,
      bottled: null
    },
    style: {
      name: '',
      category: '',
      gu: [0, 0],
      fg: [0, 0],
      srm: [0, 0],
      ibu: [0, 0],
      abv: [0, 0],
      carb: [0, 0]
    },
    fermentables: [{
      name: '',
      color: null,
      late: null,
      weight: '',
      unit: 'kg',
      yield: null,
      time: 0
    }],
    spices: [{
      name: '',
      form: '',
      weight: null,
      unit: 'kg',
      use: null,
      aa: null,
      time: 0
    }],
    yeast: [{
      name: '',
      form: null,
      type: null,
      attenuation: null,
      preparation: ''
    }],
    mash: {
      grainTemp: null,
      name: null,
      notes: null,
      ph: null,
      spargeTemp: null,
      steps: [{
        endTemp: null,
        name: null,
        rampTime: null,
        temp: null,
        type: null,
        waterRatio: null
      }]
    },
    clarifiers: '',
    nutrients: [{
      name: '',
      weight: '',
      unit: '',
      timeAdded: null
    }],
    mashGraph: {
      temperature: [],
      time: []
    },
    fermentation: {
      temperature: [],
      time: []
    },
    costs: {
      sugars: null,
      spices: null,
      yeast: null,
      other: null
    },
    gravity: {
      start: {
        volume: null,
        gravityMeasured: null,
        temperature: null,
        gravityCorrected: null
      },
      afterMash: {
        volume: null,
        gravityMeasured: null,
        temperature: null,
        gravityCorrected: null
      },
      drained: {
        volume: null,
        gravityMeasured: null,
        temperature: null,
        gravityCorrected: null
      },
      preBoil: {
        volume: null,
        gravityMeasured: null,
        temperature: null,
        gravityCorrected: null
      },
      postBoil: {
        volume: null,
        gravityMeasured: null,
        temperature: null,
        gravityCorrected: null
      },
      inFermentor: {
        volume: null,
        gravityMeasured: null,
        temperature: null,
        gravityCorrected: null
      },
      afterFermentation: {
        volume: null,
        gravityMeasured: null,
        temperature: null,
        gravityCorrected: null
      },
      bottle: {
        volume: null,
        gravityMeasured: null,
        temperature: null,
        gravityCorrected: null
      }
    },
    notes: [{note: null, time: null}]
  }
}

export default {
  data () {
    return {
      activeSection: 0,
      sections: ['General', 'Recipe', 'Mash', 'Gravity', 'Admin'],
      beerText: '',
      beerFile: null,
      beerObject: null,
      saving: false,
      oldForm: {},
      newName: '',
      form: form(),
      batchSize: null,
      boilSize: null
    }
  },
  mounted () {
    this.routeChange()
  },
  watch: {
    $route: 'routeChange',
    needSave: 'showSaveNote',
    beerFile: 'uploadAndParse'
  },
  computed: {
    needSave () {
      return !window._.isEqual(this.oldForm, this.form)
    },
    costTotal () {
      return Object.keys(this.form.costs).reduce((sum, key) => Number(this.form.costs[key]) + sum, 0)
    }
  },
  filters: {
    camel (input) {
      var _ = window._
      return _.startCase(_.camelCase(input))
    }
  },
  methods: {
    showSaveNote () {
      if (this.needSave) {
        this.$refs.snackbar.open()
      }
    },
    onNewClose (type) {
      if (type === 'ok') {
        brew.postNewBrew({name: this.newName})
          .then(res => {
            this.$router.push({name: 'brew', query: {id: res.data}})
          })
      } else {
        this.$router.go(-1)
      }
    },
    onDeleteClose (type) {
      if (type === 'ok') {
        brew.deleteById(this.$route.query.id)
          .then(res => {
            this.$router.push('monitor')
          })
      }
    },
    saveBrew () {
      this.saving = true
      brew.postById(this.$route.query.id, this.form)
        .then(res => {
          this.$refs.snackbar.close()
          this.$refs.savedbar.open()
          var brew = res.data
          window.setTimeout(() => {
            this.saving = false
          }, 300)
          window._.merge(this.form, brew)
          this.oldForm = window._.cloneDeep(this.form)
        })
    },
    routeChange () {
      this.form = form()
      if (this.$route.query.id) {
        brew.getById(this.$route.query.id)
          .then(res => {
            var brew = res.data
            window._.merge(this.form, brew)
            this.oldForm = window._.cloneDeep(this.form)
            if (this.needSave) {
              this.showSaveNote()
            }
          })
      }
      if (this.$route.params.new) {
        this.$nextTick(() => {
          this.$refs.newdialog.open()
        })
      }
    },
    addType (type) {
      var newHop = window._.mapValues(this.form[type][0], () => null)
      console.log(newHop)
      this.form[type].push(newHop)
    },
    removeType (type, index) {
      if (this.form[type].length === 1) {
        this.addType(type)
      }
      this.form[type].splice(index, 1)
    },
    uploadAndParse () {
      var reader = new window.FileReader()
      reader.readAsText(document.getElementById('beerfile').files[0])
      reader.onload = (evt) => {
        if (evt.target.readyState !== 2) {
          return
        }
        if (evt.target.error) {
          alert('Error while reading file')
          return
        }
        var beerText = evt.target.result
        this.beerObject = beerxml(beerText)[0]
        console.log(this.beerObject)
        window._.merge(this.form, this.beerObject)
      }
    },
    updateSize () {
      var newBrew = new Brauhaus.Recipe(window._.omitBy(this.beerObject, window._.isNil))
      console.log(newBrew)
      newBrew.scale(this.batchSize, this.brewSize)
      window._.merge(this.form, newBrew)
    }
  }
}
</script>

<style scoped>
.has-ripple {
  padding: 20px;
  display: inline-block;
  position: relative;
}

</style>
