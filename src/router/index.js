import Vue from "vue"
import VueRouter from "vue-router"
import Index from "@/model/index.vue"
import HelloWorld from "../components/HelloWorld.vue"
import ElementUIDemo from "@/components/ElementUI"
import dragRouters from "./drag/index"

Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/index" },
  { path: "/index", component: Index },
  { path: "/helloWorld", component: HelloWorld },
  { path: "/elementuiDemo", component: ElementUIDemo },
  ...dragRouters,
  { path: "*", component: { functional: true, render: (h) => h("h1", "404") } }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
