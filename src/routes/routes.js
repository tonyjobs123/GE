import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import UserProfile from 'src/components/Dashboard/Views/UserProfile.vue'
import TableList from 'src/components/Dashboard/Views/TableList.vue'
import Typography from 'src/components/Dashboard/Views/Typography.vue'
import Icons from 'src/components/Dashboard/Views/Icons.vue'
//import Maps from 'src/components/Dashboard/Views/Maps.vue'
import Notifications from 'src/components/Dashboard/Views/Notifications.vue'
import Poste from 'src/components/Dashboard/Views/Poste.vue'
import Personnel from 'src/components/Dashboard/Views/Personnel.vue'
import Profil from 'src/components/Dashboard/Views/Profil.vue'
import Menu from 'src/components/Dashboard/Views/Menu.vue'
import User from 'src/components/Dashboard/Views/User.vue'
import Droit from 'src/components/Dashboard/Views/Droit.vue'
import Login from 'src/components/GeneralViews/Login.vue'
import Connexion from 'src/components/Dashboard/Views/Connexion.vue'
import Historique from 'src/components/Dashboard/Views/Historique.vue'
import TypeMenu from 'src/components/Dashboard/Views/TypeMenu.vue'
import Annee from 'src/components/Dashboard/Views/Annee.vue'
import Trimestre from 'src/components/Dashboard/Views/Trimestre.vue'
import Ecole from 'src/components/Dashboard/Views/Ecole.vue'
import Faute from 'src/components/Dashboard/Views/Faute.vue'
import Type from 'src/components/Dashboard/Views/Type.vue'
import Matiere from 'src/components/Dashboard/Views/Matiere.vue'
import Classe from 'src/components/Dashboard/Views/Classe.vue'
import Groupe from 'src/components/Dashboard/Views/Groupe.vue'
const routes = [
  {
    path: '/',
    component: Overview,
    redirect: '/admin/overview'
  },
  {
    path: '/login_apps',
    component: Login,
    name: 'login_apps'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      {
        path: 'users',
        name: 'users',
        component: User
      },
      {
        path: 'table-list',
        name: 'Table List',
        component: TableList
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
  
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'postes',
        name: 'postes',
        component: Poste
      },
      {
        path: 'personnels',
        name: 'personnels',
        component: Personnel
      },
      {
        path: 'profils',
        name: 'profils',
        component: Profil
      },
      {
        path: 'menus',
        name: 'menus',
        component: Menu
      },
      {
        path: 'droits',
        name: 'droits',
        component: Droit
      },
      
      {
        path: 'connexions',
        name: 'connexions',
        component: Connexion
      },
     
      {
        path: 'typemenus',
        name: 'typemenus',
        component: TypeMenu
      },
        {
        path: 'annees',
        name: 'annees',
        component: Annee
      },
      {
        path: 'trimestres',
        name: 'trimestres',
        component: Trimestre
      },
      {
        path: 'ecoles',
        name: 'ecoles',
        component: Ecole
      },
      {
        path: 'fautes',
        name: 'fautes',
        component: Faute
      },
      {
        path: 'types',
        name: 'types',
        component: Type
      },
      {
        path: 'matieres',
        name: 'matieres',
        component: Matiere
      },
      {
        path: 'classes',
        name: 'classes',
        component: Classe
      },
      {
        path: 'groupes',
        name: 'groupes',
        component: Groupe
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
