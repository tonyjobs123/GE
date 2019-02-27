<template>
    <div class="content ">
    <div class="container-fluid ">
      <div class="row" >
        <div class="  col-lg-12 col-md-12">
          <card>
              <h4 slot="header" class="card-title">La liste des heures effectuées par employer dans ce mois</h4>
            <v-client-table 
            :data="presences"
            :columns="columns" 
            :options="options">
            <a slot="#" slot-scope="props">{{props.index}}</a>
                    </v-client-table>
          </card>
        </div>
      </div>
    </div>
    </div>
  </template>
  <script>
    /* eslint-disable */
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
          //index
          l:'',
         state:monstore.state,
          isload:false,
          url:'presences',
          presences: [],
          page:'presences',
          url2:'getdroit',
          droit:{
            s:false,
            c:false,
            m:false,
            d:false,
          },
          columns: ['#', 'NomPers','PrenomPers','nb'],
              options: {
                  headings: {
                     
                      NomPers: 'Nom',
                      PrenomPers: 'Prenom',
                      nb: 'Nombre d\'heure',
                  },
                  sortable: ['NomPers','PrenomPers','nb','#'],
                  filterable: ['NomPers','PrenomPers','nb','#']
        }
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url).then(response=>{
          this.presences=response.data.presences;
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
  
        notifyVue (verticalAlign, horizontalAlign,color,message) {
          const notification = {
            template: '<span>'+message+'</span>'
          }
  
          this.$notifications.notify(
            {
              component: notification,
              icon: 'nc-icon nc-check-2',
              horizontalAlign: horizontalAlign,
              verticalAlign: verticalAlign,
              type: color
            })
        }
      }
    }
  </script>
  
  