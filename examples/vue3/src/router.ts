import { createWebHashHistory, createRouter } from 'vue-router'

import HomeView from './Home'
import TaskView from './Task'
import ReposView from "./Repos"
import FeaturesView from "./Features"
import AboutView from "./About"

const routes = [
  { path: '/', component: HomeView },
  { path: '/task', component: TaskView },
  { path: '/features', component: FeaturesView },
  { path: '/repos', component: ReposView },
  { path: '/about', component: AboutView },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


