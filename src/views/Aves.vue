<template>
  <v-data-table
    :headers="headers"
    :items="aves"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Aves</v-toolbar-title>
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
                      v-model="editedItem.especie"
                      label="Especie"
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
        { text: 'Especie', value: 'especie' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      //desserts: [],
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
    mounted:      
      function() { 
        this.getAves()
        this.setPageName("Home");
      },
    methods: {
       ...Vuex.mapMutations(['setPageName']),
       getAves: async function(){
            
            this.animalesAcc.resetOperaciones();
            this.animalesAcc.addOperacion("Seleccion", "Aves", null);
            //var body = this.animalesAcc.prepareBody();

            var response = await this.animalesAcc.execute();
            if(response.error === "false"){
              this.aves = response.resultados[0][1];
            }
            else{
              alert(response.resultados[0][1].Error);
            }
        },
      initialize () {

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
        args.push({'id': this.editedItem.id, 'key': 'int'});
        //args.push({ 'especie' : this.editedItem.especie, 'type':'string'});
        this.animalesAcc.addOperacion("Delete", "Aves", JSON.stringify(args));
        response = await this.animalesAcc.execute();

        this.aves.splice(this.editedIndex, 1)

        if(response.error === "true"){
           alert(response.resultados[0][1].Error);
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
        if (this.editedIndex > -1) {
          this.animalesAcc.resetOperaciones();
          args = [];
          args.push({'id': this.editedItem.id, 'key': 'int'});
          args.push({ 'especie' : this.editedItem.especie, 'type':'string'});
          this.animalesAcc.addOperacion("Update", "Aves", JSON.stringify(args));
          response = await this.animalesAcc.execute();
          Object.assign(this.aves[this.editedIndex], this.editedItem)
        } else {
          this.animalesAcc.resetOperaciones();
          args = [];
          //args.push({'id': this.editedItem.id, 'key': 'int'});
          args.push({ 'especie' : this.editedItem.especie, 'type':'string'});
          this.animalesAcc.addOperacion("Insert", "Aves", JSON.stringify(args));
          response = await this.animalesAcc.execute();

          this.aves.push(this.editedItem)
        }
        if(response.error === "true"){
           alert(response.resultados[0][1].Error);
        }
        this.close()
      },
    },
  }
</script>