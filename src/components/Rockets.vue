<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { getAllRockets } from '@/api/rockets';
import { useDisplay } from 'vuetify';
import Loading from '@/components/Loading.vue';
import { addNotification } from "@/composables/useNotifications"

const router = useRouter()

const rockets = ref<Rocket[]>([]);
const search = ref('');

const { mdAndUp, smAndDown } = useDisplay();
const popup = ref(false);
const popupForm = ref(false)
const isLoading = ref(false)
const selectedRocketImages = ref<string[]>([]);

const newRocket = ref({
	rocket_images: [] as string[],
	name: '',
	description: '',
	cost_per_launch: '',
	country: '',
	first_flight: ''
});

const filteredRockets = computed(() =>
	rockets.value.filter((rocket) =>
		rocket.name.toLowerCase().includes(search.value.toLowerCase())
	)
);

const fetchData = async () => {
	isLoading.value = true
	try {
		const data = await getAllRockets();
		// console.log(data);

		rockets.value = data;
		addNotification("Data Retrieved", "success", "toast")
	}
	catch (error) {
		addNotification(
			"Failed to fetch rockets. Please try again.",
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

const goToDetail = (id: string) => {
	router.push(`/rockets/${id}`)

	window.addEventListener('beforeunload', clearLocalRockets);
}

onMounted(async () => {
	fetchData();
});

function openImagePopup(images: string[]) {
	if (mdAndUp.value) {
		selectedRocketImages.value = images;
		popup.value = true;
	}
}

function onImageUpload(event: Event) {
	const files = (event.target as HTMLInputElement).files;
	if (!files) return;

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const reader = new FileReader();
		reader.onload = (e) => {
			const base64 = e.target?.result as string;
			newRocket.value.rocket_images.push(base64);
		};
		reader.readAsDataURL(file);
	}
}

function removeImage(index: number) {
	newRocket.value.rocket_images.splice(index, 1);
}

function resetForm() {
	newRocket.value = {
		rocket_images: [],
		name: '',
		description: '',
		cost_per_launch: '',
		country: '',
		first_flight: ''
	};
}

function generateId() {
	const chars = 'abcdef0123456789';
	let result = '';
	for (let i = 0; i < 24; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

function submitForm() {
	if (
		!newRocket.value.name.trim() ||
		!newRocket.value.description.trim() ||
		!newRocket.value.cost_per_launch.trim() ||
		!newRocket.value.country.trim() ||
		!newRocket.value.first_flight.trim() ||
		newRocket.value.rocket_images.length === 0
	) {
		addNotification("Please fill all fields and upload at least one image", "error", "toast");
		return;
	}

	const newRocketData = {
		id: generateId(),
		rocket_images: newRocket.value.rocket_images,
		name: newRocket.value.name,
		description: newRocket.value.description,
		cost_per_launch: newRocket.value.cost_per_launch,
		country: newRocket.value.country,
		first_flight: newRocket.value.first_flight,
	};

	const savedRockets = JSON.parse(sessionStorage.getItem('userRockets') || '[]');
	savedRockets.push(newRocketData);
	sessionStorage.setItem('userRockets', JSON.stringify(savedRockets));

	rockets.value.unshift(newRocketData);
	addNotification("Rocket added successfully!", "success", "toast");

	resetForm();
	popupForm.value = false;
}
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
				<v-text-field
					v-model="search"
					label="Search Rockets"
					prepend-inner-icon="mdi-magnify"
					hide-details
					dense
					class="search-box"
				/>

				<button class="add-btn" @click="popupForm = true">
					<span class="mdi mdi-plus"></span>
					Add Rocket
				</button>
			</div>

			<!-- Desktop Table -->
			<v-table v-if="mdAndUp" striped="even" class="mt-10 rocket-table bordered-table" style="border-radius: unset !important;">
				<thead>
					<tr>
						<th style="width: 300px; vertical-align: middle;">Rocket Image</th>
						<th style="width: 300px; vertical-align: middle;">Rocket Name</th>
						<th style="vertical-align: middle;">Description</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="rocket in filteredRockets" :key="rocket.id">
						<td style="margin-top: auto !important; margin-bottom: auto !important;">
							<v-img
								:src="rocket.rocket_images[0]"
								max-width="100"
								aspect-ratio="1"
								contain
								class="open-image"
								@click="openImagePopup(rocket.rocket_images)"
								style="cursor: pointer;"
							/>
						</td>
						<td style="vertical-align: middle;">{{ rocket.name }}</td>
						<td style="vertical-align: middle;">{{ rocket.description }}</td>
						<td style="vertical-align: middle;">
							<v-btn
								variant="outlined"
								color="blue"
								class="square-btn"
								@click="goToDetail(rocket.id)"
							>
								<v-icon>mdi-eye</v-icon>
							</v-btn>
						</td>
					</tr>
				</tbody>
			</v-table>

			<!-- Mobile/Tablet Cards -->
			<div v-else class="d-flex flex-column gap-4">
				<v-card
					v-for="rocket in filteredRockets"
					:key="rocket.id"
					class="pa-3 mb-4"
					style="cursor: pointer;"
			        @click="goToDetail(rocket.id)"
				>
					<v-carousel
						hide-delimiters
						height="200"
						cycle
					>
						<v-carousel-item
							v-for="(img, index) in rocket.rocket_images"
							:key="index"
						>
							<v-img
								:src="img"
								height="200"
								contain
							/>
						</v-carousel-item>
					</v-carousel>
					<v-card-title>{{ rocket.name }}</v-card-title>
					<v-card-text>{{ rocket.description }}</v-card-text>
				</v-card>
			</div>
		</v-card>

		<!-- POPUP ROCKET IMAGES -->
		<v-dialog v-model="popup" max-width="600px" style="height: 80vh !important;" persistent>
			<v-card color="white" class="dialog-card">
				<v-toolbar flat>
					<v-toolbar-title>Rocket Images</v-toolbar-title>
					<v-spacer />
					<v-btn icon @click="popup = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
				<v-carousel
					hide-delimiters
					cycle
					show-arrows
					class="carousel-container"
				>
					<v-carousel-item
						v-for="(img, idx) in selectedRocketImages"
						:key="idx"
					>
						<v-img
							:src="img"
							contain
							class="carousel-img"
						/>
					</v-carousel-item>
				</v-carousel>
			</v-card>
		</v-dialog>

		<!-- POPUP FORM ADD ROCKET -->
		<v-dialog v-model="popupForm" max-width="600px" style="height: 80vh !important;" persistent>
			<v-card color="white" class="pa-6">
				<v-toolbar flat>
					<v-toolbar-title>Add New Rocket</v-toolbar-title>
					<v-spacer />
					<v-btn icon @click="popupForm = false; resetForm()">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>

				<v-form class="add-rocket-form">
					<v-file-input
						label="Upload Rocket Images"
						multiple
						show-size
						accept="image/*"
						@change="onImageUpload"
						clearable
					></v-file-input>

					<div class="image-preview-container" v-if="newRocket.rocket_images.length > 0">
						<div
							v-for="(img, idx) in newRocket.rocket_images"
							:key="idx"
							class="image-preview"
						>
							<img :src="img" alt="Rocket Image" />
							<button type="button" @click="removeImage(idx)">×</button>
						</div>
					</div>

					<v-text-field
						v-model="newRocket.name"
						label="Rocket Name"
						required
						class="mt-4"
					/>

					<v-textarea
						v-model="newRocket.description"
						label="Description"
						required
					/>

					<v-text-field
						v-model="newRocket.cost_per_launch"
						label="Cost per Launch (USD)"
						type="number"
						required
					/>

					<v-text-field v-model="newRocket.country" label="Country" required />
					<v-text-field
						v-model="newRocket.first_flight"
						label="First Flight Date"
						type="date"
						required
					/>

					<v-btn
						color="green"
						class="mt-6"
						block
						@click="submitForm"
					>
						Submit
					</v-btn>
				</v-form>
			</v-card>
		</v-dialog>
	</div>
	<Loading :isLoading="isLoading" />
</template>

<style scoped>
	.search-box {
		max-width: 300px;
	}

	.search-box >>> .v-field--variant-filled .v-field__overlay {
		background-color: transparent !important;
	}

	.search-box >>> .v-input__control {
		background-color: transparent !important;
	}

	.search-box >>> input {
		background-color: transparent !important;
	}

	.search-box >>> .v-input--is-focused .v-input__control {
		background-color: transparent !important;
	}

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

	.rocket-table {
		border: 1px solid #ccc;
		border-collapse: collapse;
	}

	.rocket-table th, .rocket-table td {
		border: 1px solid #ccc;
		padding: 12px;
		vertical-align: top;
		text-align: left;
	}

	.square-btn {
		border-radius: 0 !important;
		min-width: 40px;
		width: 40px;
		height: 40px;
		padding: 0;
	}

	.square-btn:hover .v-icon {
		color: white !important;
	}

	.dialog-card {
		max-width: 700px;
		max-height: 90vh;
		overflow-y: auto;
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

	.add-rocket-form >>> .v-field--variant-filled .v-field__overlay, .add-rocket-form >>> .v-btn__overlay {
		background-color: transparent !important;
		opacity: 0 !important;
	}

	.image-preview-container {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 10px;
	}

	.image-preview {
		position: relative;
		width: 100px;
		height: 100px;
	}

	.image-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 4px;
		box-shadow: 0 0 5px rgba(0,0,0,0.2);
	}

	.image-preview button {
		position: absolute;
		top: 2px;
		right: 2px;
		background: rgba(255,255,255,0.8);
		border: none;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		cursor: pointer;
		font-weight: bold;
		line-height: 18px;
		padding: 0;
	}
</style>
