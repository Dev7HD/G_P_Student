import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { jwtDecode } from 'jwt-decode'
import { router } from './plugins/1.router'
import { useUserStore } from './store/useUserStore'

function parseJwtToken(token){
    return jwtDecode(token)
}


router.beforeEach((to, from, next) => {
    const token = useCookie("accessToken").value
    if (token) {
        useUserStore().setRole(parseJwtToken(useCookie("accessToken").value)['sub']);
        useCookie("role").value = useUserStore().role
        if (to.name === 'login') {
            next({ name: 'root' }) // Redirect to home if trying to access login while authenticated
        } else {
            next() // Proceed to the requested route
        }
     } else {
        if (to.name !== 'login') {
            next({ name: 'login' }) 
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
