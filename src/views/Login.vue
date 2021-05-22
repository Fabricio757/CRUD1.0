<template>
<v-container style="max-width:200px;">
    <v-row class="warning" justify="end" align="center"> 
    
        <v-label>{{ nombre }}</v-label>
        <v-btn icon>
            <v-icon class="warning" @click="dialog=true">{{icons.mdiAccount}}</v-icon>
        </v-btn>
        <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
        >
        <v-card @keyup.enter="authenticate">
            <v-card-title>
            <span class="headline">Login</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                    <v-col cols="12">
                        <v-text-field
                        label="Usuario"
                        required
                        v-model="usuario"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                        label="Password"
                        type="password"
                        required
                        v-model="password"
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
                    @click="dialog = false"
                >
                    Cancelar
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="authenticate"
                >
                    Aceptar
                </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-row>
</v-container>
</template>

<script>

import Vue from 'vue'
import Vuex from 'vuex'
import ApiUsers from "../api/ApiUser.js"
import { mdiAccount, mdiDelete } from '@mdi/js';

Vue.use(Vuex)


export default {
    data()
    {
        return {
        dialog: false,
        usuario: '',
        password: '',
        showvar: false,
        nombre: ' - ',
        messagevar: '',
        icons: {
            mdiAccount,
            mdiDelete,
          },
        }
    },

    computed: {
        ...Vuex.mapState(['usuarioLogueado','globalConfig']),
    },
    methods: {
        ...Vuex.mapMutations(['setUsuarioLogueado']),
        ...Vuex.mapActions(['showSnackbar','showProgressCircle']),
        authenticate: async function (){
            try{
                        this.showProgressCircle('overlay');
                        const user = await ApiUsers.login(this.usuario, this.password, this.globalConfig.END_POINT);
                        console.log(user);                        
                        if(! user.isAxiosError){
                            if(user.id !== 0){
                            this.setUsuarioLogueado(user);
                            this.nombre = user.username;
                            this.showProgressCircle(false);
                            this.dialog = false;
                            //this.$router.push('/')
                            }else
                            {
                                this.showProgressCircle(false);
                                this.showSnackbar({text: "User o Password Incorrect", type:"Error"});                
                            }
                        }else{
                            this.showProgressCircle(false);
                            this.showSnackbar({text: user.response.data, type:"Error"});
                        }
            }
            catch(error){
                this.showProgressCircle(false);
                this.showSnackbar({text: error.message, type:"Error"});
            }
            this.showProgressCircle(false);
        }
    }
}
</script>

<style>

    .login{
        padding: 100px;
        height: 300px;
        background-color: coral;
    }
    .espacio{
        height: 40px;        
    }
</style>