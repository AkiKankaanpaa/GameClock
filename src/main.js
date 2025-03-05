import './assets/main.css'

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import wss from './services/socketservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)

wss.connect('ws://192.168.0.3:8080')

app.mount('#app')
