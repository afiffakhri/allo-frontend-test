import { ref } from "vue"

export type NotificationType = "success" | "error" | "warning" | "info"
export type NotificationMode = "toast" | "popup"

export interface Notification {
	id: number
	message: string
	type: NotificationType
	mode: NotificationMode
	onRetry?: () => void
}

const notifications = ref<Notification[]>([])
let idCounter = 0

export function addNotification(
	message: string,
	type: NotificationType = "info",
	mode: NotificationMode = "toast",
	duration = 3000,
	onRetry?: () => void
) {
	const id = ++idCounter
	notifications.value.push({ id, message, type, mode, onRetry })

	if (duration > 0) {
		setTimeout(() => removeNotification(id), duration)
	}
}

export function removeNotification(id: number) {
	notifications.value = notifications.value.filter(n => n.id !== id)
}

export function useNotifications() {
	return {
		notifications,
		addNotification,
		removeNotification,
	}
}
