import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  config.headers['Authorization'] = 'Bearer '
  return config
}, (error) => {
  return Promise.reject(error)
})
apiClient.interceptors.response.use(
  (response) => {
    // Modify the response data before it's passed to the calling code
    return response.data;
  },
  (error) => {
    // Handle the response error
    if (error.response) {
      // The server responded with an error status code (4xx or 5xx)
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient