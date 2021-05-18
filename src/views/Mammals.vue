<template>
  <v-data-table
    :headers="headers"
    :items="mammals"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Mamiferos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="secondary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
            </v-btn>
          </template> 
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col v-if="isItemIdVisible"
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.id"
                      label="ID"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'

  Vue.use(Vuex);


  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      search: '',
      mammals: [],
      editedIndex: -1,
      isItemIdVisible: false,
      editedItem: {
        id: 0,
        nombre: '',
      },
      defaultItem: {
        id: 0,
        nombre: '',
      },
    }),

    computed: {
      ...Vuex.mapState(['usuarioLogueado', 'pageName']),
      ...Vuex.mapGetters(['animalesAcc']),
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    methods: {
       ...Vuex.mapMutations(['setPageName']),
       ...Vuex.mapActions(['showSnackbar']),
       getMammals: async function(){
            try{
              this.animalesAcc.resetOperaciones();
              this.animalesAcc.addOperacion("Seleccion", "Mamiferos", null);

              var response = await this.animalesAcc.execute();
              if(response.error === "false"){
                this.mammals = response.resultados[0]["R1"];
              }
              else{
                this.showSnackbar({text: response.resultados[0]["R1"].Error, type:"Error"});
              }
            }
            catch(error) {
              this.showSnackbar({text: error.message, type:"Error"});
            }
        },
      initialize () {

      },

      editItem (item) {
        this.editedIndex = this.mammals.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.isItemIdVisible = true
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.mammals.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        this.animalesAcc.resetOperaciones();
        var response = '';
        var args = [];
        args.push({'id': this.editedItem.id, 'key': 'INT'});
        this.animalesAcc.addOperacion("Delete", "Mamiferos", JSON.stringify(args));
        response = await this.animalesAcc.execute();

        if(response.error === "true"){
           this.showSnackbar({text: response.resultados[0]["R1"], type:"Error"});
        }else{
          this.showSnackbar({text: "deleted", type:"Normal"});
          this.mammals.splice(this.editedIndex, 1)          
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
          args.push({ 'nombre' : this.editedItem.nombre, 'type':'VARCHAR'});
          this.animalesAcc.addOperacion("Update", "Mamiferos", JSON.stringify(args));
          response = await this.animalesAcc.execute();

        } else {
          this.animalesAcc.resetOperaciones();
          args = [];
          //args.push({'id': this.editedItem.id, 'key': 'int'});
          args.push({ 'nombre' : this.editedItem.nombre, 'type':'VARCHAR'});
          this.animalesAcc.addOperacion("Procedure", "Mamiferos_Insert", JSON.stringify(args));
          response = await this.animalesAcc.execute();  
          this.editedItem.id = parseInt(response.resultados[0]["R1"][0].id);
          console.log(response);        
        }


        if(response.error === "true"){
            this.showSnackbar({text: response.resultados[0]["R1"], type:"Error"});           
        }else{
          if (idEdit) {
            Object.assign(this.mammals[this.editedIndex], this.editedItem);
            this.showSnackbar({text: "saved", type:"Normal"});
          }else
          {
            this.mammals.push(this.editedItem);
            this.showSnackbar({text: "added", type:"Normal"});
          }
        }
        this.close()
      },
    },
    mounted:      
      function() { 
        this.getMammals()
        this.setPageName("Mamíferos");
        this.showSnackbar({text: 'Open Mamíferos', type: 'Normal'});
      },
  }
</script>