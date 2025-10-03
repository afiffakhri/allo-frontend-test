<script lang="ts" setup>
	import Notifications from '@/components/Notifications.vue'
</script>

<template>
	<v-app>
		<v-main class="app-background">
			<Notification />
			<router-view />
		</v-main>
	</v-app>
</template>

<style scoped>
	.app-background {
		background: linear-gradient(180deg, #0b0c2e 0%, #1a1a40 50%, #0f141f 100%);
		min-height: 100vh;
		color: white;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		position: relative;
	}
</style>