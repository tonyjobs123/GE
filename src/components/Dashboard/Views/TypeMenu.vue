<template>
    <div class="content ">
  
    <div class="container-fluid ">
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <card>
                   <center><h4>Ici vous pouvez gérer les types de menu</h4></center>
                </card>
            </div>
        </div>
      <div class="row " v-if="droit.c">
        <div class="col-lg-6 col-md-6">
          <card>
            <h4 v-if="edit" slot="header" class="card-title">Modifier un type de menu</h4>
            <h4 v-else slot="header" class="card-title">Enregistrer un type de menu</h4>
          <label>Libelle type*</label>
          <input type="text" v-model="type.libelle" v-validate="'required'" placeholder="Libelle" class="form-control" name="libelle">
          <span style="color:red" v-show="errors.has('libelle')">{{ errors.first('libelle') }}</span>
          <br>
            
            <input type="button" value="Annuler"  @click="cancel" class="btn btn-info btn-fill float-right" style="margin-left:4px"/>
            <input type="button" v-if="edit" @click="update"  value="Modifier" class="btn btn-success btn-fill float-right"/>
            <input type="button" v-else value="Enregistrer"@click="enreg"   class="btn btn-success btn-fill float-right"/>
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
              <h4 slot="header" class="card-title">La liste des types de menu</h4>
            <v-client-table 
            :data="types"
            :columns="columns" 
            :options="options">
             <a slot="#" slot-scope="props">{{props.index}}</a>
            <a slot="Modif" slot-scope="props" v-if="droit.m" class="fa fa-edit" ><button class="btn btn-warning btn-fill" @click="editer(props.row,props.index)">modifier</button></a>
            <a slot="Supp" slot-scope="props" v-if="droit.d" class="fa fa-remove" ><button class="btn btn-danger btn-fill" @click="supp(props.row,props.index)">supprimer</button></a>
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
          //index
          l:'',
         state:monstore.state,
          isload:false,
          url:'typemenus',
          type: {
            libelle:'',
            iduser:this.$session.get('id')
          },
          id:'',
          types: [],
          edit: false,
          page:'typemenus',
          url2:'getdroit',
          droit:{
            s:false,
            c:false,
            m:false,
            d:false,
          },
          columns: ['#', 'LibelleTypemenu','Modif','Supp'],
              options: {
                  headings: {
                      'LibelleTypemenu': 'Libelle',
                  },
                  sortable: ['LibelleTypemenu', '#'],
                  filterable: ['LibelleTypemenu', '#']
        }
        }
      },
      mounted(){
        this.$http.get(this.state.url+this.url).then(response=>{
          this.types=response.data.types;
        })
        this.$http.get(this.state.url+this.url2+'/'+this.type.iduser+'/'+this.page).then(response=>{
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
          this.$router.push('Overview')
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
              this.$http.post(this.state.url+this.url,this.type).then(response=>{
              this.notifyVue('top', 'right','success','Enrégistrer avec succès')
              this.types.push(response.data.type)
              this.type.libelle=''
              this.isload=false
            })  }
                  )
                          }
                      
                        })   
        },
        editer(type,l)
        {
          this.l=l
          this.edit=true
          this.id=type.id
          this.type.libelle=type.LibelleTypemenu
          this.type.id
          
        },
        update()
        {
          let l=this.l
          this.$validator.validate().then(result=>{
            
                          if(result){
                            VueDialog.confirm('Voulez vous enrégistrer les modifications?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                   
                    this.isload=true
                    this.$http.put(this.state.url+this.url+'/'+this.id,this.type).then(response=>{              
                    this.types[l-1].LibelleTypemenu=this.type.libelle
                    this.isload=false
                    this.notifyVue('top', 'right','success','modifier avec succès')
                    this.cancel();
                }) 
          }
           )  
            }
                      
                        })            
        },
       supp(type,l)
        {
          this.id=type.id
          VueDialog.confirm('Voulez vous supprimer?',{title:'confirmation',labels:{ok:'oui',cancel:'non'}})
                  .then(_=>{
                   
                    this.isload=true
                    this.$http.delete(this.state.url+this.url+'/'+this.id).then(response=>{
                    this.$http.get(this.state.url+this.url+'/'+this.$session.get('id'))  
                    this.isload=false
                    this.types.splice(l-1,1);
                    this.notifyVue('top', 'right','danger','supprimer avec succès')
                    
                }) 
          }
                  )
              
  
        },
        cancel()
        {
          this.edit=false
          this.type.libelle='';
  
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
  
  