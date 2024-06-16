<script setup lang="ts">
import { Payment, PaymentStatus } from "@/@core/types";
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';



const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
  (e: 'onUpdate', val: Payment): void
}>()

interface Props {
  isDrawerOpen: boolean
  editPayment?: Payment
}



const props = withDefaults(defineProps<Props>(), {
  editPayment: () => ({
    amount:null,
    date:null,
    status:null,
    type:null,
    pdfUrl:null
  })
})


// 👉 store
// const store = useCalendarStore()
const refForm = ref<VForm>()


//👉 - methodes
const resolveStatusColor = (status: string) => {
  if (status === PaymentStatus.CREATED)
    return { text: 'CRÉÉ', color: 'primary', icon: 'tabler-check' }
  if (status === PaymentStatus.REJECTED)
    return { text: 'REJETÉE', color: 'error', icon: 'tabler-ban' }
  if (status === PaymentStatus.VALIDATED)
    return { text: 'VALIDE', color: 'error', icon: 'tabler-checks' }
}

const paymentStatus = ref([PaymentStatus.CREATED,PaymentStatus.REJECTED,PaymentStatus.VALIDATED]);


//const statut = ref(props.editPayment.status)
const statut = ref(props.editPayment.status)
const handleSubmit = () => {
  refForm.value?.validate()
    .then(({ valid }) => {
      if (valid) {
        props.editPayment.status = statut.value
        emit('onUpdate',props.editPayment)
        emit('update:isDrawerOpen', false)
      
        refForm.value?.reset()
      }
    })
}

watch(() => props.editPayment, () => {
  statut.value = props.editPayment.status 
})


const onCancel = () => {

  emit('update:isDrawerOpen', false)  
}


const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}




</script>

<template>
  <VNavigationDrawer temporary location="end" :model-value="props.isDrawerOpen" width="370" :border="0"
    class="scrollable-content" @update:model-value="dialogModelValueUpdate">
    <!-- 👉 Header -->
    <AppDrawerHeaderSection title="MODIFIER LE STATUT DU PAIEMENT"  @cancel="$emit('update:isDrawerOpen', false)">
     
    </AppDrawerHeaderSection>

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm ref="refForm" @submit.prevent="handleSubmit">
            <VRow>
              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect :items="paymentStatus" v-model="statut"
                  label="Statut" placeholder="Choisir un statut" color="info" chips :rules="[requiredValidator]"/>
              </VCol>


              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn block type="submit" class="mb-3 mt-6" variant="outlined" color="success" >
                  Confirmer
                </VBtn>
                <VBtn block color="error" @click="onCancel">
                  Annuler
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
          <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
