// src/api/rockets.ts
import request from './index';

export interface Rocket {
	id: string;
	name: string;
	description: string;
	rocket_images: string[];
}

export interface RocketDetail {
	cost_per_launch: number;
	country: string;
	first_flight: string;
}

// ROCKET LIST
export const getAllRockets = async (): Promise<Rocket[]> => {
	try {
		const data = await request<Rocket[]>('/v4/rockets');

		// console.log(data);
		const apiRockets = data.map((rocket) => ({
			id: rocket.id,
			name: rocket.name,
			description: rocket.description,
			rocket_images: rocket.flickr_images,
		}));

		const localRockets: Rocket[] = JSON.parse(sessionStorage.getItem('userRockets') || '[]');

		const dataRockets = [...apiRockets];

		localRockets.forEach(localRocket => {
			if (!dataRockets.find(r => r.id === localRocket.id)) {
				dataRockets.push(localRocket);
			}
		});

		return dataRockets;
	}
	catch (error){
		console.error('Failed to fetch rockets from API:', error);
		const localRockets: Rocket[] = JSON.parse(sessionStorage.getItem('userRockets') || '[]');
		
		if (localRockets.length > 0) {
			return localRockets;
		}
		
		throw error;
	}
}

// ROCKET DETAIL
export const getRocketDetail = async (id: string): Promise<RocketDetail> => {
	try {
		const data = await request<RocketDetail>(`/v4/rockets/${id}`);

		// console.log(data);
		return {
			id: data.id,
			name: data.name,
			description: data.description,
			rocket_images: data.flickr_images,
			cost_per_launch: data.cost_per_launch,
			country: data.country,
			first_flight: data.first_flight,
		};
	}
	catch (error) {
		const localData = JSON.parse(sessionStorage.getItem('userRockets') || '[]');
		const localRocket = localData.find((r: any) => r.id === id);
		if (localRocket) return localRocket;
		else throw new Error("Rocket not found in API or local storage");
	}
}