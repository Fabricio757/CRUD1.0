<template>
    <v-app class="primary">
        <v-data-table
          :headers="headers"
          :items="mammals"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
    </v-app>  
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'

  Vue.use(Vuex);


  export default {
    data () {
      return {
        headers: [
          {
            text: 'ID',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          { text: 'nombre', value: 'nombre' },
        ],
        mammals: [],
      }
    },
    computed:{
        ...Vuex.mapGetters(['animalesAcc']),
    },
    methods:{
        getMammals: async function(){
            
            this.animalesAcc.resetOperaciones();
            this.animalesAcc.addOperacion("Seleccion", "Mamiferos", null);

            var response = await this.animalesAcc.execute();
            if(response.error === "false"){
              this.mammals = response.resultados[0][1];
            }
        }
    },
    mounted:      
      async function() { 
        await this.getMammals();
      }
  }
</script>
