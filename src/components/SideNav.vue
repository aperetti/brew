<template>
   <md-sidenav class="md-left" ref="mdSideNav" @open='getBrewList'>
      <md-toolbar class="md-large md-toolbar md-theme-default">
        <div class="md-toolbar-container">
          <h3 class="md-title">Menu</h3>
        </div>
      </md-toolbar>
      <md-list>
        <md-list-item>
          <router-link to='monitor'>
            <md-icon>multiline_chart</md-icon><span>Monitor </span>
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link to='kegs'>
            <md-icon>local_bar</md-icon><span>Kegs </span>
          </router-link>
        </md-list-item>
        <md-list-item @click.native='logout'>
            <md-icon>exit_to_app</md-icon><span>Logout</span>
        </md-list-item>
        <md-list-item>
        <router-link :to="{ name: 'brew', params: { new: true }}" exact>
          <md-icon>add</md-icon><span>Add Brew </span>
        </router-link>
        </md-list-item>
      </md-list>
      <md-divider></md-divider>
      <md-list>
        <md-list-item>
          <md-icon>whatshot</md-icon> <span>Current Brews</span>
          <md-list-expand>
            <md-list>
              <md-list-item
                v-bind:key="index"
                v-for='(brew, key, index) in brews'
                class="md-inset">
                  <router-link :to="{name: 'brew', query: { id: brew._id }}" exact>{{brew.name}}</router-link>
              </md-list-item>
            </md-list>
          </md-list-expand>
        </md-list-item>
      </md-list>
    </md-sidenav>
</template>

<script>
import brew from '@/api/brew'
export default {
  watch: {
    $route: 'closeSide'
  },
  data () {
    return {
      brews: []
    }
  },
  methods: {
    logout () {
      this.$logout()
      this.$router.push('/')
    },
    closeSide () {
      this.$refs.mdSideNav.close()
    },
    getBrewList () {
      brew.getBrewList()
      .then(res => {
        this.brews = res.data
      })
    }
  },
  mounted () {
    this.getBrewList()
  }
}
</script>
