<template>
        
    <div class="container">
            <br><br><br><br></br><br></br>
        <div class="row">
            <div class="col-lg-5 col-md-5" style="margin-left: 30%;border:1px solid;border-radius:8px; padding-left:2%;padding-right:2%;padding-bottom:2%">
                <div class="entet bg-success" style="border:1px solid;border-radius:8px">
                    <center style="color: white">
                <b>AUTHENTIFICATION</b>
                    </center>
                </div>
                    <br><br>
                <div class="panel" >
                    <div class="panel-body">
                        <label>UTILISATEUR*</label>
                        <br>
                        <input type="text" class="form-control" placeholder="nom d'utilisateur" v-model="user.nom" required>
                        <br>
                        <label>MOT DE PASSE*</label>
                        <br>
                        <input type="password" class="form-control" placeholder="mot de passe"  v-model="user.password" required>
                        <br>
                        <input type="button" :value="state.annuler" @click="cancel" class="btn btn-info btn-fill float-right" style="margin-left:4px">
                        <input type="button" :value="state.valider" @click="login" class="btn btn-success btn-fill float-right">
                        
                    </div>
                </div>
                <vuedals></vuedals>
                <Loading :active.sync="isload" 
                :can-cancel="true" 
                :is-full-page="true"></Loading>
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

    data()
    {
        return{
            user:{
                nom:'',
                password:''
            },
            state:monstore.state,
            url:'login',
            isload:false
        }
    },
    methods:{
        login()
        {
            if(this.user.nom==''|| this.user.password=='' )
            {
                this.notifyVue('top', 'center','warning','veuillez remplir ces champs')


            }
            else{
                this.isload=true
               
            this.$http.post(this.state.url+this.url,this.user).then(response=>{
              
                if(response.data.erreur)
                {
                   this.isload=false
                   this.notifyVue('top', 'center','danger','nom d\'utilisateur ou mot de passe incorrecte ')
                   
                }
                else{
                    this.isload=false
                    this.$session.start()
                    this.$session.set('id',response.data.id)
                    this.$session.set('nom',response.data.nom)
                    this.$session.set('nomper',response.data.nomper)
                    this.$session.set('prenomper',response.data.prenomper)
                    this.$session.set('idCon',response.data.idCon)
                    this.$router.push('/admin/presences')
                }
            })

            }

        },
        cancel(){
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
            icon: 'nc-icon nc-app',
            horizontalAlign: horizontalAlign,
            verticalAlign: verticalAlign,
            type: color
          })
      }

    }
    }
  
  </script>
  