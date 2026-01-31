import App from '@/App.vue'
import router from '@/router'
import { darkTheme, lightTheme } from '@/themes'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,          
    sets: {
      mdi,             
    },
  },
  
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme, 
      dark: darkTheme, 
    },
  },
})
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')