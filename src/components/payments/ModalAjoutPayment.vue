<script lang="ts" setup>
import { Payment, PaymentType } from "@/@core/types";



interface Props{
  isDialogVisible:boolean
}

interface FileData {
  file: File
  url: string
}
interface Emit {
  (e:'update:isDialogVisible',value:boolean):void
  (e:'addPaiement',value:Payment):void
}


const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
const date = ref('')
const amount = ref('')
const type = ref<PaymentType>(PaymentType.CASH)
const file = ref([])
const urlImg = ref('')
const fileData = ref<FileData[]>([])

//👉 - Upload Photo methodes
const selectFile = () => {
    fileData.value[0] = {
      file: file.value[0],
      url: useObjectUrl(file.value[0]).value ?? '',
    }
    urlImg.value = fileData.value[0].url
    
}

const paymentTypes = ref([PaymentType.CASH,PaymentType.CHECK,PaymentType.DEPOSIT,PaymentType.TRANSFER])

const clear = () => {
  file.value = ''
}
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"   
     max-width="600"
     persistent
  >   
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <!-- Dialog Content -->
    <VCard title="Paiement ">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
          >
             <AppDateTimePicker
            v-model="date"
            label="Default"
            placeholder="Select date"
          />
          </VCol>
          <VCol
            cols="12"
          >
            <AppTextField
              v-model="amount"
              label="Montant"
              placeholder="Entrer le montant  du paiement"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VSelect
              v-model="type"
              :items="paymentTypes"
              label="Type du Paiement"

            />
          </VCol>
          <VCol
            cols="12"
          >
             <VFileInput
              v-model="file"
              @change="selectFile"
              color="primary"
              label="File input"
              variant="outlined"
              />
             
          </VCol>
          <VCol cols="12">
          <VImg
            height="275"
            width="419"
            :src="urlImg"
            class="mx-auto"
            />
          </VCol>
          <VCol cols="12">
              <!-- <VuePDF v-if="urlImg" :pdf="pdf" /> -->
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="()=>console.log('kdhghkjghkj')"
        >
          Close
        </VBtn>
        <VBtn @click="updateModelValue(false)">
          Save
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
