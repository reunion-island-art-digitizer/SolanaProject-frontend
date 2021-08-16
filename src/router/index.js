import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import( '../views/Projects.vue' ),
    props:   route  => ({
      cateID: route.query.cateID,
      tagID: route.query.tagID,
    })
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('../views/Rank.vue')
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: () => import( '../views/Project.vue' ),
    props:true
  },
  {
    path: '/submit',
    name: 'Submit',
    component: () => import('../views/Submit.vue')
  },
  {
    path: '/rpcserver',
    name: 'RPCServer',
    component: () => import('../views/RPCServer.vue')
  },
]
const router = new VueRouter({
  routes
})

export default router
