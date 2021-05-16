<template>
  <div class="d-flex flex-column justify-space-between align-center">


    <v-img
      :aspect-ratio="16/9"
      :width="width"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    ></v-img>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'

  Vue.use(Vuex);


  export default {
    data: () => ({
      width: 300,
    }),
    computed:{

    },
    methods:{
      ...Vuex.mapMutations(['setPageName']),
      ...Vuex.mapActions(['showSnackbar']),
    },
    mounted:      
      function() { 
        this.setPageName("Home");
        this.showSnackbar({text: 'Open Home',type: 'Normal'})
      },
  }
</script>