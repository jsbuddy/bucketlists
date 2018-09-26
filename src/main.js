import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Axios from 'axios'

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;

Axios.interceptors.request.use((config) => {
	const token = JSON.parse(localStorage.getItem('token'));
	config.headers[ 'Authorization' ] = token;
	return config;
});

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');