<template>
    <div class="content ">
  
      <div class="container-fluid ">
        <div class="row ">
          <div class="col-lg-12 col-md-12" style="padding: 5%">
            <card>
                <h4 v-if="edit" slot="header" class="card-title">Modifier un utilisateur</h4>
                <h4 v-else slot="header" class="card-title">Enregistrer un utilisateur</h4>
                <div class="container-fluid ">
                    <div class="row ">
                      <div class="col-lg-6 col-md-6">
              <label>Personnel *</label>
              <select class="form-control" v-model="user.personnel">
                <option value="">Choisir le personnel...</option>
                <option  v-for="p in perso" v-bind:value="p.id">{{p.NomPers}}   {{p.PrenomPers}}</option>
            </select>
            <br>
            
              <label>Nom d'utilisateur*</label>
              <input type="text" name="nom" v-validate="'required'" placeholder="Nom d'utilisateur" v-model="user.nom" class="form-control" autocomplete="off" >
              <span style="color:red" v-show="errors.has('nom')">{{ errors.first('nom') }}</span>
              <br>
            <div v-if="pass">
              <label>Mot de passe *</label>
              <input type="password" name="mot de passe" ref="mot de passe" placeholder="mot de passe" v-model="user.password"  class="form-control" autocomplete="off">
              <span style="color:red" v-show="errors.has('mot de passe')">{{ errors.first('mot de passe') }}</span>
            </div>
            <div v-if="edit==false">
                <label>Mot de passe *</label>
                <input type="password" name="mot de passe" ref="mot de passe" placeholder="mot de passe" v-model="user.password"  class="form-control" >
                <span style="color:red" v-show="errors.has('mot de passe')">{{ errors.first('mot de passe') }}</span>
              </div>
            
                      </div>
                    <div class="col-lg-6 col-md-6">
            <div v-if="pass"> 
            <label>confirmation *</label>
              <br>
              <input type="password" name="conf"  placeholder="confirmation" v-validate="'required|confirmed:mot de passe'"  class="form-control" >
              
              <span style="color:red" v-show="errors.has('conf')">{{ errors.first('conf') }}</span>
            </div>
            <div  v-if="edit==false"> 
                <label>confirmation *</label>
                  <br>
                  <input type="password" name="conf"  placeholder="confirmation" v-validate="'required|confirmed:mot de passe'"  class="form-control" >
                  
                  <span style="color:red" v-show="errors.has('conf')">{{ errors.first('conf') }}</span>
            <br></div>
              
              <label>Profil *</label>
              <select class="form-control" v-model="user.profil">
                <option value="">Choisir le profil...</option>
                <option  v-for="profil in profils" v-bind:value="profil.id">{{profil.LibelleProfil}}</option>
            </select>
              <span style="color: red" id="pan1"></span>
              <br>
              <label>Etat *</label>
              <br>
              <label>Actif</label> <input type="radio" value="1" name="etat" v-model="user.etat" >
              <label>Inactif</label><input type="radio" value="0" name="etat" v-model="user.etat">
              <span style="color: red" id="pan1"></span>
              <br>
              <div v-if="edit">
              <label >Crochez pour réinitialiser le mot de passe</label>
              <input type="checkbox" v-model="pass">
              </div>
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
            <card style="margin: 45px">
              <h4 slot="header" class="card-title">La liste des utilisateur</h4>
            <v-client-table 
            :data="users"
            :columns="columns" 
            :options="options">
            <a slot="Etat" slot-scope="props">
              <span v-if="props.row.etat=='1'" style="border:1px solid;padding:2px;border-color:rgb(108, 245, 108) ; border-radius:2px;background-color: rgb(108, 245, 108)">Activer</span>
              <span v-else style="border:1px solid;padding:2px;border-color:rgb(245, 158, 108) ; border-radius:2px;background-color: rgb(245, 158, 108)" >Désactiver</span>
            </a>
            <a slot="Modifier" slot-scope="props" v-if="droit.m"><button class="btn btn-warning btn-fill glyphicon glyphicon-remove " @click="editer(props.row,props.index)">modifier</button></a>
            <a slot="Supprimer" slot-scope="props" v-if="droit.d"><button class="btn btn-danger btn-fill" @click="supp(props.row,props.index)">supprimer</button></a>
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
         state:monstore.state,
          isload:false,
          l:'',
          url:'users',
          sele:'personnels',
          url1:'profil',
          url2:'getdroit',
          pass:false,
          page:'users',
          user: {
            nom:'',
            password:'',
            personnel:'',
            profil:'',
            etat:'1',
            iduser:this.$session.get('id')
          },
          id:'',
          users: [],
          perso:[],
          profils:[],
          edit: false,
          droits:[],
        droit:{
          s:false,
          c:false,
          m:false,
          d:false,
        },
          columns: [ 'personnel.NomPers','personnel.PrenomPers','name','profil.LibelleProfil','Etat','Modifier','Supprimer'],
              options: {
                  headings: {
                      name: 'nom d\'utilisateur',
                      'profil.LibelleProfil':'Profil',
                      'personnel.PrenomPers':'Nom du personnel',
                      'personnel.NomPers':'Prenom du personnel'
                  },
                  sortable: ['personnel.NomPers','personnel.PrenomPers','profil.LibelleProfil','etat','name'],
                  filterable: ['personnel.NomPers','personnel.PrenomPers','profil.LibelleProfil','etat','name']
        }
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url).then(response=>{
          this.users=response.data.users;
        })
        this.$http.get(this.state.url+this.sele).then(response=>{
          this.perso=response.data.perso;
        })
        this.$http.get(this.state.url+this.url1).then(response=>{
          this.profils=response.data.profils;
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
          this.$router.push('/login_apps')
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
            this.$http.post(this.state.url+this.url,this.user).then(response=>{
            this.notifyVue('top', 'right','success','Enrégistrer avec succès')
            this.users.push(response.data.user)
            this.cancel()
            this.isload=false
            })  
            
            }
            )
              }
          
            })
         
        },
        editer(user,l)
        {
          this.l=l
          this.edit=true
          this.id=user.id
          this.user.nom=user.name 
          this.user.personnel=user.personnel_id
          this.user.profil=user.profil_id   
        },
        update()
        {
          let l=this.l
          this.$validator.validate().then(result=>{

              if(result){
                VueDialog.confirm('Voulez vous enrégistrer les modifications?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                   
                    this.isload=true
                    this.$http.put(this.state.url+this.url+'/'+this.id,this.user).then(response=>{
                    this.users[l-1].personnel.NomPers=response.data.user.personnel.NomPers
                    this.users[l-1].personnel.PrenomPers=response.data.user.personnel.PrenomPers
                    this.users[l-1].name=response.data.user.name
                    this.users[l-1].profil.LibelleProfil=response.data.user.profil.LibelleProfil
                    this.users[l-1].etat=response.data.user.etat
                    this.isload=false
                    this.notifyVue('top', 'right','success','modifier avec succès')
                    this.cancel();
                })
              
          }
             ) 
              }
          
            })
                 
        },
       supp(user,l)
        {
          this.id=user.id
          VueDialog.confirm('Voulez vous supprimer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                   
                    this.isload=true
                    this.$http.delete(this.state.url+this.url+'/'+this.id).then(response=>{
                    this.isload=false
                    this.notifyVue('top', 'right','success','supprimer avec succès')
                    this.users.splice(l-1,1);
                    this.isload=false
                })
          }
         )
                
  
        },
        cancel()
        {
          this.edit=false
          this.user.nom='',
          this.user.password=''
              
  
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
  
  