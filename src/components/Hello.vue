<template>
<div class="container">
    <md-whiteframe md-elevation="5" style="padding:20px;">
    <img class='logo' src="../assets/logo.png"></img>
      <md-whiteframe md-elevation="5" style="padding:20px;">
    <md-layout md-gutter="8" md-align="center">
      <md-layout md-flex="40" md-flex-xsmall="100"> 
        <md-input-container>
          <label>Username</label>
          <md-input v-model='username' />
        </md-input-container>
      </md-layout>
      <md-layout md-flex="40" md-flex-xsmall="100">
        <md-input-container >
          <label>Password</label>
          <md-input v-model='password' type='password' @keyup.enter.native='login'/>
        </md-input-container>
      </md-layout>
      <md-layout md-flex="20" md-flex-xsmall="100">
        <md-button class="md-raised md-primary" style='width: 100%;' @keyup.enter.native='login' @click.native='login'>Login</md-button>
      </md-layout>
    </md-layout>
    </md-whiteframe>
    </md-whiteframe>
  </div>
</template>

<script>
import auth from '../api/auth'
export default {
  name: 'hello',
  data () {
    return {
      msg: `Tin Plated`,
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      auth.getToken(this.username, this.password)
        .then(res => {
          this.$setToken(res.data.token)
          this.$router.push('monitor')
        }).catch(res => {
          console.log(res)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container { 
  position: relative;
  z-index: 1;
  display: block;
  padding: 16px;
  overflow: auto;
  max-width: 800px;
  margin: 0 auto;
}
h1, h2 {
  font-weight: normal;
  text-align: center;
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
.logo {
    display: block;
    margin: auto;
    width: 100%;
    max-width: 500px;;
    max-height:100%
}
</style>
