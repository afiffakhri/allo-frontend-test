<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
	isLoading: boolean
}>()
</script>

<template>
	<div v-if="isLoading" class="loading-overlay">
		<div class="loading-content">
			<v-progress-circular
				indeterminate
				size="50"
				width="7"
				color="red"
			></v-progress-circular>
			<p class="loading-text">Loading...</p>
		</div>
	</div>
</template>


<style scoped>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(255, 255, 255, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}
	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.loading-text {
		margin-top: 12px;
		color: #555;
		font-weight: 500;
		font-size: 1rem;
	}
</style>