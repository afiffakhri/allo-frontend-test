import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '@/pages/LandingPage.vue';

const routes = [
	{
		path: '/',
		name: 'LandingPage',
		component: LandingPage,
	},
	{
		path: '/rockets',
		name: 'RocketList',
		component: LandingPage,
	},
	{
		path: '/rockets/:id_rocket',
		name: 'RocketDetail',
		component: LandingPage,
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

export default router
