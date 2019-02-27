<template>
  <div class="content ">

    <div class="container-fluid ">
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <card>
                   <center><h4>Ici vous pouvez gérer Les personnels</h4></center>
                </card>
            </div>
        </div>
      <div class="row " v-if="droit.c">
        <div class="col-lg-12 col-md-12">
          <card>
              <h4 v-if="edit" slot="header" class="card-title">Modifier un personnel</h4>
              <h4 v-else slot="header" class="card-title">Enregistrer un personnel</h4>
              <div class="container-fluid ">
                  <div class="row ">
                    <div class="col-lg-6 col-md-6">
            <label>Nom *</label>
            <input type="text" name="nom" v-validate="'required|alpha_spaces'" placeholder="Nom du personnel" v-model="personnel.nom" class="form-control" >
            <span style="color:red" v-show="errors.has('nom')">{{ errors.first('nom') }}</span>            
            <br>
            <label>Prenom *</label>
            <input type="text" name="prenom" v-validate="'required|alpha_spaces'" placeholder="Prenom du personnel"  v-model="personnel.prenom"  class="form-control" >
            <span style="color:red" v-show="errors.has('prenom')">{{ errors.first('prenom') }}</span>
            <br>
            <label>Poste *</label>
            <select class="form-control" v-model="personnel.poste">
              <option value="">Choisir le poste...</option>
              <option  v-for="poste in postes" v-bind:value="poste.id">{{poste.LibellePostes}}</option>
          </select>
            <span style="color: red" id="pan1"></span>
            <br>
            </div>
            <div class="col-lg-6 col-md-6">
            <label>Email *</label>
            <input type="text" name="email" v-validate="'required|email'" placeholder="Email du personnel" v-model="personnel.email" class="form-control" >
            <span style="color:red" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            
            <br>
            <label>Adresse *</label>
             <textarea placeholder="Adresse du personnel" v-model="personnel.adresse" class="form-control" name="adresse" v-validate="'required'"></textarea>
            <span style="color:red" v-show="errors.has('adresse')">{{ errors.first('adresse') }}</span>
            
            <br>
            <label>Telephone *</label>
            <input type="tel" name="telephone" placeholder="Télephone du personnel" v-validate="'required|numeric'"  v-model="personnel.tel" class="form-control" >
            <span style="color:red" v-show="errors.has('telephone')">{{ errors.first('telephone') }}</span>
            <br>
            <label>Sexe *</label>
            <br>
            <label>Masculin</label> <input type="radio" value="M" name="sexe" v-model="personnel.sexe">
            <label>Feminin</label><input type="radio" value="F" name="sexe" v-model="personnel.sexe">
            <span style="color: red" id="pan1"></span>
            <br>
            <input type="button"  value="Annuler" @click="cancel"  class="btn btn-info float-right btn-fill" style="margin-left:4px"/>
            <input type="button" v-if="edit"  value="Modifier" @click="update" class="btn btn-success float-right btn-fill"/>
            <input type="button" v-else value="Enregistrer" @click="enreg" class="btn btn-success float-right btn-fill"/>
          </div></div></div>
            <vuedals></vuedals>
            <Loading :active.sync="isload" 
            :can-cancel="true" 
            :is-full-page="true"></Loading>
          </card>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-12">
          <card>
            <h4 slot="header" class="card-title">La liste des personnels</h4>
          <v-client-table 
          :data="personnels"
          :columns="columns" 
          :options="options">
          <a slot="SexePers" slot-scope="props">
            <span v-if="props.row.SexePers=='M'">Masculin</span>
            <span v-else>Feminin</span>
          </a>
          <a slot="Modif" slot-scope="props"  v-if="droit.m"><button class="btn btn-warning btn-fill glyphicon glyphicon-remove " @click="editer(props.row,props.index)">modifier</button></a>
          <a slot="Supp" slot-scope="props" v-if="droit.d" ><button class="btn btn-danger btn-fill" @click="supp(props.row,props.index)">supprimer</button></a>
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
        isload:false,
        state:monstore.state,
        url:'personnels',
        sele:'postes',
        personnel: {
          nom:'',
          prenom:'',
          sexe:'',
          email:'',
          tel:'',
          adresse:'',
          poste:'',
          iduser:this.$session.get('id')
        },
        id:'',
        personnels: [],
        postes:[],
        edit: false,
        page:'personnels',
        url2:'getdroit',
        droit:{
          s:false,
          c:false,
          m:false,
          d:false,
        },
        columns: ['id', 'NomPers','PrenomPers','SexePers','EmailPers','AdressePers','TelephonePers','poste.LibellePostes','Modif','Supp'],
            options: {
                headings: {
                    id: 'id',
                    'poste.LibellePostes':'poste',
                    'NomPers': 'Nom',
                    'PrenomPers':'Prenoms',
                    'SexePers':'Sexe',
                    'EmailPers':'Email',
                    'AdressePers':'Adresse',
                    'TelephonePers':'Telephone'

                },
                sortable: ['id', 'NomPers','PrenomPers','SexePers','EmailPers','AdressePers','TelephonePers','poste.LibellePostes'],
                filterable: ['id', 'NomPers','PrenomPers','SexePers','EmailPers','AdressePers','TelephonePers','poste.LibellePostes']
      }
      }
    },
    mounted(){
      this.$http.get(this.state.url+this.url).then(response=>{
        this.personnels=response.data.perso;
      })
      this.$http.get(this.state.url+this.sele).then(response=>{
        this.postes=response.data.postes;
      })

      this.$http.get(this.state.url+this.url2+'/'+this.personnel.iduser+'/'+this.page).then(response=>{
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
                      this.isload=true,
                     this.$http.post(this.state.url+this.url,this.personnel).then(response=>{
                     this.notifyVue('top', 'right','success','Enrégistrer avec succès')
                     this.personnels.push(response.data.perso)
                     this.cancel()
                     this.isload=false
                     })  
          }
                )
              }
          
            })
       
              
       
      },
      editer(perso,l)
      {
        this.l=l
        //props.index
        this.edit=true
        this.id=perso.id
        this.personnel.nom=perso.NomPers
        this.personnel.prenom=perso.PrenomPers
        this.personnel.sexe=perso.SexePers
        this.personnel.email=perso.EmailPers
        this.personnel.adresse=perso.AdressePers
        this.personnel.tel=perso.TelephonePers
        this.personnel.poste=perso.poste_id
        
      },
      update()
      {
        let l=this.l
        this.$validator.validate().then(result=>{

              if(result){
                VueDialog.confirm('Voulez vous enrégistrer les modifications?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                .then(_=>{
                  this.isload=true
                  this.$http.put(this.state.url+this.url+'/'+this.id,this.personnel).then(response=>{
                  this.isload=false
                  this.personnels[l-1].NomPers=response.data.perso.NomPers,
                  this.personnels[l-1].PrenomPers=response.data.perso.PrenomPers
                  this.personnels[l-1].SexePers=response.data.perso.SexePers
                  this.personnels[l-1].EmailPers=response.data.perso.EmailPers
                  this.personnels[l-1].AdressePers=response.data.perso.AdressePers
                  this.personnels[l-1].TelephonePers=response.data.perso.TelephonePers
                  this.personnels[l-1].poste.LibellePostes=response.data.perso.poste.LibellePostes
                  this.notifyVue('top', 'right','success','modifier avec succès')
                  this.cancel();
                   })        
                }
                )
              }
          
            })

              
      },
     supp(perso,l)
      {
        this.id=perso.id
        
        VueDialog.confirm('Voulez vous supprimer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                .then(_=>{
                 
                  this.isload=true
                  this.$http.delete(this.state.url+this.url+'/'+this.id).then(response=>{
                  this.$http.get(this.state.url+this.url+'/'+this.$session.get('id'))
                  this.isload=false
                  this.notifyVue('top', 'right','danger','supprimer avec succès')
                  this.personnels.splice(l-1,1);
              })
             }
            )

      },
      cancel()
      {
        this.edit=false
        this.personnel.nom='',
            this.personnel.prenom=''
            this.personnel.sexe=''
            this.personnel.email=''
            this.personnel.adresse=''
            this.personnel.tel=''
            this.personnel.poste=''

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
      }
    }
  }

</script>

