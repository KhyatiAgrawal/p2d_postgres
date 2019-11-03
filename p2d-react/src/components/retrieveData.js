import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class retrieveData {
	constructor() {}

	getAllDresses() {
		const url = `${API_URL}/api/feed/`;
        return axios.get(url).then(response => response.data);
	}
}