<template>
    <div class="content ">
  
      <div class="container-fluid ">
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <card>
              <h4 slot="header" class="card-title">L'historique des connexion</h4>
            <v-client-table 
            :data="connexions"
            :columns="columns" 
            :options="options">          
        </v-client-table>
          </card>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  <script>
    import Card from 'src/components/UIComponents/Cards/Card.vue'
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.min.css';
    import monstore from 'src/store/Monstore';
    import VueDialog from 'vuedialog';
    import { Bus, Component as  Vuedals } from 'vuedals';
  
  VueDialog.setBus(Bus);
    export default {
      components: {
        Card,
        Loading,
        VueDialog,
        Vuedals
      },
      data () {
        return {
          url:'connexion',
          state:monstore.state,
          id:'',
          droits:[],
          page:'connexions',
          url2:'getdroit',
          droit:{
          s:false,
          c:false,
          m:false,
          d:false,
          },
          connexions: [],
          columns: ['NomPers','PrenomPers','name','DebutCon','FinCon'],
              options: {
                  headings: {
                      NomPers: 'Nom',
                      PrenomPers:'Prenom',
                      name:'Nom d\'utilisateur'
                  },
                  sortable: [ 'NomPers','PrenomPers','name','DebutCon','FinCon'],
                  filterable: ['NomPers','PrenomPers','name','DebutCon','FinCon']
        }
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url).then(response=>{
          this.connexions=response.data.connexions;
        })

        this.$http.get(this.state.url+this.url2+'/'+this.$session.get('id')+'/'+this.page).then(response=>{
        this.droits=response.data.aut
        for (var i=0; i<this.droits.length;i++){
        if(this.droits[i].autorisation=='c')
        {
          this.droit.c=true

        }
        else if(this.droits[i].autorisation=='m')
        {
          this.droit.m=true
        }
        else if(this.droits[i].autorisation=='d')
        {
          this.droit.d=true
          
        }
        
          else if(this.droits[i].autorisation=='s'){
            this.droit.s=true
        }
      }
        if(this.droit.s==false)
        {
          this.$router.push('/logs_apps')
        } 
      })
      },
      methods: {
      }
    }
  
  </script>
  
  