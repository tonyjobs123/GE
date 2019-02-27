<template>
    <div class="content ">
  
      <div class="container-fluid ">
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <card>
              <h4 slot="header" class="card-title">L'historique des actions</h4>
            <v-client-table 
            :data="historiques"
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
          url:'historique',
          state:monstore.state,
          id:'',
          historiques: [],
          columns: ['NomPers','PrenomPers','name','DateHisto','ObjetHisto','ActionHisto'],
              options: {
                  headings: {
                      NomPers: 'Nom',
                      PrenomPers:'Prenom',
                      name:'Nom d\'utilisateur',
                      'DateHisto':'Date',
                      'ObjetHisto':'Objet',
                      'ActionHisto':'Action'
                  },
                  sortable: [ 'NomPers','PrenomPers','name','DateHisto','ObjetHisto','ActionHisto'],
                  filterable: [ 'NomPers','PrenomPers','name','DateHisto','ObjetHisto','ActionHisto']
        }
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url).then(response=>{
          this.historiques=response.data.historiques;
        })
      },
      methods: {
      }
    }
  
  </script>
  
  