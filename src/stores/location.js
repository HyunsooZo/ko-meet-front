// 네이티브 개발 전 임시 스토어
import { defineStore } from 'pinia';

export const useLocationStore = defineStore({
	id: 'location',
	state: () => ({
		latitude: null,
		longitude: null,
	}),
	actions: {
		setLocation({ latitude, longitude }) {
			this.latitude = latitude;
			this.longitude = longitude;
		},
	},
});

export const useCountryStore = defineStore({
	id: 'country',
	state: () => ({
		country: null,
		region: null,
	}),
	actions: {
		setCountry({ country, region }) {
			this.country = country;
			this.region = region;
		},
	},
});
