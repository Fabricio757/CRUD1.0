
import { Principal } from "./Endpoint";
import axios from "axios";

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)



function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                //logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

export default {
    login: async function(usuario, password){
        let requestAxiosOptions = {
            username: usuario,
            password: password
        };

        try{
            let response = await axios.post(Principal.END_POINT + "users/authenticate", requestAxiosOptions)
            return response.data;
        }
        catch (error) {
            return error;
        }
    },
    access: async function(usuarioLogueado, inputText){

        if(usuarioLogueado){

            let myvalue =JSON.stringify({"Input": inputText});
            const requestOptions = {
                method: 'POST',
                headers: {
                            'Authorization': 'Bearer ' + usuarioLogueado.token,
                            'Content-Type' : 'application/json'
                         },
                body: myvalue
            };

            return await fetch(Principal.END_POINT + "Db/Input", requestOptions).then(handleResponse)
            .then(res => {
                console.log("res: ");
                return res.resultados;
            });

        } else {
            return null;
        }
    } ,
    getAll: async function(usuarioLogueado){

        if(usuarioLogueado){

            let myvalue =JSON.stringify({"Input": "{'BaseDatos': 'TestDB','Operaciones':[{'Op': 'Seleccion','tabla':'Mamiferos','args':[]}]}"});
            const requestOptions = {
                method: 'POST',
                headers: {
                            'Authorization': 'Bearer ' + usuarioLogueado.token,
                            'Content-Type' : 'application/json'
                         },
                body: myvalue
            };


            // console.log("requestOptions");
            // console.log(requestOptions);
            // let response = await axios.post(Principal.END_POINT + "Db/Input", requestOptions);
            // console.log(response);
            // return response;


            return await fetch(Principal.END_POINT + "Db/Input", requestOptions).then(handleResponse)
            .then(res => {
                console.log("res: ");
                return res.resultados;
            });



        } else {
            return null;
        }
    } ,
    postAllUsers: async function(usuarioLogueado){

        if(usuarioLogueado){

            const requestAxiosOptions = {
                method: 'POST',
                //headers: { 'Authorization': 'Bearer ' + usuarioLogueado.token },
                Input: "{'BaseDatos': 'TestDB','Operaciones':[{'Op': 'Seleccion','tabla':'Aves','args':[]}]}"
            };

            // let response = await axios.get(Principal.END_POINT + "Db/Get", requestAxiosOptions);
            let response = axios.post(Principal.END_POINT + "users/post", requestAxiosOptions);
            console.log("AU gAU: "); console.log(response.data);
            return response.data;

        } else {
            return null;
        }
    }
}