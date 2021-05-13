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
    ...Vuex.mapState(['usuarioLogueado', 'pageName']),
    ...Vuex.mapGetters(['animalesAcc']),
    },
    methods:{
        ...Vuex.mapMutations(['setPageName']),
        getAves: async function(){  

            this.animalesAcc.resetOperaciones();
            this.animalesAcc.addOperacion("Seleccion", "Aves", null);
            var body = this.animalesAcc.prepareBody();

            var response = await this.animalesAcc.execute(body);
            this.aves = response;
            
        }
    },
    mounted:      
      async function() { 
        this.setPageName("Aves");
        await this.getAves();
      }
}
</script>


