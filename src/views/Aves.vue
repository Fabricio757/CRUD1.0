<template>
    <v-app class="primary">
        <v-data-table
          :headers="headers"
          :items="aves"
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
                { text: 'Especie', value: 'especie' },
                ],
            aves: [],
        }
    },
    computed: {
    ...Vuex.mapState(['usuarioLogueado', 'animales', 'pageName']),
    },
    methods:{
        ...Vuex.mapMutations(['setPageName']),
        getAll: async function(){
            
            this.animales.resetOperaciones();
            this.animales.addOperacion("Seleccion", "Aves", null);
            var body = this.animales.prepareBody();


            var response = await this.animales.execute(this.usuarioLogueado, body);
            this.aves = response[0][1];
        }
    },
    mounted:      
      async function() { 
        this.setPageName("Aves");
        await this.getAll();
      }
}
</script>


