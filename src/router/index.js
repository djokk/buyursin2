import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '@/views/Auth.vue'
import Dashboard from '@/views/Admin/Dashboard.vue'
import Models from '@/views/Admin/Models.vue'
import ModelsItem from '@/views/Admin/ModelsItem.vue'

import Add from '@/views/Admin/Add/Add.vue'
import Branches from '@/views/Admin/Add/Branches.vue'
import Colors from '@/views/Admin/Add/Colors.vue'
import Units from '@/views/Admin/Add/Units.vue'
import Matters from '@/views/Admin/Add/Matters.vue'
import Groups from '@/views/Admin/Add/Groups.vue'
import Employes from '@/views/Admin/Add/Employes.vue'
import Worktemplates from '@/views/Admin/Add/Worktemplates.vue'
import Users from '@/views/Admin/Add/Users.vue'
import Product from '@/views/Admin/Product/Product.vue'
import SendingFinishedProduct from '@/views/Admin/Product/Sending/SendingFinishedProduct.vue'
import SendingProduct from '@/views/Admin/Product/Sending/SendingProduct.vue'
import ReceptionFinishedProduct from '@/views/Admin/Product/Reception/ReceptionFinishedProduct.vue'
import ReceptionProduct from '@/views/Admin/Product/Reception/ReceptionProduct.vue'


import BRDashboard from '@/views/Branches/BRDashboard.vue'
import BRPay from '@/views/Branches/BRPay.vue'
import BRStore from '@/views/Branches/BRStore.vue'
import BRAdd from '@/views/Branches/Add/BRAdd.vue'
import BREmployes from '@/views/Branches/Add/BREmployes.vue'

import Warehouse from '@/views/Warehouse/Warehouse.vue'
import WRSending from '@/views/Warehouse/WRSending.vue'
import WRSendingProduct from '@/views/Warehouse/Product/Sending/WRSendingProduct.vue'
import WRSendingFinishedProduct from '@/views/Warehouse/Product/Sending/WRSendingFinishedProduct.vue'
import WRSendingAddFinishedProduct from '@/views/Warehouse/Product/Sending/WRSendingAddFinishedProduct.vue'
import WRReception from '@/views/Warehouse/WRReception.vue'
import WRReceptionProduct from '@/views/Warehouse/Product/Reception/WRReceptionProduct.vue'
import WRReceptionFinishedProduct from '@/views/Warehouse/Product/Reception/WRReceptionFinishedProduct.vue'
// import NotFound from '@/views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth,
    meta: {
      layout: 'AuthLayout'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/models',
    name: 'Models',
    component: Models,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/models/:productName/:id',
    name: 'ModelsItem',
    component: ModelsItem,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add',
    name: 'Add',
    component: Add,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add/colors',
    name: 'Colors',
    component: Colors,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add/units',
    name: 'Units',
    component: Units,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add/matters',
    name: 'Matters',
    component: Matters,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add/groups',
    name: 'Groups',
    component: Groups,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add/branches',
    name: 'Branches',
    component: Branches,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add/employes',
    name: 'Employes',
    component: Employes,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add/worktemplates',
    name: 'Worktemplates',
    component: Worktemplates,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/add/users',
    name: 'Users',
    component: Users,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/sending/finished-product',
    name: 'SendingFinishedProduct',
    component: SendingFinishedProduct,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/sending/product',
    name: 'SendingProduct',
    component: SendingProduct,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/reception/finished-product',
    name: 'ReceptionFinishedProduct',
    component: ReceptionFinishedProduct,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/reception/product',
    name: 'ReceptionProduct',
    component: ReceptionProduct,
    meta: {
      layout: 'Default'
    }
  },
  {
    path: '/branch-dashboard',
    name: 'BRDashboard',
    component: BRDashboard,
    meta: {
      layout: 'BranchLayout'
    }
  },
  {
    path: '/branch-store',
    name: 'BRStore',
    component: BRStore,
    meta: {
      layout: 'BranchLayout'
    }
  },
  {
    path: '/branch-pay',
    name: 'BRPay',
    component: BRPay,
    meta: {
      layout: 'BranchLayout'
    }
  },
  {
    path: '/branch-add',
    name: 'BRAdd',
    component: BRAdd,
    meta: {
      layout: 'BranchLayout'
    }
  },
  {
    path: '/branch-employes',
    name: 'BREmployes',
    component: BREmployes,
    meta: {
      layout: 'BranchLayout'
    }
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: Warehouse,
    meta: {
      layout: 'WarehouseLayout'
    }
  },
  {
    path: '/wr-sending',
    name: 'WRSending',
    component: WRSending,
    meta: {
      layout: 'WarehouseLayout'
    }
  },
  {
    path: '/wr-sending/product',
    name: 'WRSendingProduct',
    component: WRSendingProduct,
    meta: {
      layout: 'WarehouseLayout'
    }
  },
  {
    path: '/wr-sending/finished-product',
    name: 'WRSendingFinishedProduct',
    component: WRSendingFinishedProduct,
    meta: {
      layout: 'WarehouseLayout'
    }
  },
  {
    path: '/wr-sending/finished-product/add',
    name: 'WRSendingAddFinishedProduct',
    component: WRSendingAddFinishedProduct,
    meta: {
      layout: 'WarehouseLayout'
    }
  },
  {
    path: '/wr-reception',
    name: 'WRReception',
    component: WRReception,
    meta: {
      layout: 'WarehouseLayout'
    }
  },
  {
    path: '/wr-reception/product',
    name: 'WRReceptionProduct',
    component: WRReceptionProduct,
    meta: {
      layout: 'WarehouseLayout'
    }
  },
  {
    path: '/wr-reception/finished-product',
    name: 'WRReceptionFinishedProduct',
    component: WRReceptionFinishedProduct,
    meta: {
      layout: 'WarehouseLayout'
    }
  },
  // {
  //   path: '*',
  //   name: 'NotFound',
  //   component: NotFound,
  //   meta: {
  //     layout: 'AuthLayout'
  //   }
  // },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
