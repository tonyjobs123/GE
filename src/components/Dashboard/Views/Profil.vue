<template>
  <div class="content ">

    <div class="container-fluid ">
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <card>
                   <center><h4>Ici vous pouvez gérer Les profils</h4></center>
                </card>
            </div>
        </div>
      <div class="row " v-if="droit.c">
        <div class="col-lg-7 col-md-7 ">
          <card>
            <h4 v-if="edit" slot="header" class="card-title">Modifier un profil</h4>
            <h4 v-else slot="header" class="card-title">Enregistrer un profil</h4>
            <label>Libelle du Profil*</label>
            <input type="text" name="libelle" placeholder="Libelle du profil" v-validate="'required'" v-model="profil.libelle" class="form-control">
            <span style="color:red" v-show="errors.has('libelle')">{{ errors.first('libelle') }}</span>
            <br>
            <label>Description Profil</label>
            <textarea v-model="profil.description" class="form-control" rows="4"></textarea>
            <br>
            <label>Etat *</label>
            <br>
            <label>Activer</label> <input type="radio" value="1" name="etat" v-model="profil.etat">
            <label>Desactiver</label><input type="radio" value="0" name="etat" v-model="profil.etat">
            <span style="color: red" id="pan1"></span>
            <br>
            <input type="button" value="Annuler" @click="cancel"  class="btn btn-info btn-fill float-right" style="margin-left:4px"/>
            <input type="button" v-if="edit"   value="Modifier"  @click="update" class="btn btn-success btn-fill float-right"/>
            <input type="button" v-else value="Enregistrer"  @click="enreg" class="btn btn-success btn-fill float-right"/>

            <vuedals></vuedals>
            <Loading :active.sync="isload" 
            :can-cancel="true" 
            :is-full-page="true"></Loading>
          </card>
        </div>
      </div>
      <div class="row">
        <div>

        </div>
      </div>
    </div>
    <div class="row">
        <div class="  col-lg-12 col-md-12">
          <card>
              <h4 slot="header" class="card-title">La liste des profils</h4>
            <v-client-table 
            :data="profils"
            :columns="columns" 
            :options="options">
            <a slot="EtatProfil" slot-scope="props">
              <span v-if="props.row.EtatProfil=='1'" style="border:1px solid;padding:2px;border-color:rgb(108, 245, 108) ; border-radius:2px;background-color: rgb(108, 245, 108)">Activé</span>
              <span v-else style="border:1px solid;padding:2px;border-color:rgb(245, 158, 108) ; border-radius:2px;background-color: rgb(245, 158, 108)" >Désactivé</span>
            </a>
            <a slot="#" slot-scope="props" >{{props.index}}</a>
            
            <a slot="Modifier" slot-scope="props" v-if="droit.m"><span class="btn btn-warning btn-fill glyphicon glyphicon-remove " @click="editer(props.row,props.index)">Modifier</span></a>
        </v-client-table>
          </card>
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
        profil: {
          libelle: '',
          description:'',
          etat:'0',
          iduser:this.$session.get('id')
        },
        isload:false,
        state:monstore.state,
        l:'',
        id:'',
        url:'profils',
        profils: [],
        edit: false,
        page:'profils',
        url2:'getdroit',
        droit:{
          s:false,
          c:false,
          m:false,
          d:false,
        },
        columns: ['#', 'LibelleProfil', 'DescProfil','EtatProfil','Modifier'],
            options: {
                headings: {
                  'LibelleProfil':'Libelle',
                  'DescProfil':'Description',
                  'EtatProfil':'Etat'
                },
                sortable: ['LibelleProfil', 'DescProfil','EtatProfil','#'],
                filterable: ['LibelleProfil', 'DescProfil','EtatProfil','#']
      }
    }
    },
    mounted(){
      this.$http.get(this.state.url+this.url).then(response=>{
        this.profils=response.data.profils;
      })
      this.$http.get(this.state.url+this.url2+'/'+this.profil.iduser+'/'+this.page).then(response=>{
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
      if(this.droit==false)
      {
        this.$router.push("/login_apps")
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
           this.$http.post(this.state.url+this.url,this.profil).then(response=>{
          this.notifyVue('top', 'right','success','Enrégistrer avec succès')
          this.profils.push(response.data.profil)
          this.cancel()
          this.isload=false
        })  
        })
      }
  })
         
      },
      editer(profil,l){
        this.edit=true,
        this.l=l
        this.id=profil.id,
        this.profil.libelle=profil.LibelleProfil
        this.profil.description=profil.DescProfil
        this.profil.etat=profil.EtatProfil
      },
      update()
      {
        this.$validator.validate().then(result=>{
          
                        if(result){
           let l=this.l-1
          VueDialog.confirm('Voulez vous enrégistrer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                .then(_=>{
                  this.isload=true
           this.$http.put(this.state.url+this.url+'/'+this.id,this.profil).then(response=>{
          this.notifyVue('top', 'right','success','Modifier avec succès')
          this.profils[l].LibelleProfil= this.profil.libelle
          this.profils[l].DescProfil=this.profil.description
          this.profils[l].EtatProfil=this.profil.etat
          this.cancel()
          this.isload=false
        })  
        })}
  })
      },
      cancel()
      {
        this.edit=false
        this.profil.libelle='';
        this.profil.description=''
        this.profil.etat=''

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

