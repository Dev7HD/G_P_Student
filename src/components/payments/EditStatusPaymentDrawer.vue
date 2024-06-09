<script setup lang="ts">
import { Payment, PaymentStatus, PaymentType } from "@/@core/types";
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';



const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
  (e: 'onUpdate', val: Payment): void
  // (e: 'removeEvent', eventId: string): void
}>()

interface Props {
  isDrawerOpen: boolean
  editPayment?: Payment
}



const props = withDefaults(defineProps<Props>(), {
  editPayment: () => ({
    amount:null,
    date:null,
    status:PaymentStatus.CREATED,
    type:PaymentType.CASH,
    pdfUrl:null
  })
})


// 👉 store
// const store = useCalendarStore()
const refForm = ref<VForm>()


//👉 - methodes
const resolveStatusColor = (status: string) => {
  if (status === 'Confirmed')
    return { text: 'Confirmed', color: 'success', icon: 'tabler-check' }
  if (status === 'Completed')
    return { text: 'Completed', color: 'primary', icon: 'tabler-checks' }
  if (status === 'Cancelled')
    return { text: 'Cancelled', color: 'error', icon: 'tabler-ban' }
}

const paymentStatus = ref([PaymentStatus.CREATED,PaymentStatus.REJECTED,PaymentStatus.VALIDATED]);




const handleSubmit = () => {
  refForm.value?.validate()
    .then(({ valid }) => {
      if (valid) {
        
        emit('onUpdate',props.editPayment)
        emit('update:isDrawerOpen', false)
      

      }
    })
}


// 👉 Form

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
    <AppDrawerHeaderSection title="MODIFICATION OF THE PAYMENT'S STATUS "  @cancel="$emit('update:isDrawerOpen', false)">
     
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
                <AppSelect :items="paymentStatus" v-model="props.editPayment.status"
                  label="Status" placeholder="Active" color="secondary" chips />
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
