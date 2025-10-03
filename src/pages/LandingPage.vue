<script setup lang="ts">
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Rockets from '@/components/Rockets.vue';
import RocketDetail from '@/components/RocketDetail.vue';

const route = useRoute();
</script>

<template>
	<v-app>
		<Header />

		<v-main>
			<v-container>
				<Rockets v-if="!route.params.id_rocket" />
				<RocketDetail v-else :id="route.params.id_rocket" />
			</v-container>
		</v-main>
	</v-app>
</template>