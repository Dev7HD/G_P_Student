<script setup lang="ts">
import { useUserStore } from '@/store/useUserStore';

const { fetchOne } = useUserStore()
const { data, isLoading } = storeToRefs(useUserStore())
const isDialogVisible = ref(false)
const file = ref([])
const cni = ref('')
const isClicked = ref(false)
const rules = ref([value => !!value || 'Champ Obligatoire.'])
// const rules = ref([
//   value => {
//     return !value || !value.length || value[0].size < 1000000 || 'La taille de la photo doit être inférieure à 1 MB!'
//   },
// ])
// const uploadPhoto = async () => {
//   const formdata = new FormData()

//   console.log(file.value)

//   formdata.append('file', file.value[0])
//   try {
//     await axios.post('/upload', formdata)
//   }
//   catch (error) {
//     error.value = error
//   }
// }

const searchUser = () => {
  isClicked.value = true
  if (cni.value != '')
    fetchOne(cni.value)
}


// const arr = [1, 2, 3, 4, 5]
// arr.reverse()
// console.log(arr) // [5, 4, 3, 2, 1]

const arr = ref([1, 2, 3, 4, 5])
const reverseOfArr = computed(() => arr.value.reverse())


console.log(arr.value , reverseOfArr.value);

</script>

<template>

 <div>
   <VRow >
    <VCol cols="12" md="12">
      <VCard class="overflow-visible">
        <div class="w-100  overflow-hidden rounded-t sticky-header" >
          <div class="d-flex align-center gap-4 flex-wrap  pa-6">
            <VCardTitle class="text-uppercase text-h3  "><span class="custom-letter-spacing">Gestion des Cartes Nationales</span></VCardTitle>
            <!-- <VSpacer />
      <div>
        <VBtn
          variant="tonal"
          class="me-5"
        >
          Back
        </VBtn>
        <VBtn>Place Order</VBtn>
      </div> -->
          </div>
        </div>
      </VCard>
    </VCol>
    <VCol cols="8" lg="3" md="4" sm="5">
      <VTextField v-model="cni" variant="outlined" :rules="rules" placeholder="Veuiller saisir votre cni svp" required hint="Exemple : XX123 ou X123" persistent-hint density="default">
        <!-- <template #append-inner>
      <VFadeTransition leave-absolute>
        <VProgressCircular
          v-if="isLoading"
          color="primary"
          width="4"
          size="34"
          indeterminate
        />

        <VNodeRenderer
          v-else
          class="text-2xl"
          :nodes="['leave-absolute']"
        /> 
      </VFadeTransition>
    </template> -->

        <template #label>
          <span><strong>Carte Nationale d'Identité </strong></span>
        </template>

      </VTextField>
    </VCol>
    <VCol cols="4" lg="2" md="4" sm="3">
      <VBtn size="large" @click="searchUser" :disabled="cni.length==0">
        <span v-if="isLoading">
          <VProgressCircular :size="20" color="#fff" indeterminate />
        </span>
        <span v-else>Rechercher</span>
      </VBtn>
    </VCol>

    <!-- 👉 Donnes Personnelles -->

    <VCol md="12" cols="12">
      <VCard v-if="data && !isLoading" class="border-xl border-primary ">
        <div class="d-flex justify-space-between  flex-wrap   flex-column flex-md-row">
          <div class="ma-auto pa-8 flex-grow-0">
            <VImg height="225" :width="144" aspect-ratio="16/9" cover :src="data?.imageUrl" />
          </div>

          <VDivider :vertical="$vuetify.display.mdAndUp" />

          <div class="flex-grow-1 pa-6">
            <VCardTitle class="text-h3 text-primary mb-5">
              {{ data.nom?.toLocaleUpperCase() }} {{ data.prenom?.toUpperCase() }}
            </VCardTitle>

            <VRow class="d-flex justify-space-between  gap-5 pl-5">
              <VCol cols="12" md="3" sm="4">
                <span>CNI :</span> <b class="font-weight-black">{{ data.cni }}</b>
              </VCol>
              <VCol cols="12" md="3" sm="4">
                <span>Matricule :</span> <b class="font-weight-black">{{ data.matricule }}</b>
              </VCol>

              <VCol cols="12" md="3" sm="4">
                <span>Promotion :</span> <b class="font-weight-black">{{ data.promotion }}</b>
              </VCol>
              <VCol cols="12" md="3" sm="4">
                <span>Grade :</span> <b class="font-weight-black">{{ data.grade }}</b>
              </VCol>

              <VCol cols="12" md="3" sm="4">
                <span>Telephone :</span> <b class="font-weight-black">{{ data.telephone }}</b>
              </VCol>
              <VCol cols="12" md="3" sm="4">
                <span>Ville :</span> <b class="font-weight-black">{{ data.ville }}</b>
              </VCol>
            </VRow>

            <VCardActions class="justify-space-between pa-5">
              <!--
                <VBtn
                variant="outlined"
                @click="isDialogVisible = true"
                >
                <VIcon icon="tabler-upload" />
                Upload Photo
                </VBtn>
              -->

              <VCol>
                <form enctype="multipart/form-data" class="class">

                  <VFileInput v-model="file" variant="filled" :rules="rules" accept="images/png, images/jpeg" label="Télécharger Photo" placeholder="Télécharger une photo" prepend-icon="tabler-camera" />
                </form>
              </VCol>
              <VBtn variant="outlined">
                <VIcon icon="tabler-upload" />
                Upload Photo
                <!-- @click="uploadPhoto" -->

              </VBtn>
            </VCardActions>
          </div>
        </div>
      </VCard>
      <VCard>
        <template v-if="isLoading  || isLoading && !data">
          <VSkeletonLoader v-for="i in 3" :key="i" type="list-item-two-line" height="99px" />
        </template>
        <template v-else-if="isClicked && !data ">
          <VAlert color="error" icon="tabler-ban" variant="outlined">
            Utilisateur introuvable
          </VAlert>
        </template>
      </VCard>
    </VCol>
  </VRow>
 </div>
</template>
<style lang="scss">


.layout-nav-type-vertical {
  &.layout-navbar-sticky {
    .sticky-header {
      inset-block: 4rem 0;
    }
  }

  &.layout-navbar-static {
    .sticky-header {
      inset-block: 0 0;
    }
  }
}

.layout-nav-type-horizontal {
  &.layout-navbar-static {
    .sticky-header {
      inset-block: 0 0;
    }
  }

  &.layout-navbar-sticky {
    .sticky-header {
      inset-block: 8.1rem 0;
    }
  }
}

.sticky-header {
  position: sticky;
  z-index: 999999999999;
  transition: all 0.3s ease-in-out;
}
 .custom-letter-spacing {
  letter-spacing: 5.8px;
  
}

</style>
<!-- <route lang="yaml">
meta:
  requiredAuth: true
</route> -->
