<script lang="ts" setup>

import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";

interface Props{
  isDialogVisible:boolean
  pdfUrl:string
}

interface FileData {
  file: File
  url: string
}

interface Emit {
  (e:'update:isDialogVisible',value:boolean):void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const urlImg = ref(structuredClone(toRaw(props.pdfUrl+'.pdf')))

console.log(props.pdfUrl);

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

watch(props, () => {
  urlImg.value = structuredClone(toRaw(props.pdfUrl))
})

</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"   
     max-width="800"
     persistent
  >   
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <!-- Dialog Content -->
    <VCard title="Le PDF de votre Paiement.">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <vue-pdf-app v-if="props.pdfUrl"  style="height: 100vh;" :pdf="props.pdfUrl"></vue-pdf-app>
          </VCol>
     
        </VRow>
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="error"
          @click="updateModelValue(false)"

        >
         Fermer        
        </VBtn>
      
      </VCardText>
    </VCard>
  </VDialog>
</template>
