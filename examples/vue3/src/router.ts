import { createWebHashHistory, createRouter } from 'vue-router'

import HomeView from './Home'
import TaskView from './Task'
import FeaturesView from "./Features"

const routes = [
  { path: '/', component: HomeView },
  { path: '/task', component: TaskView },
  { path: '/features', component: FeaturesView },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


