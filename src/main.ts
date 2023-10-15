import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createRouter, createWebHistory } from "vue-router";
import naive from "naive-ui";
import Cookies from "js-cookie";
import "tailwindcss/tailwind.css";
// @ts-ignore
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

const app = createApp(App);
app.use(VueQueryPlugin);
const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);
const routes = setupLayouts(generatedRoutes);
const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach((to, from, next) => {
  console.log(to);
  const loggedIn = !!Cookies.get("token");

  if (to.meta.requiresAuth && !loggedIn) return next("/auth/login");
  if (to.name == "Index" && loggedIn) return next("/users");
  if (to.path == "/auth/login" && loggedIn) return next("/users");
  next();
});

app.use(router);
app.mount("#app");
app.use(naive);
