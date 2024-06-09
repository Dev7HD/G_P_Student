<script setup lang="ts">
interface Props {
  confirmationQuestion: string
  isDialogVisible: boolean
  title:string
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('confirm', true)
  updateModelValue(false)
}


</script>

<template>
  <!-- 👉 Confirm Dialog -->
 <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
      <DialogCloseBtn @click="updateModelValue(false)" />
   <VCard class="text-center ">
     <VCol class="d-flex justify-center align-center">
       <VIcon
          icon="tabler-alert-triangle"
          variant="outlined"
          color="error"
          
          style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
        >
          <span class="text-5xl"></span>
        </VIcon>
       <v-card-title class="text-h2 mt-5">
        {{props.title}}
      </v-card-title>
      
       
     </VCol>

        <VCardText class="text-h5 font-weight-medium  ">
          {{ props.confirmationQuestion }}
        </VCardText>

      <VCardText class="d-flex align-center justify-center gap-4 mt-4">
        <VBtn
          size="small"
          color="success"
          variant="elevated"
          @click="onConfirmation"
          append-icon="tabler-check"
        >
          Supprimer 
        </VBtn>

        <VBtn
         size="small"
          color="error"
          variant="tonal"
          @click="updateModelValue(false)"
          append-icon="tabler-ban"
        >
          Annuler
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
