<template>
  <v-data-table
    :headers="headers"
    class="elevation-1"
    dark
    :items.sync="items"
    :page.sync="page"
    :items-per-page.sync="itemsPerPage"
    :server-items-length="serveritemslength"
    :multi-sort=false
    :sort-by.sync="sortby"
    :sort-desc.sync="sortdesc"
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
          max-width="900px"
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
                      label="Especie"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select
                      v-model="editedItem.cantidadPatas"
                      :items="itemPatas"
                      label="Cantidad de Patas"
                      dense
                  ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-checkbox
                      v-model="editedItem.oviparo"
                      label="Oviparo"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-checkbox
                      v-model="editedItem.volador"
                      label="Volador"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-checkbox
                      v-model="editedItem.marino"
                      label="Marino"
                    ></v-checkbox>
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
        @click="this.getItems()"
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
      page: 1,
      itemsPerPage: 5,
      serveritemslength: 0,    
      sortby: ['id'],
      sortdesc: [true],
      lastSortBy: 'id',
      lastSortDesc: true,
      newOrderCol: true,
      
      checkbox: true,

      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Especie', value: 'nombre' },
        { text: 'Cantidad Patas', value: 'cantidadPatas' },
        { text: 'Oviparo', value: 'oviparo' },
        { text: 'Volador', value: 'volador' },
        { text: 'Marino', value: 'marino' },

        { text: 'Actions', value: 'actions', sortable: false },
      ],
      search: '',
      items: [],
      itemPatas: [0, 2, 4],
      editedIndex: -1,
      isItemIdVisible: false,
      editedItem: {
        id: 0,
        especie: '',
        cantidadPatas: 0,
        marino: false,
        volador: false,
        oviparo: false,
      },
      defaultItem: {
        id: 0,
        especie: '',
        cantidadPatas: 0,
        marino: false,
        volador: false,
        oviparo: false,        
      },
    }),
    lastsortDesc: true,
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
      page(){
        this.getItems();
      },
      itemsPerPage(){
        this.getItems();
      },
      search(){
        this.getItems();
      },
      sortby(){        
        console.log("click sortby: " + this.sortby);
        this.newOrderCol = false;
        if(this.sortby[0]){
          if (this.sortby[0] != this.lastSortBy){
            this.newOrderCol = true;
            this.lastSortBy = this.sortby[0];
            this.lastSortDesc = "false";
            console.log("Col: " + this.lastSortBy);
            //console.log(this.lastSortDesc);
            this.getItems();
          }
        }          
      },
      sortdesc(){
        console.log("click sortdesc: " + this.sortdesc[0]);
        //this.lastSortDesc = !this.lastSortDesc;
        if (! this.newOrderCol){            
            if(this.sortdesc[0] == true){
              this.lastSortDesc = true;
              this.getItems();
            }
            if(this.sortdesc[0] == false){
              this.lastSortDesc = false;
              this.getItems();
            }
        }else{
          this.lastSortDesc = true;
          this.getItems();
        }

        this.newOrderCol = false;
      },
    },
    methods: {
       ...Vuex.mapMutations(['setPageName']),
       ...Vuex.mapActions(['showSnackbar']),

       getItems: async function(){
          try{
            this.animalesAcc.resetOperaciones();
            var args = [];
            args.push({'search': this.search, 'type': 'VARCHAR'});
            args.push({'pageNumber': this.page, 'type': 'INT'});
            args.push({'itemsPerPage': this.itemsPerPage, 'type': 'INT'});
            args.push({'sortby': this.lastSortBy, 'type': 'VARCHAR'});
            args.push({'sortdesc': (this.lastSortDesc ? 'DESC' : 'ASC'), 'type': 'VARCHAR'});
            this.animalesAcc.addOperacion("Procedure", "getMamiferos", JSON.stringify(args));

            var response = await this.animalesAcc.execute();
            if(response.error === "false"){
              this.items = response.resultados[0].R1;
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
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.isItemIdVisible = true
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.items.indexOf(item)
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
           this.showSnackbar({text: response.message, type:"Error"});
        }else{
          this.showSnackbar({text: "deleted", type:"Normal"});
          this.items.splice(this.editedIndex, 1)          
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
          try{
            var idEdit = (this.editedIndex > -1 ? true : false);
            if (idEdit) {
              this.animalesAcc.resetOperaciones();
              args = [];
              args.push({'id': this.editedItem.id, 'key': 'INT'});
              args.push({ 'nombre' : this.editedItem.nombre, 'type':'VARCHAR'});
              args.push({ 'cantidadPatas' : this.editedItem.cantidadPatas, 'type':'INT'});
              args.push({ 'oviparo' : this.editedItem.oviparo, 'type':'BIT'});
              args.push({ 'marino' : this.editedItem.marino, 'type':'BIT'});
              args.push({ 'volador' : this.editedItem.volador, 'type':'BIT'});
              this.animalesAcc.addOperacion("Update", "Mamiferos", JSON.stringify(args));
              response = await this.animalesAcc.execute();

            } else {
              this.animalesAcc.resetOperaciones();
              args = [];
              //args.push({'id': this.editedItem.id, 'key': 'int'});
              args.push({ 'nombre' : this.editedItem.nombre, 'type':'VARCHAR'});
              args.push({ 'cantidadPatas' : this.editedItem.cantidadPatas, 'type':'INT'});
              args.push({ 'oviparo' : this.editedItem.oviparo, 'type':'BIT'});
              args.push({ 'marino' : this.editedItem.marino, 'type':'BIT'});
              args.push({ 'volador' : this.editedItem.volador, 'type':'BIT'});

              this.animalesAcc.addOperacion("Procedure", "Mamiferos_Insert", JSON.stringify(args));
              response = await this.animalesAcc.execute();  
              if(response.error === "false")
                this.editedItem.id = parseInt(response.resultados[0]["R1"][0].id);
            }

            if(response.error === "true"){
                this.showSnackbar({text: response.message, type:"Error"});          
            }else{
              if (idEdit) {
                Object.assign(this.items[this.editedIndex], this.editedItem);
                this.showSnackbar({text: "saved", type:"Normal"});
              }else
              {
                this.items.push(this.editedItem);
                this.showSnackbar({text: "added", type:"Normal"});
              }
            }
            this.close()
          } 
          catch(error){
            this.showSnackbar({text: error, type:"Error"});
          }       

      },
    },
    mounted:      
      function() { 
        this.getItems()
        this.setPageName("Mamíferos");
        this.showSnackbar({text: 'Open Mamíferos', type: 'Normal'});
      },
  }



</script>