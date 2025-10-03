<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { getRocketDetail } from '@/api/rockets';
import Loading from '@/components/Loading.vue';
import { addNotification } from "@/composables/useNotifications"

const route = useRoute()
const router = useRouter()

const rocket = ref<RocketDetail>([]);
const isLoading = ref(false)
const rocketId = route.params.id_rocket

function formatDate(dateString) {
	const date = new Date(dateString);

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = String(date.getFullYear());
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${day}-${month}-${year}`;
}

const formatCurrency = (value) => {
	if (isNaN(value)) return value;
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format(Number(value));
};

const fetchData = async () => {
	isLoading.value = true
	try {
		const data = await getRocketDetail(rocketId);

		const formattedRocketDetail = {
			...data,
			formattedFirstFlight: formatDate(data.first_flight),
			formattedCost: formatCurrency(data.cost_per_launch)
		}

		rocket.value = formattedRocketDetail
		addNotification("Data Retrieved", "success", "toast")
	}
	catch (error) {
		addNotification(
			"Failed to fetch rocket data. Please try again.",
			"error",
			"popup",
			0,
			fetchData
		)
	}
	finally {
		isLoading.value = false
	}
}

const goToHome = () => {
	router.push('/rockets')
}

onMounted(async () => {
	fetchData();
});
</script>

<template>
	<div class="my-8">
		<v-card
			color="white"
			width="100%"
			rounded="xl"
			elevation="6"
			class="d-flex flex-column gap-6 pa-6"
		>
			<div class="d-flex justify-space-between align-center mb-4">
				<button class="add-btn" @click="goToHome()">
					<span class="mdi mdi-arrow-left"></span>
					Back
				</button>
			</div>

			<div v-if="rocket && rocket.name" class="rocket-detail">
				<table class="rocket-detail-table">
					<tbody>
						<tr>
							<th>Rocket Images</th>
							<td>
								<v-carousel
									v-if="rocket.rocket_images && rocket.rocket_images.length"
									hide-delimiters
									cycle
									show-arrows
									class="carousel-container"
								>
									<v-carousel-item
										v-for="(img, idx) in rocket.rocket_images"
										:key="idx"
									>
										<v-img
											:src="img"
											contain
											class="carousel-img"
										/>
									</v-carousel-item>
								</v-carousel>
							</td>
						</tr>
						<tr>
							<th>Rocket Name</th>
							<td>{{ rocket.name }}</td>
						</tr>
						<tr>
							<th>Description</th>
							<td>{{ rocket.description }}</td>
						</tr>
						<tr>
							<th>Cost Per Launch</th>
							<td>{{ rocket.formattedCost }}</td>
						</tr>
						<tr>
							<th>Country</th>
							<td>{{ rocket.country }}</td>
						</tr>
						<tr>
							<th>First Flight</th>
							<td>{{ rocket.formattedFirstFlight }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</v-card>
	</div>
	<Loading :isLoading="isLoading" />
</template>

<style scoped>
	.add-btn {
		background-color: green;
		color: white;
		border: none;
		padding: 8px 16px;
		display: inline-flex;
		align-items: center;
		cursor: pointer;
		font-size: 16px;
		border-radius: 4px;
		transition: background-color 0.3s ease;
	}

	.add-btn .mdi {
		margin-right: 8px;
		font-size: 18px;
	}

	.add-btn:hover {
		background-color: #145214;
	}

	.rocket-detail-table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	.rocket-detail-table th,
	.rocket-detail-table td {
		border: 1px solid #ccc;
		padding: 12px 16px;
		vertical-align: middle;
		word-wrap: break-word;
	}

	.rocket-detail-table th {
		background-color: #f5f5f5;
		width: 30%;
		font-weight: 600;
	}

	.carousel-container {
		height: 80vh !important;
	}

	.carousel-item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: auto !important;
		max-height: 80vh;
	}

	.carousel-img {
		max-width: 100%;
		max-height: 80vh;
		object-fit: contain;
	}
</style>
