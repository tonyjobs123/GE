<template>
    <div class="content ">
  
      <div class="container-fluid ">
          <div class="row">
              <div class="col-lg-12 col-md-12">
                  <card>
                     <center><h4>Ici vous pouvez gérer les années académique</h4></center>
                  </card>
              </div>
          </div>
        <div class="row " >
          <div class="col-lg-7 col-md-7 ">
            <card>
              <h4 v-if="edit" slot="header" class="card-title">Modifier une année</h4>
              <h4 v-else slot="header" class="card-title">Enregistrer une année</h4>
              <label>Libelle*</label>
              <input type="text" name="LibelleAnnee" placeholder="Libelle annee" v-validate="'required'" v-model="annee.LibelleAnnee" class="form-control" >
              <span style="color:red" v-show="errors.has('LibelleAnnee')">{{ errors.first('LibelleAnnee') }}</span>
              <br>
              <label>Etat *</label>
              <select class="form-control" v-model="annee.cloture" v-validate="'required'" name="cloture">
                <option value="">Choisir le Etat...</option>
                <option  v-for="cloture in clotures" v-bind:value="cloture">{{cloture}}</option>
            </select>
            <span style="color:red" v-show="errors.has('cloture')">{{ errors.first('cloture') }}</span>
             <br>
              <input type="button"  value="Annuler" @click="cancel"  class="btn btn-info btn-fill float-right" style="margin-left:4px"/>
              <input type="button" v-if="edit"  value="Modifier"  @click="update" class="btn btn-success btn-fill float-right"/>
              <input type="button" v-else value="Enregistrer" @click="enreg" class="btn btn-success btn-fill float-right"/>
              <vuedals></vuedals>
              <Loading :active.sync="isload" 
              :can-cancel="true" 
              :is-full-page="true"></Loading>
                  
              
            </card>
          </div>
        </div>
       
        <div class="row">
            <div class="  col-lg-12 col-md-12">
              <card>
                  <h4 slot="header" class="card-title">La liste des années académique</h4>
                <v-client-table 
                :data="menus"
                :columns="columns" 
                :options="options"> 
                <a slot="#" slot-scope="props">{{props.index}}</a>              
                <a slot="Modif" v-if="droit.m"  slot-scope="props"><button class="btn btn-warning btn-fill" @click="editer(props.row,props.index)">modifier</button></a>
                <a slot="Supp" v-if="droit.d" slot-scope="props"><button class="btn btn-danger btn-fill" @click="supp(props.row,props.index)">supprimer</button></a>
            </v-client-table>
              </card>
            </div>
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
          l:'',
          state:monstore.state,
          url:'annees',
           annee: {
            LibelleAnnee: '',
            cloture:'',
            iduser:this.$session.get('id')
          },
          annees: [],
          trimestres:[],
          clotures:["En cours","Pas encore","Cloturé"],
          edit: false,
          page:'annees',
          url2:'getdroit',
          droits:[],
          droit:{
            s:true,
            c:true,
            m:true,
            d:true,
          },
          columns:['#','LibelleAnnee', 'cloture','Modif','Supp'],  
              options: {
                  headings: {
                    'LibelleAnnee': 'Année académique',
                      'cloture':'Etat'
                  },
                  sortable: ['LibelleAnnee','cloture','#'],
                  filterable: ['LibelleAnnee','cloture','#']
        }
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url).then(response=>{
          this.menus=response.data.menus;
        })
        this.$http.get(this.state.url+this.url2+'/'+this.menu.iduser+'/'+this.page).then(response=>{
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
       
      
      },
      methods: {
        enreg()
        {
        
          this.$validator.validate().then(result=>{
  
                if(result){
              VueDialog.confirm('Voulez vous enrégistrer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
          .then(_=>{
              this.isload=true
             this.$http.post(this.state.url+this.url,this.annee).then(response=>{
             this.annees.push(response.data.annee)
             this.notifyVue('top', 'right','success','Enrégistrer avec succès')
             this.isload=false
              this.cancel();
            
          })  
          })
  }
  })
           
               
        },
        cancel()
        {
          this.edit=false
          this.annee.LibelleAnnee='';
          this.annee.cloture=''
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
      editer(annee,l)
        {
          this.l=l
          this.edit=true
          this.id=annee.id
          this.annee.LibelleAnnee=annee.LibelleAnnee        
          this.annee.cloture=annee.cloture   
          
        },
        update()
        {
          let l=this.l
         
          this.$validator.validate().then(result=>{
                if(result){
                  VueDialog.confirm('Voulez vous enrégistrer les modifications?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                    this.isload=true
                    this.$http.put(this.state.url+this.url+'/'+this.id,this.annee).then(response=>{
                    this.isload=false
                    this.annees[l-1].LibelleAnnee=this.annee.LibelleAnnee
                    this.annees[l-1].cloture=this.annee.cloture
                    this.notifyVue('top', 'right','success','modifier avec succès')
                    this.cancel();
                }) 
          }) 
  
                }
            
              })      
        },
       supp(annee,l)
        {
          this.id=annee.id
          VueDialog.confirm('Voulez vous supprimer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                   
                    this.isload=true
                    this.$http.delete(this.state.url+this.url+'/'+this.id).then(response=>{
                    this.$http.get(this.state.url+this.url+'/'+this.$session.get('id'))
                    this.isload=false
                    this.notifyVue('top', 'right','success','supprimer avec succès')
                    this.annees.splice(l-1,1);
                }) 
          }
                  )
              
  
        },
      }
    }
  
  </script>
  
  