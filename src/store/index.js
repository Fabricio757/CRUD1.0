import Vue from 'vue'
import Vuex from 'vuex'
import { Principal } from "../api/Endpoint";


Vue.use(Vuex);


let Acceso = class {
  constructor(base) {
    this.BaseDatos = base;
    this.operaciones = [];
    this.UsuarioLogueado = '';
  }
  addOperacion (operacion, tabla, args)
  {
    let item = [operacion, tabla, args];
    this.operaciones.push(item);
  }
  addOperacionProcedure (operacion, procedureName, args)
  {
    let item = [operacion, procedureName, args];
    this.operaciones.push(item);
  }
  resetOperaciones()
  {
    this.operaciones = [];
  }
  prepareBody()
  {   

    //var body = {"Input": "{'BaseDatos': 'TestDB','Operaciones':[{'Op': 'Seleccion','tabla':'Aves','args':[{'id':'1'}]}]}"};

      var bodyOp = "{'BaseDatos': 'TestDB', 'Operaciones':[";
        for(var i = 0; i < this.operaciones.length; i++){
          var item = this.operaciones[i];
          if(item[2]  == null){
            bodyOp += "{'Op': '" + item[0] + "', "+ (item[0] === "Procedure" ? 'procedureName' : 'tabla' ) + ": '" + item[1] + "' }";
          }
          else{
            bodyOp += "{'Op': '" + item[0] + "', "+ (item[0] === "Procedure" ? 'procedureName' : 'tabla' ) + ": '" + item[1] + "', 'args': " + item[2] + " }";
          }
          
        }
      bodyOp += "]}";  

      var body =  { Input: bodyOp};

      return body;
  }

  async execute ()
  {
    var args = [];
    try{
          if(this.usuarioLogueado)
          {
              var inputText = this.prepareBody(inputText);
              console.log(inputText);
              let myvalue =JSON.stringify(inputText);

              const requestOptions = {
                  method: 'POST',
                  headers: {
                              'Authorization': 'Bearer ' + this.usuarioLogueado.token,
                              'Content-Type' : 'application/json'
                          },
                  body: myvalue
              };
      
              const response = await fetch(Principal.END_POINT + "Db/Input", requestOptions);
              if(response.status !== 200)
              {
                console.log(response.status);
                args.push({'error': response.statusText});
                console.log(response.statusText);
                return {"resultados": [{"R1": {"Error": response.statusText}}], "error": "true"};
              }
              const json = await response.json();
              return json;
            
          } else 
          {
              return {"resultados": [{"R1": {"Error": "login failed"}}], "error": "true"};
          }
       }
    catch(error)
    {      
      args.push({'error': error.message});
      console.log(error.message);
      return {"resultados": [{"R1": {"Error": JSON.stringify(args)}}], "error": "true"};
    }
  }
};

export default new Vuex.Store({
  state: {
    usuarioLogueado: "",
    animales: new Acceso("'TestDB'"),
    pageName: "default",
    snackbar: {"show":false},
    progressCircle: false,
  },
  getters: {
      animalesAcc: state => { state.animales.usuarioLogueado = state.usuarioLogueado; return state.animales },
      //snackbar: state => {return state.snackbar},
  },
  mutations: {
    setUsuarioLogueado (state, user) {
      // mutate state
      state.usuarioLogueado = user;
    },
    setPageName (state, pagename) {
      state.pageName = pagename;
    },    
    SET_PROGRESSCIRCLE (state, value) {
      state.progressCircle = value;
    },
    SET_SNACKBAR(state, snackbar) {      
      snackbar.show = true;
      state.snackbar = snackbar;   
    },
  },
  actions: {
    showProgressCircle({commit}, value) {      
      //var valor = (value ? 'overlay' : 'false');
      console.log(value);
      commit('SET_PROGRESSCIRCLE', value);
    },
    showSnackbar({commit}, snackbar) {
      commit('SET_SNACKBAR', snackbar);
    },
  },
  modules: {
    
  }
})
