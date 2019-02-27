<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Dashboard</a>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
          <drop-down tag="li">
            <template slot="title">
              <i class="nc-icon nc-planet"></i>
              <b class="caret"></b>
              <span class="notification">5</span>
            </template>
            <a class="dropdown-item" href="#">Notification 1</a>
            <a class="dropdown-item" href="#">Notification 2</a>
            <a class="dropdown-item" href="#">Notification 3</a>
            <a class="dropdown-item" href="#">Notification 4</a>
            <a class="dropdown-item" href="#">Another notification</a>
          </drop-down>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <span class="nav-link" style="font-size:18px">
                <img src="static/img/default-avatar.png" class="img img-rounded" width="25" height="17" alt="">
              {{this.$session.get('nom')}}
            </span>
          </li>
          <li class="nav-item">
            <button  class="btn btn-primary" @click="logout" >
              <span style="font-size:11px">Déconnexion</span>
            </button>
          </li>
        </ul>
      </div>
      
      <Loading :active.sync="isload" 
      :can-cancel="true" 
      :is-full-page="true"></Loading>
    </div>
  </nav>
</template>
<script>
  /* eslint-disable */
   import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.min.css';
  import monstore from 'src/store/Monstore';

  export default {
    components:{
      Loading,
    },
    beforeCreate()
    {
      if(!this.$session.exists())
       {
        this.$router.push('/login_apps')
      }
    },
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      },
      
    },
    
    data () {
      return {
        activeNotifications: false,
        state:monstore.state,
        url:'logout',
        isload:false
        
      }
    },
    methods: {
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      logout: function () {
        this.isload=true
        this.$http.get(this.state.url+this.url+'/'+this.$session.get('idCon')).then(Response=>{
        this.$session.destroy()
        this.isload=false
        this.$router.push('/login_apps')
        })
     
    }
    }
  }

</script>
<style>

</style>
