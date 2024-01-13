// useAxios.js
import axios from 'axios';

export default function useAxios() {
	axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

	const sendRequest = async (method, url, request = null) => {
		try {
			const config = {
				method,
				url,
			};

			if (method.toLowerCase() === 'get') {
				// GET 요청일 경우 데이터를 쿼리 파라미터로 붙임
				config.params = request;
			} else {
				// GET 이외의 요청일 경우 데이터를 바디에 포함
				config.data = request;
			}

			const { status, data } = await axios(config);

			return { status, data };
		} catch (error) {
			return {
				status: error.response.status || 500,
				error: error.response.data || 'Internal Server Error',
			};
		}
	};

	return {
		sendRequest,
	};
}
