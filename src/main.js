import './assets/scss/_main.scss'
import './libs'

import App from './App.vue'
import VueSweetalert2 from 'vue-sweetalert2';
import axios from './libs/axios'
import { createApp } from 'vue'
import router from './router'
import store from './store';

const VueSweetalert2Options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
};

let app = createApp(App)
app.config.globalProperties.axios = axios

app.use(router).use(store)
  .use(VueSweetalert2, VueSweetalert2Options)
  .mount('#app')