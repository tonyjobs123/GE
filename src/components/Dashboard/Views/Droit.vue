<template>
    <div class="content ">
  
    <div class="container-fluid ">
      <div class="row ">
        <div class="col-lg-12 col-md-12" style="padding: 5%">
          <card>
              <div class="container-fluid ">
                  <div class="row ">
                    <div class="col-lg-5 col-md-5" style="padding: 5%">
            <h4 v-if="edit" slot="header" class="card-title">Modifier un profil</h4>
            <h4 v-else slot="header" class="card-title">choisir un profil</h4>
          <label>Profil*</label>
          <select class="form-control"  v-model="profil" @change="select(profil)" name="profil" v-validate="'required'">
            
            <option  v-for="profil in profils" v-bind:value="profil.id">{{profil.LibelleProfil}}</option>
        </select>
        <span style="color:red" v-show="errors.has('profil')">{{ errors.first('profil') }}</span>
          <br>
          <input type="button" value="Annuler"  @click="cancel" class="btn btn-info btn-fill float-right" style="margin-left:4px"/>
          <input type="button"  value="Modifier"@click="enreg"   class="btn btn-success btn-fill float-right"/>
          <vuedals></vuedals>
          <Loading :active.sync="isload" 
          :can-cancel="true" 
          :is-full-page="true"></Loading> 
          <br><br> <br><br>          
                    </div>
                    <div class="col-lg-7 col-md-7" style="padding: 5%">
                        <h4  slot="header" class="card-title">choisir un menu</h4>
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                              <td style="width: 65%">menu</td>
                              <td>Selection</td>
                              <td>Creation</td>
                              <td>Modification</td>
                              <td>Suppression</td>
                            </tr>
                          </thead>
                          <tbody>
                        <tr v-for="(menu,key,index) in menus" >
                            
                          <td>{{menu.NomMenu}}</td>
                         
                          <td><input value="S"  v-model="droit.s[key]" type="checkbox"></td>
                          <td><input value="C" v-model="droit.c[key]"   type="checkbox"></td>
                          <td><input value="M"   v-model="droit.m[key]" type="checkbox"></td>
                          <td><input value="D"   v-model="droit.d[key]" type="checkbox"></td>
                        </tr>
                      </tbody>
                      </table>

                    </div>
                  </div>
                </div>
          </card>
         
        </div>
      </div>
      <div class="row">
        <div class="  col-lg-12 col-md-12">
         
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
          profil:'',
          page:'droits',
          isload:false,
          url:'profils',
          url1:'menus',
          url2:'nmb',
          url3:'droits', 
        nb:0,  
        droit: {
            profil:'',
            s:[parseInt(this.nb)] ,
            c:[parseInt(this.nb)],
            m:[parseInt(this.nb)],
            d:[parseInt(this.nb)]
          },
          detacher:{
            menu:[]
          },
        i:1,
        url4:'getdroit',
        droits:[],
        droits1:[],
        droi:{
          s:false,
          c:false,
          m:false,
          d:false,
        },
        checks:["S","C","M","D"],
          profils: [],
          menus: [],
          edit: false,
          columns: ['id', 'LibelleProfil','Modif'],
              options: {
                  headings: {
                      id: 'id',
                      name: 'Libelle',
                  },
                  sortable: ['LibelleProfil', 'id'],
                  filterable: ['LibelleProfil', 'id']
        }
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url).then(response=>{
          this.profils=response.data.profils;
        })
        this.$http.get(this.state.url+this.url1).then(response=>{
          this.menus=response.data.menus;
        }),
        this.$http.get(this.state.url+this.url2).then(response=>{
          this.nb=response.data.nbr;
          
        })

        this.$http.get(this.state.url+this.url4+'/'+this.$session.get('id')+'/'+this.page).then(response=>{
        this.droits=response.data.aut
        for (var i=0; i<this.droits.length;i++){
        if(this.droits[i].autorisation=='c')
        {
          this.droi.c=true

        }
        else if(this.droits[i].autorisation=='m')
        {
          this.droi.m=true
        }
        else if(this.droits[i].autorisation=='d')
        {
          this.droi.d=true
          
        }
        
          else if(this.droits[i].autorisation=='s'){
            this.droi.s=true
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
        
                  this.$http.put(this.state.url+this.url3+"/"+this.droit.profil,this.detacher).then(response=>{ 
                    this.$http.post(this.state.url+this.url3,this.droit).then(response=>{
                    this.isload=false
                    this.notifyVue('top', 'right','success','Enregistrer avec succès')
                })
                for (var i=0; i<this.menus.length;i++){
                this.droit.s[i]=false
                this.droit.c[i]=false
                this.droit.m[i]=false
                this.droit.d[i]=false
                this.profil=''
                }                   
                })
               
            
                 
                for (var i=0; i<this.menus.length;i++){
                if(this.droit.s[this.menus.length-1]==false && this.droit.c[this.menus.length-1]==false && this.droit.m[this.menus.length-1]==false && this.droit.d[this.menus.length-1]==false)
                {
             
                }
                break;
                }
              
              
              },
                 )
                }})         
        },
        select(profil)
        {
          this.isload=true
          this.droit.profil=this.profil
          for (var i=0; i<this.menus.length;i++){
                this.droit.s[i]=false
                this.droit.c[i]=false
                this.droit.m[i]=false
                this.droit.d[i]=false

                }
          this.$http.get(this.state.url+this.url3+"/"+profil+"/edit").then(response=>{
          this.droits1=response.data.droits;
          for (var i=0; i<this.menus.length;i++){
            for(var j=0; j<this.droits1.length;j++)
            {

              if(this.menus[i].id==this.droits1[j].menu_id){
                this.detacher.menu.push(this.menus[i].id)
                  if(this.droits1[j].autorisation=='s')
                  {
                    this.droit.s[i]=true
                  }
                  if(this.droits1[j].autorisation=='c')
                  {
                    this.droit.c[i]=true
                  }
                  if(this.droits1[j].autorisation=='m')
                  {
                    this.droit.m[i]=true
                  }
                  if(this.droits1[j].autorisation=='d')
                  {
                    this.droit.d[i]=true
                  }
                }
            }             
                }
                this.isload=false 
        })

        }, 
       supp(poste)
        {
          this.id=poste.id
          VueDialog.confirm('Voulez vous supprimer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                   
                    this.isload=true
                  
          }
                  )
              
  
        },
        cancel()
        {
          
         
  
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
  
  