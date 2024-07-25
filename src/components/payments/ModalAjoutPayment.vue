<script lang="ts" setup>
import { PaymentType } from "@/@core/types";

import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";
import { VForm } from "vuetify/components/VForm";

interface Props {
  isDialogVisible: boolean;
  code: string;
}

interface FileData {
  file: File;
  url: string;
}

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "addPaiement", value: object): void;
}

const props = defineProps<Props>();
const refForm = ref<VForm>();

const emit = defineEmits<Emit>();

const updateModelValue = (val: boolean) => {
  emit("update:isDialogVisible", val);
};

const date = ref("");
const amount = ref("");
const type = ref<PaymentType>(PaymentType.CASH);
const file = ref([]);
const urlImg = ref("");
const fileData = ref<FileData[]>([]);

//👉 - Upload Photo methodes
const selectFile = (e) => {
  fileData.value[0] = {
    file: file.value[0],
    url: useObjectUrl(file.value[0]).value ?? "",
  };
  urlImg.value = fileData.value[0].url;
};

const paymentTypes = ref([
  PaymentType.CASH,
  PaymentType.CHECK,
  PaymentType.DEPOSIT,
  PaymentType.TRANSFER,
]);

const addPayment = () => {
 

refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      const form = new FormData();
      console.log(file.value[0]);
      form.append("studentCode", props.code);
      form.append("amount", amount.value);
      form.append("paymentType", type.value);
      form.append("date", date.value);
      form.append("file", file.value[0]);
      emit("addPaiement", form);
      date.value = ''
      amount.value = ''
      type.value = PaymentType.CHECK
      urlImg.value=''
     file.value=[]

      updateModelValue(false);
    }
  });
};

// const clear = () => {
//   file.value = ''
// }
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
    <VCard title="Paiement">
      <v-form ref="refForm" @submit.prevent="addPayment" enctype="multipart/form-data">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppDateTimePicker
                v-model="date"
                label="Date de Paiement"
                placeholder="Select date"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <AppTextField
                v-model="amount"
                label="Montant"
                placeholder="Entrer le montant  du paiement"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                v-model="type"
                :items="paymentTypes"
                label="Type du Paiement"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <VFileInput
                v-model="file"
                @change="selectFile"
                accept="application/pdf"
                color="primary"
                label="File input"
                variant="outlined"
                :rules="[requiredValidator]"
              />
            </VCol>
            <!-- <VCol cols="12">
          <VImg
            height="275"
            width="419"
            :src="urlImg"
            class="mx-auto"
            />
          </VCol> -->
            <VCol cols="12">
              <!-- <VuePDF v-if="urlImg" :pdf="pdf" /> -->
              <vue-pdf-app
              isSidebarHidden=true
                v-if="urlImg"
                style="height: 30vh"
                :pdf="urlImg"
              ></vue-pdf-app>
            </VCol>
          </VRow>
        </VCardText>
     
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="outlined" color="error" @click="updateModelValue(false)">
          Annuler
        </VBtn>
        <VBtn color="success" type="submit"> Ajouter </VBtn>
      </VCardText>
    </v-form>
    </VCard>
  </VDialog>
</template>
