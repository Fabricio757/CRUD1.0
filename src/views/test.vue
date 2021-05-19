<template>
<div>
  <v-data-table
    :headers="headers"
    :items.sync="aves"
    class="elevation-1"
    dark
    :page.sync="l_page"
    :items-per-page.sync="l_itemsPerPage"
    :server-items-length="serveritemslength"
  >
  </v-data-table>
</div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'

  Vue.use(Vuex);


  export default {
    data: () => ({
      l_itemsPerPage: 5,
      l_page: 1,
      serveritemslength: 0,


      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Especie', value: 'especie' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      search: '',
      aves: [],
      editedIndex: -1,
      isItemIdVisible: false,
      editedItem: {
        id: 0,
        especie: '',
      },
      defaultItem: {
        id: 0,
        especie: '',
      },
    }),

    computed: {
      ...Vuex.mapState(['usuarioLogueado', 'pageName']),
      ...Vuex.mapGetters(['animalesAcc']),
      formTitle () {
        console.log('formTitle');
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },      
      // suma(){
      //   this.getAves();
      //   return this.l_itemsPerPage + this.l_page;
      // }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      l_page(){
        this.getAves();
      },
    },
    methods: {
       ...Vuex.mapMutations(['setPageName']),
       ...Vuex.mapActions(['showSnackbar']),
       getAves: async function(){
            try{
              this.animalesAcc.resetOperaciones();
              var args = [];
              args.push({'search': '', 'type': 'VARCHAR'});
              args.push({'pageNumber': this.l_page, 'type': 'INT'});
              args.push({'itemsPerPage': this.l_itemsPerPage, 'type': 'INT'});
              this.animalesAcc.addOperacion("Procedure", "getAves", JSON.stringify(args));

              var response = await this.animalesAcc.execute();
              if(response.error === "false"){
                this.aves = response.resultados[0].R1;
                this.serveritemslength = response.resultados[1].R2[0].totalRows;
              }
              else{
                this.showSnackbar({text: response.message, type:"Error"});
              }
            }
            catch(error) {
              this.showSnackbar({text: error.message, type:"Error"});
            }
        },

      editItem (item) {
        this.editedIndex = this.aves.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.isItemIdVisible = true
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.aves.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        this.animalesAcc.resetOperaciones();
        var response = '';
        var args = [];
        args.push({'id': this.editedItem.id, 'key': 'INT'});
        //args.push({ 'especie' : this.editedItem.especie, 'type':'string'});
        this.animalesAcc.addOperacion("Delete", "Aves", JSON.stringify(args));
        response = await this.animalesAcc.execute();

        if(response.error === "true"){
           this.showSnackbar({text: response.resultados[0]["R1"], type:"Error"});
        }else{
          this.showSnackbar({text: "deleted", type:"Normal"});
          this.aves.splice(this.editedIndex, 1)          
        }
        
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.isItemIdVisible = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      async save () {
        var response = '';
        var args = [];
        var idEdit = (this.editedIndex > -1 ? true : false);
        if (idEdit) {
          this.animalesAcc.resetOperaciones();
          args = [];
          args.push({'id': this.editedItem.id, 'key': 'INT'});
          args.push({ 'especie' : this.editedItem.especie, 'type':'VARCHAR'});
          this.animalesAcc.addOperacion("Update", "Aves", JSON.stringify(args));
          response = await this.animalesAcc.execute();

        } else {
          this.animalesAcc.resetOperaciones();
          args = [];
          //args.push({'id': this.editedItem.id, 'key': 'int'});
          args.push({ 'especie' : this.editedItem.especie, 'type':'VARCHAR'});
          this.animalesAcc.addOperacion("Procedure", "Aves_Insert", JSON.stringify(args));
          response = await this.animalesAcc.execute();  
          this.editedItem.id = parseInt(response.resultados[0]["R1"][0].id);
          console.log(response);        
        }


        if(response.error === "true"){
            this.showSnackbar({text: response.resultados[0]["R1"], type:"Error"});           
        }else{
          if (idEdit) {
            Object.assign(this.aves[this.editedIndex], this.editedItem);
            this.showSnackbar({text: "saved", type:"Normal"});
          }else
          {
            this.aves.push(this.editedItem);
            this.showSnackbar({text: "added", type:"Normal"});
          }
        }
        this.close()
      },
    },
    mounted:      
      function() { 
        this.getAves(this.l_page, this.l_itemsPerPage)
        this.setPageName("Aves");
        this.showSnackbar({text: 'Open Aves', type: 'Normal'});
      },
  }
</script>