<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>  
      <router-link to="/admin/overview">
        <p style="font-size:17px;padding-left: 15%;height: 11px;color: white">TABLEAU DE BORD</p>
      </router-link>
      <div v-for="type in types">
       
       <p style="font-size:17px;padding-left: 15%;height: 7px;">{{type.LibelleTypemenu}}</p> 
     
       <div v-for="menu in menus"  >
          <div v-if="type.id==menu.id" >
          <router-link  :to="menu.UrlMenu" >
            <i :class="menu.IconMenu"></i>
            <p style="font-size:16px;height:5px; color:blanchedalmond;padding-left: 20%">{{menu.NomMenu}}</p>
          </router-link>
        </div>
       </div>
      </div>
    
    </side-bar>
 
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  import monstore from 'src/store/Monstore'
  import DropDown from 'src/components/UIComponents/Dropdown.vue'
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu,
      DropDown
    },
    mounted(){
      this.$http.get(this.state.url+this.url).then(response=>{
        this.types=response.data.types
      })
      this.$http.get(this.state.url+this.url1+"/"+this.$session.get('id')).then(response=>{
        this.menus=response.data.menus
      })
    },
    data(){
      return{
        state:monstore.state,
        menus:[],
        types:[],
        url:'typemenus',
        url1:'getmenu',
        droit:[]
      }
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      },
    
    }
  }

</script>
