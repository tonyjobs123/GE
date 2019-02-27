<template>
    <div class="content ">
  
      <div class="container-fluid ">
          <div class="row" v-if="l==0">
              <div class="col-lg-12 col-md-12 col-sm-12">
                  <card >
                     <center><h4>Enregistrement de l'heure d'arrivée</h4></center>
                     <br> <br> <br>
                      <button class="btn btn-success btn-fill" @click="arrivefun" style="width: 100%; font-size: 50px">{{this.$session.get('nomper')}}{{' '}}{{this.$session.get('prenomper')}}</button>
                     
                  </card>
              </div>
          </div>
          <div class="row" v-if="l==1">
            <div class="col-lg-12 col-md-12 col-sm-12">
                <card>
                   <center><h4>Enregistrement de l'heure de départ</h4></center>
                   <br> <br> <br>
                   <button class="btn btn-info btn-fill" @click="departfun" style="width: 100%; font-size: 50px">{{this.$session.get('nomper')}}{{' '}}{{this.$session.get('prenomper')}}</button>
                   
                </card>
              </div>
            </div>
            <div class="row" v-if="l==2">
                <br> <br> <br><br> <br> <br>
              <div class="col-lg-12 col-md-12 col-sm-12">
                  <card style="background-color: rgb(24, 199, 24);color: white">
                     <center><h1 class="bg bb-success">Vous aviez déjà enrégistrez votre présence</h1></center>
                  </card>
              </div>
        </div>
        <div class="row " >
         
          <vuedals></vuedals>
              <Loading :active.sync="isload" 
              :can-cancel="true" 
              :is-full-page="true"></Loading>
        </div>
      </div>
  
    </div>
  </template>
  <style scoped>
     .img{
      height: 48px;
      width:80px;
  }
  </style>
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
          isload: false,
          l:10,
          state:monstore.state,
          url:'presences',
           arrive: {
            iduser:this.$session.get('id')
          },
          depart: {
            presence:'',
            iduser:this.$session.get('id')
          },
          edit: false,
          page:'presences',
          url2:'getdroit',
          presence:'',
          droits:[],
          droit:{
            s:false,
            c:false,
            m:false,
            d:false,
          },
        
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url2+'/'+this.arrive.iduser+'/'+this.page).then(response=>{
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
        })
        this.$http.get(this.state.url+this.url+'/'+this.arrive.iduser).then(response=>{
    if(response.data.presence==null)
    {
    this.l=0;
    }
    else
    {
      if(response.data.presence.DateDepart==null)
      {
        this.l=1
        this.depart.presence=response.data.presence.id
      }
      else{
        this.l=2
      }

    }
        })
        
      },
      methods: {
        enreg()
        {
           
               
        },
        arrivefun()
        {
          this.isload=true
          this.$http.post(this.state.url+this.url,this.arrive).then(response=>{
            this.l=1
            this.isload=false
            this.notifyVue('top', 'right','success','Heure d\'arrivée enrégistrée avec succès')
          
          })
          
        },
        departfun()
        {
          this.isload=true
           this.$http.put(this.state.url+this.url+'/'+this.depart.presence,this.depart).then(response=>{
             this.l=2
            this.isload=false
            this.notifyVue('top', 'right','info','Heure de départ enrégistrée avec succès')
          })
        },
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
        },
   
   
      }
    }
  
  </script>
  
  