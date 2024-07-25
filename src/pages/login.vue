<script setup lang="ts">
import { router } from '@/plugins/1.router'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import axios from 'axios'

definePage({
  meta: {
    layout: 'blank',
  },
})
const isPasswordVisible = ref(false)
const form = ref({
  username: '',
  password: '',
})

const resetForm = ref({
  username: '',
  password: '',
})

const generateRandomToken = () => {
  return Math.random().toString(36).substr(2);
};

const token = ref("")
const logIn = async ()=>{
 
    const res = await axios.post(import.meta.env.VITE_SPRING_BOOT_API_URL+"/auth/login?username="+form.value.username+"&password="+form.value.password)
    useCookie("accessToken").value=res.data["access_token"]
    await router.push({name:"root"})
 
}

</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <div class="app-logo">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
              <h1 class="app-logo-title">
                {{ themeConfig.app.title }}
              </h1>
            </div>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">
            Bienvenue au <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 👋🏻
          </h4>
          <p class="mb-0">
            Veuillez vous connecter à votre compte et commencer l'aventure
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="() => {}">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.username"
                  autofocus
                  label="Nom d'utilisateur"
                  type="text"
                  placeholder="Nom d'utilisateur"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  label="Mot de passe"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

              

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                  class="my-7"
                  @click="logIn"
                >
                Se Connecter
                </VBtn>
              </VCol>

              <!-- create account -->
              

              <VCol
                cols="12"
                class="d-flex align-center"
              >
               
              </VCol>

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
