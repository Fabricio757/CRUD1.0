
//import { Config } from "./Config";
import axios from "axios";

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


export default {
    login: async function(usuario, password,end_point){
        let requestAxiosOptions = {
            username: usuario,
            password: password
        };

        try{
            let response = await axios.post(end_point + "users/authenticate", requestAxiosOptions)
            return response.data;
        }
        catch (error) {
            return error;
        }
    },
}