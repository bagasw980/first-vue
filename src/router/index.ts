import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Auth/Login/index.vue";
const routes = [
  {
    path: "/",
    component: Login,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
