<template>
  <v-app>
    <v-toolbar app dense class="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>CRUD1.0</v-toolbar-title>
      <v-spacer></v-spacer>
      <Login></Login>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" temporary>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <v-avatar>
              <img src="https://yt3.ggpht.com/yti/ANoDKi5usfKtbyQX1ZL1UxmpZuiBW7slRogXrrqNJ4S1ZQ=s88-c-k-c0x00ffffff-no-rj-mo" alt="">
            </v-avatar>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <router-link to="/">Home</router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/Aves">Aves</router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/Mammals">Mammals</router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/Test">Test</router-link>
      </v-list-item>      

    </v-navigation-drawer>    
    <v-main>
      <router-view/>

  <v-row align="center" justify="center">
      <v-row justify="center">
        <v-overlay  z-index="1000" :value="$store.state.progressCircle" >
          <v-progress-circular :size="50" color="primary" indeterminate ></v-progress-circular>
          <!-- <v-btn @click="$store.state.progressCircle=false">close</v-btn> -->
        </v-overlay>
      </v-row>
  </v-row>

    </v-main>

    <v-footer dark> 
        <v-card>    
          <v-card-text class="white--text">
              {{ new Date().getFullYear() }} —  <strong>CRUD1.0</strong> / {{ this.pageName }}
          </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
        <v-card>
          <v-snackbar v-model="$store.state.snackbar.show" :timeout="3500" absolute right shaped :color="snakbarColor" >
            <label :class="{ snackTextNormal: isNormal, snackTextError: isError }">{{ $store.state.snackbar.text }}</label>
            <v-btn icon>
              <v-icon class="warning" @click="$store.state.snackbar.show=false">X</v-icon>
            </v-btn>
          </v-snackbar>
        </v-card>
    </v-footer>

  </v-app>
</template>
<script>


import Login from './views/Login.vue';
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
  components: { Login },
  name: 'App',

  data: () => ({
    drawer: true,
  }),
  computed:{
          ...Vuex.mapState(['pageName','progressCircle','globalConfig']),   
          ...Vuex.mapGetters(['snackbar']),  
                         
          isNormal() { return (this.$store.state.snackbar.type === 'Normal')},
          isError() { return (this.$store.state.snackbar.type === 'Error')},
          snakbarColor() { return (this.$store.state.snackbar.type === 'Normal' ? "primary" : "error")},
  },
  methods:{
    ...Vuex.mapActions(['showSnackbar']),
    ...Vuex.mapMutations(['setGlobalConfig']),
  },
  mutations: {

  },
  mounted: function() {

  },
  created: async function(){
    const res = await fetch(process.env.BASE_URL + "config.json");
    const config = await res.json();
    this.setGlobalConfig(config);    
  }
};
</script>

<style scoped>
  .snackTextError{
    color:white;
  } 
  
  .snackTextNormal{
    color: blue;
  }

</style>