<template>
        <div class="wrapper">
          <div class="main-panel">
            <top-navbar></top-navbar>
      
            
      
            <content-footer></content-footer>
          </div>
        </div>
      </template>
      <style lang="scss">
      
      </style>
      <script>
        import TopNavbar from 'src/components/Dashboard/Layout/TopNavbar.vue'
        import ContentFooter from 'src/components/Dashboard/Layout/ContentFooter.vue'
        import monstore from 'src/store/Monstore'
        import DropDown from 'src/components/UIComponents/Dropdown.vue'
        export default {
          components: {
            TopNavbar,
            ContentFooter,
            DropDown
          },
          mounted(){
     
          },
          data(){
            return{
              state:monstore.state,
              menus:[],
              types:[],
              url:'getmenu',
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
      