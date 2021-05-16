<template>
  <div class="text-center">
    <v-btn
      dark
      color="orange"
      @click="text = 'click'; showSnackbar({text: 'Fabricio',type: 'Error'});"
    >
      Open Snackbar
    </v-btn> 
  </div>
</template>

<script>

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

  export default {
    data: () => ({
    }),    
    computed:{
      
          },
    mounted: function() {
      this.showSnackbar({text: 'Open Test',type: 'Normal'})
    },
  methods:{
    ...Vuex.mapActions(['showSnackbar']),
  },
  }
</script>