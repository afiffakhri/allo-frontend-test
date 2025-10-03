<script lang="ts" setup>
import { useNotifications } from "@/composables/useNotifications"
import { computed } from "vue"

const { notifications, removeNotification } = useNotifications()

const typeConfig = {
	success: { color: "green", icon: "mdi-check-circle" },
	error: { color: "red", icon: "mdi-alert-circle" },
	warning: { color: "orange", icon: "mdi-alert" },
	info: { color: "blue", icon: "mdi-information" },
}
</script>

<template>
	<!-- Toast notifications -->
	<div class="notification-toast">
		<div
			v-for="n in notifications.filter(n => n.mode === 'toast')"
			:key="n.id"
			class="toast"
			:class="typeConfig[n.type].bg"
		>
			<div class="toast-icon">
				<v-icon :color="typeConfig[n.type].color">
					{{ typeConfig[n.type].icon }}
				</v-icon>
			</div>
			<div class="toast-message">
				{{ n.message }}
			</div>
			<button class="toast-close" @click="removeNotification(n.id)">
				<v-icon>mdi-close</v-icon>
			</button>
		</div>
	</div>

	<!-- Popup notifications -->
	<div
		v-for="n in notifications.filter(n => n.mode === 'popup')"
		:key="n.id"
		class="notification-popup-overlay"
	>
		<v-card class="popup-card" elevation="8">
			<v-btn icon class="popup-close" @click="removeNotification(n.id)">
				<v-icon color="black">mdi-close</v-icon>
			</v-btn>

			<v-card-actions class="justify-center flex-column mt-4">
				<v-icon
					:color="typeConfig[n.type].color"
					size="48"
				>
					{{ typeConfig[n.type].icon }}
				</v-icon>

				<!-- Retry button for errors -->
				<button
					v-if="n.type === 'error' && n.onRetry"
					class="retry-button"
					@click="() => { removeNotification(n.id); n.onRetry?.(); }"
				>
					<span class="mdi mdi-refresh"></span>
					Retry
				</button>
				<!-- <v-btn
					v-if="n.type === 'error' && n.onRetry"
					variant="outlined"
					color="red"
					class="retry-button"
					@click="() => { removeNotification(n.id); n.onRetry?.(); }"
				>
					<v-icon left>mdi-refresh</v-icon>
					Retry
				</v-btn> -->
			</v-card-actions>

			<v-card-title class="text-h6 text-black text-center">
				{{ n.message }}
			</v-card-title>
		</v-card>
	</div>
</template>

<style scoped>
	/* Container */
	.notification-toast {
		position: fixed;
		top: 16px;
		right: 16px;
		width: 320px;
		max-width: 90%;
		z-index: 9999;
	}

	/* Toast style */
	.toast {
		display: flex;
		align-items: center;
		border-radius: 8px;
		padding: 12px 16px;
		margin-bottom: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		color: #333;
		font-size: 14px;
		background-color: #fff;
		position: relative;
	}

	/* Background color by type */
	.toast-success {
		border-left: 6px solid #4CAF50;
		background-color: #e6f4ea;
	}

	.toast-error {
		border-left: 6px solid #F44336;
		background-color: #fdecea;
	}

	.toast-warning {
		border-left: 6px solid #FB8C00;
		background-color: #fff8e1;
	}

	.toast-info {
		border-left: 6px solid #2196F3;
		background-color: #e3f2fd;
	}

	/* Icon style */
	.toast-icon {
		margin-right: 12px;
	}

	/* Message */
	.toast-message {
		flex-grow: 1;
	}

	/* Close button */
	.toast-close {
		background: transparent;
		border: none;
		cursor: pointer;
		color: #666;
		padding: 0;
		margin-left: 12px;
	}

	.toast-close:hover {
		color: #000;
	}

	.notification-popup-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.popup-card {
		position: relative;
		padding: 24px;
		max-width: 600px;
		width: 90%;
		border-radius: 12px;
		background-color: white;
	}

	.popup-close {
		position: absolute;
		top: 8px;
		right: 8px;
	}

	.retry-button {
		background-color: transparent;
		color: red;
		border: 1px solid red;
		padding: 6px 12px;
		display: inline-flex;
		align-items: center;
		font-size: 14px;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s, color 0.3s;
	}

	.retry-button .mdi {
		margin-right: 6px;
		font-size: 18px;
	}

	.retry-button:hover {
		background-color: red;
		color: white;
	}
</style>