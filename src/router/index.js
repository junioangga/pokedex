import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/pokedex-home.vue"),
  },
  {
    path: '/detail',
    name: 'about',
    component: () => import('../views/pokedex-detail.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
