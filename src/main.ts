import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { router } from './plugins/1.router'

router.beforeEach((to, from, next) => {
    const token = useCookie("token").value
    if (token) {
        if (to.name === 'login') {
            next({ name: 'root' }) // Redirect to home if trying to access login while authenticated
        } else {
            next() // Proceed to the requested route
        }
    } else {
        if (to.name !== 'login') {
            next({ name: 'login' }) // Redirect to login if not authenticated
        } else {
            next() // Proceed to login
        }
    }
})
// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
