<!-- <template>

    <div>
        <b-container class="login mt-3">
            <b-row>
                <b-col></b-col>
                <b-col>
                    <b-form>
                        <b-row align-h="center" class="mr-3 ml-3">
                            <b-form-input type="text" placeholder="Usuario" v-model="usuario"></b-form-input>
                        </b-row>

                        <b-row align-h="center" class="m-3">
                            <b-form-input type="text" placeholder="Password" v-model="password"></b-form-input>
                        </b-row>

                        <b-row align-h="center" class="m-3">
                            <b-button class="p-3 m-3" pill variant="outline-primary" @click="authenticate">Login</b-button> 
                            <b-button class="p-3 m-3" pill variant="outline-primary" @click="$router.go(-1)">Cancel</b-button>
                        </b-row>
                    </b-form>
                </b-col>
                <b-col></b-col>
            </b-row>
            <b-alert :show="showvar" v-text="messagevar" variant="danger">Default Alert</b-alert>
        </b-container>
    </div> 
</template>-->

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
        <v-card>
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
        ...Vuex.mapState(['usuarioLogueado']),
    },
    methods: {
        ...Vuex.mapMutations(['setUsuarioLogueado']),
        authenticate: async function (){

                        const user = await ApiUsers.login(this.usuario, this.password);
                        if(user){
                            this.setUsuarioLogueado(user);
                            this.nombre = user.username;
                            console.log(user);
                            this.dialog = false;
                        }
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