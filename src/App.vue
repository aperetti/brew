<template>
  <div id="app">
    <loading v-if="false"></loading> 
    <div v-if='$route.fullPath !== "/"'>
     <md-toolbar class="md-theme-default md-dense md-whiteframe-1dp main-header md-whitefame">
      <md-button class="md-icon-button" md-font-set="material-icons" @click.native="toggleSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <h2 class="md-title" style="flex: 1">{{$route.meta.description || 'Tin-Plated Brew'}}</h2>
    </md-toolbar>
   <side-nav ref='sideNav'></side-nav>
    </div>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import SideNav from '@/components/SideNav'
import Loading from '@/components/Loading'
export default {
  name: 'app',
  components: {
    Loading,
    SideNav
  },
  methods: {
    toggleSidenav () {
      this.$refs.sideNav.$refs.mdSideNav.toggle()
    }
  }
}
</script>

<style>
.container { 
  position: relative;
  z-index: 1;
  display: block;
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
