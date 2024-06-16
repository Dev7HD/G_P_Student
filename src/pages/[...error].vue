<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import misc404 from '@images/404.png';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

definePage({
  alias: '/pages/misc/not-found/:error(.*)',
  meta: {
    layout: 'blank',
    public: true,
  },
})
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="404"
      title="Page introuvable ⚠️"
      description="Nous n'avons pas trouvé la page que vous recherchez."
    />

    <VBtn
      :to="{ name: 'root' }"
      class="mb-0 index"
      
    >
    <span class="text-uppercase">  Revenir à l'accueil</span>
    </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center margin" >
      <VImg
        :src="misc404"
        alt="error 404"
        :max-height="$vuetify.display.smAndDown ? 350 : 500"
        class="mx-auto"
      />
    </div>

    <img
      class="misc-footer-img d-none d-md-block"
      :src="authThemeMask"
      alt="misc-footer-img"
      height="320"
    >
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";

.index{
  z-index: 1000000;
}
.margin{
  margin-top: -66px;
}
</style>
