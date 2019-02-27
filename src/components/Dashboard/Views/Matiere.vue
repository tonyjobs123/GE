<template>
    <div class="content ">
  
      <div class="container-fluid ">
          <div class="row">
              <div class="col-lg-12 col-md-12">
                  <card>
                     <center><h4>Ici vous pouvez gérer les matière</h4></center>
                  </card>
              </div>
          </div>
        <div class="row " >
          <div class="col-lg-7 col-md-7 ">
            <card>
              <h4 v-if="edit" slot="header" class="card-title">Modifier une matière</h4>
              <h4 v-else slot="header" class="card-title">Enregistrer une matière</h4>
              <label>Code*</label>
              <input type="text" name="code" placeholder="Code matière" v-validate="'required'" v-model="matiere.code" class="form-control" >
              <span style="color:red" v-show="errors.has('code')">{{ errors.first('code') }}</span>
              <br>
              <label>Libelle*</label>
              <input type="text" name="libelle" placeholder="libelle matière" v-validate="'required'" v-model="matiere.libelle" class="form-control" >
              <span style="color:red" v-show="errors.has('libelle')">{{ errors.first('libelle') }}</span>
              <br>
              <label>Coefficient*</label>
              <input type="number" name="coefficient" placeholder="coefficient Matière" v-validate="'numeric|required'" v-model="matiere.coeff" class="form-control" >
              <span style="color:red" v-show="errors.has('coefficient')">{{ errors.first('coefficient') }}</span>
              <br>
              <label>Type*</label>
              <select v-model="matiere.type_id" name="type" v-validate="'required'" class="form-control">
                <option>...Choisir le type...</option>
                <option v-for="t in types" :value="t.id">{{t.LibelleType}}</option>
              </select>
              <span style="color:red" v-show="errors.has('type')">{{ errors.first('type') }}</span>
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
                  <h4 slot="header" class="card-title">La liste des matières</h4>
                <v-client-table 
                :data="matieres"
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
          url:'matieres',
          url3:'types',
           matiere: {
            libelle: '',
            code: '',
            coeff: '',
            type_id:'',
            iduser:this.$session.get('id')
          },
          matieres: [],
          types:[],
          edit: false,
          page:'matieres',
          url2:'getdroit',
          droits:[],
          droit:{
            s:true,
            c:true,
            m:true,
            d:true,
          },
          columns:['#','CodeMatiere', 'LibelleMatiere','CoeffMatiere', 'type.LibelleType','Modif','Supp'],  
              options: {
                  headings: {
                    'CodeMatiere': 'Code',
                      'LibelleMatiere':'Libelle',
                      'CoeffMatiere':'Coefficient',
                      'type.LibelleType':'Type'
                  },
                  sortable: ['CodeMatiere', 'LibelleMatiere','CoeffMatiere', 'type.libelleType','#'],
                  filterable: ['CodeMatiere', 'LibelleMatiere','CoeffMatiere', 'type.libelleType','#']
        }
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url).then(response=>{
          this.matieres=response.data.matieres;
        })
        this.$http.get(this.state.url+this.url3).then(response=>{
          this.types=response.data.types;
        })
        this.$http.get(this.state.url+this.url2+'/'+this.matiere.iduser+'/'+this.page).then(response=>{
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
             this.$http.post(this.state.url+this.url,this.matiere).then(response=>{
             this.matieres.push(response.data.matiere)
             this.notifyVue('top', 'right','success','Enrégistrer avec succès')
             this.isload=false
              this.cancel();
            
          }, response => {
            this.isload=false
            this.notifyVue('top', 'right','danger','erreur')
          }) 
          })
  }
  })
           
               
        },
        cancel()
        {
          this.edit=false
          this.matiere.libelle='';
          this.matiere.code='';
          this.matiere.type_id='';
          this.matiere.coeff='';
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
      editer(matiere,l)
        {
          this.l=l
          this.edit=true
          this.id=matiere.id
          this.matiere.libelle=matiere.LibelleMatiere       
          this.matiere.coeff=matiere.CoeffMatiere    
          this.matiere.code=matiere.CodeMatiere  
          this.matiere.type_id=matiere.type_id     
          
        },
        update()
        {
          let l=this.l
         
          this.$validator.validate().then(result=>{
                if(result){
                  VueDialog.confirm('Voulez vous enrégistrer les modifications?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                    this.isload=true
                    this.$http.put(this.state.url+this.url+'/'+this.id,this.matiere).then(response=>{
                    this.isload=false
                    this.matieres[l-1].LibelleMatiere=this.matiere.libelle
                    this.matieres[l-1].CodeMatiere=this.matiere.code
                    this.matieres[l-1].CoeffMatiere=this.matiere.coeff
                    this.matieres[l-1].type_id=this.matiere.type_id
                    this.notifyVue('top', 'right','success','modifier avec succès')
                    this.cancel();
                }, response => {
                  this.isload=false
                  this.notifyVue('top', 'right','danger','erreur')
                })  
          }) 
  
                }
            
              })      
        },
       supp(matiere,l)
        {
          this.id=matiere.id
          VueDialog.confirm('Voulez vous supprimer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                    this.isload=true
                    this.$http.delete(this.state.url+this.url+'/'+this.id).then(response=>{
                    this.$http.get(this.state.url+this.url+'/'+this.$session.get('id'))
                    this.isload=false
                    this.notifyVue('top', 'right','success','supprimer avec succès')
                    this.matieres.splice(l-1,1);
                }, response => {
                  this.isload=false
                  this.notifyVue('top', 'right','danger','erreur')
                })  
          }
                  )
              
  
        },
      }
    }
  
  </script>
  
  