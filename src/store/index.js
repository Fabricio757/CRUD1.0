import Vue from 'vue'
import Vuex from 'vuex'
import { Principal } from "../api/Endpoint";


Vue.use(Vuex)

// function handleResponse(response) {
//   return response.text().then(text => {
//       const data = text && JSON.parse(text);
//       if (!response.ok) {
//           if (response.status === 401) {
//               // auto logout if 401 response returned from api
//               //logout();
//               location.reload(true);
//           }

//           const error = (data && data.message) || response.statusText;
//           return Promise.reject(error);
//       }
//       return data;
//   });
// }



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
            bodyOp += "{'Op': '" + item[0] + "', 'tabla': '" + item[1] + "' }";
          }
          else{
            bodyOp += "{'Op': '" + item[0] + "', 'tabla': '" + item[1] + "', 'args': " + item[2] + " }";
          }
          
        }
      bodyOp += "]}";  

      var body =  { Input: bodyOp};

      return body;
  }

  async execute ()
  {
    try{
          if(this.usuarioLogueado)
          {
              var inputText = this.prepareBody(inputText);
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
              console.log(response);
              const json = await response.json();
              console.log(json);
              return json;
            
          } else 
          {
              return {"resultados": [{"1": {"Error": "login failed"}}], "error": "true"};
          }
       }
    catch(error)
    {
      var args = [];
      args.push({'error': error.message});
      console.log(error.message);
      return {"resultados": [{"1": {"Error": JSON.stringify(args)}}], "error": "true"};
    }
  }
};

export default new Vuex.Store({
  state: {
    usuarioLogueado: "",
    animales: new Acceso("'TestDB'"),
    pageName: "Home",
  },
  getters: {
      animalesAcc: state => { state.animales.usuarioLogueado = state.usuarioLogueado; return state.animales }
  },
  mutations: {
    setUsuarioLogueado (state, user) {
      // mutate state
      state.usuarioLogueado = user;
    },
    setPageName (state, pagename) {
      state.pageName = pagename;
    }
  },
  actions: {
  },
  modules: {
    
  }
})
