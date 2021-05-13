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
    data(){
        return {
            headers: [
                {
                    text: 'ID',
                    align: 'start',
                    sortable: false,
                    value: 'id',
                },
                { text: 'Especie', value: 'nombre' },
                ],
            mammals: [],
        }
    },
    computed: {
    ...Vuex.mapState(['usuarioLogueado', 'pageName']),
    ...Vuex.mapGetters(['animalesAcc']),
    },
    methods:{
        ...Vuex.mapMutations(['setPageName']),
        getMammals: async function(){
            
            this.animalesAcc.resetOperaciones();
            this.animalesAcc.addOperacion("Seleccion", "Mamiferos", null);
            var body = this.animalesAcc.prepareBody();


            var response = await this.animalesAcc.execute(body);
            this.mammals = response;
        }
    },
    mounted:
      
      async function() { 
          this.setPageName("Mamíferos");
        await this.getMammals();
      }
}
</script>


