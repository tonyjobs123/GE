<template>
  <div class="content ">

    <div class="container-fluid ">
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <card>
                   <center><h4>Ici vous pouvez gérer les menus</h4></center>
                </card>
            </div>
        </div>
      <div class="row " >
        <div class="col-lg-7 col-md-7 ">
          <card>
            <h4 v-if="edit" slot="header" class="card-title">Modifier un Menu</h4>
            <h4 v-else slot="header" class="card-title">Enregistrer un Menu</h4>
            <label>Nom du menu*</label>
            <input type="text" name="nom" placeholder="Nom du Menu" v-validate="'required'" v-model="menu.nom" class="form-control" >
            <span style="color:red" v-show="errors.has('nom')">{{ errors.first('nom') }}</span>
            <br>
            <label>Lien du menu*</label>
            <input type="text"  placeholder="Lien du Menu" v-validate="'required'"v-model="menu.url" class="form-control" name="lien" >
            <span style="color:red" v-show="errors.has('lien')">{{ errors.first('lien') }}</span>
            <br>
            <label>Icon du menu</label>
            <div class="form-group">
              <input type="text"  placeholder="Icon du Menu"  v-model="menu.icon" class="form-control" >              
            </div>
            <br>
           
            <label>Type *</label>
            <select class="form-control" v-model="menu.type" v-validate="'required'" name="type">
              <option value="">Choisir le type...</option>
              <option  v-for="type in types" v-bind:value="type.id">{{type.LibelleTypemenu}}</option>
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
                <h4 slot="header" class="card-title">La liste des menus</h4>
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
        url:'menus',
        url1:'typemenus',
         menu: {
          nom: '',
          url:'',
          icon:'',
          type:'',
          iduser:this.$session.get('id')
        },
        menus: [],
        types:[],
        edit: false,
        page:'menus',
        url2:'getdroit',
        droits:[],
        droit:{
          s:false,
          c:false,
          m:false,
          d:false,
        },
        columns:['#','IconMenu', 'NomMenu','UrlMenu','typemenu.LibelleTypemenu','Modif','Supp'],  
            options: {
                headings: {
                    name: 'Libelle',
                    'IconMenu':'Icon',
                    'typemenu.LibelleTypemenu':'Type'
                },
                sortable: ['IconMenu','NomMenu', 'typemenu.LibelleTypemenu','UrlMenu', '#'],
                filterable: ['IconMenu','NomMenu', 'typemenu.LibelleTypemenu','UrlMenu', '#']
      }
      }
    },
    mounted(){
      this.$http.get(this.state.url+this.url).then(response=>{
        this.menus=response.data.menus;
      })
      this.$http.get(this.state.url+this.url1).then(response=>{
        this.types=response.data.types;
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
            this.menu.icon=this.image
           this.$http.post(this.state.url+this.url,this.menu).then(response=>{
           this.menus.push(response.data.menu)
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
        this.menu.icon=''
        this.edit=false
        this.menu.nom='';
        this.menu.url=''
        this.menu.type=''
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
    editer(menu,l)
      {
        this.l=l
        this.edit=true
        this.id=menu.id
        this.menu.nom=menu.NomMenu        
        this.menu.url=menu.UrlMenu
        this.menu.icon=menu.IconMenu
        this.menu.type=menu.typemenu_id
       
        
      },
      update()
      {
        let l=this.l
       
        this.$validator.validate().then(result=>{

              if(result){
                VueDialog.confirm('Voulez vous enrégistrer les modifications?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                .then(_=>{
                 
                  this.isload=true
                  this.menu.icon=this.image
                  this.$http.put(this.state.url+this.url+'/'+this.id,this.menu).then(response=>{
                  this.isload=false
                  this.menus[l-1].NomMenu=this.menu.nom
                  this.menus[l-1].UrlMenu=this.menu.url
                  this.menus[l-1].IconMenu=response.data.menu.IconMenu
                  this.menus[l-1].typemenu.LibelleTypemenu=response.data.menu.typemenu.LibelleTypemenu
                  this.notifyVue('top', 'right','success','modifier avec succès')
                  this.cancel();
              }) 
        }) 

              }
          
            })      
      },
     supp(menu,l)
      {
        this.id=menu.id
        VueDialog.confirm('Voulez vous supprimer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                .then(_=>{
                 
                  this.isload=true
                  this.$http.delete(this.state.url+this.url+'/'+this.id).then(response=>{
                  this.$http.get(this.state.url+this.url+'/'+this.$session.get('id'))
                  this.isload=false
                  this.notifyVue('top', 'right','success','supprimer avec succès')
                  this.menus.splice(l-1,1);
              }) 
        }
                )
            

      },
    }
  }

</script>

