
import { Principal } from "./Endpoint";
import axios from "axios";

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


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
}