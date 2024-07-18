<script setup lang="ts">
import { Payment, Student } from "@/@core/types";
import { usePaymentStore } from '@/store/usePaymentStore';
import dayjs from 'dayjs';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import * as XLSX from 'xlsx';

//👉 - Variables

const search = ref('')

//👉 - Instance of our Store
const store = usePaymentStore()
const { listePayments, isLoading,error } = storeToRefs(store)
const { fetchAll,editStatusPayment } = store

const sortByDate = () => {
  paymentsList.value.sort((a, b) => {
    return dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1;
  });
}

//👉 -  Options Pagination
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [false],
})
const paginationItems = ref([5, 10, 15, 50])
const handleChange = () => {
  // j'ai utiliser cette fonction pour rénitialiser affichage après tout filtre
  options.value.page = 1
}

//👉 - Dialogs variables
const studentData = ref<Student>({})
const isEditStatusDialogVisible = ref(false)

//👉 - Data table options
const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const headers = [
  { title: 'Nom Complet', key: 'nom_prenom' },
  { title: 'Date Payment', key: 'date' },
  { title: 'montant', key: 'amount' },
  { title: 'Statut', key: 'status' },
  { title: 'type', key: 'type' },
  { title: 'actions', key: 'actions' },
]
//👉 - Methode for Resolving a Status
const resolveStatus = (status: string) => {
  if (status === 'CREATED')
    return { text: 'Créé', color: 'primary', icon: 'tabler-check' }
  else if (status === 'VALIDATED')
    return { text: 'Valide', color: 'success', icon: 'tabler-checks' }
  else if (status === 'REJECTED')
    return { text: 'Rejeté', color: 'error', icon: 'tabler-ban' }
  return { text: 'Pending', color: 'warning', icon: 'tabler-dots' }
}

const resolveType = (type: string) => {
  if (type === 'CHECK')
    return { text: 'CHECK', color: 'info', icon: 'tabler-check' }
  else if (type === 'TRANSFER')
    return { text: 'TRANSFER', color: 'primary', icon: 'tabler-checks' }
  else if (type === 'CASH')
    return { text: 'CASH', color: 'light', icon: 'tabler-checks' }
  return { text: 'DEPOSIT', color: 'warning', icon: 'tabler-ban' }
}

const isEditDialogVisible = ref(false)


const editPayment = ref<Payment>({})
//👉 - Methode for modifying an item
const editStatus = (item) => {
  editPayment.value = item
  isEditStatusDialogVisible.value = true
}


//👉 - Methode for handling format of the date naissance 
const getDateNaissance = (date: Date) => {
  const customFormatDate = dayjs(date).format('YYYY - MM - DD');
  return customFormatDate
}

//👉 - Methode for getInitials of any fullname
const getAvatarText = (prenom: string, nom: string) => {
  const prenomInitial = prenom.charAt(0);
  const nomInitial = nom.charAt(0);
  const initials = (prenomInitial + nomInitial).toUpperCase();
  return initials;
}



//👉 - Methode for export data to Excell
const exportToExcell = () => {
  const worksheet = XLSX.utils.json_to_sheet(paymentsList.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Liste_Des_Payments');
  XLSX.writeFile(workbook, 'liste_globale_payments.xlsx');
}

const paymentsList = ref([])
const loading = ref(false) 
const GetData = () => {
  paymentsList.value = listePayments.value.map(item => {
    return {
      ...item,
      nom_prenom: `${item.student.lastName} ${item.student.firstName}`,
    }
  })
}
const updateStatus =  (editPayment)=>{

  console.table(editPayment)
  editStatusPayment(editPayment.id,editPayment.status)
    .then(()=>{
    toast.success("Le statut est mis à jour !.", {
        autoClose: 2000,position:"top-center"
      }); 
  })
  

}

onMounted(() => {
      loading.value = true
      fetchAll().then((res)=>{
        setTimeout(() => {
          GetData()
          sortByDate()
          loading.value = false
        }, 1000);
      })
})
</script>


<template>

  <VCard no-padding>
    <VCardTitle class="pt-9 pl-10 text-h5 "> <span class="letter-spacing font-weight-bold">LISTE DES PAIEMENTS
      </span></VCardTitle>
    <div>

      <!-- 👉 Filters -->
      <VCardText>
        <div class="demo-space-x d-flex justify-space-between">
          <VCol cols="12" md="6">
            <VTextField density="comfortable" label="Recherche Multicritère" variant="filled"
              prepend-inner-icon="tabler-search" v-model="search"
              placeholder="Chercher par Etudiant, Type, Montant et Statut" />
          </VCol>
        </div>
      </VCardText>



      <div v-if="!listePayments" class="text-center">
        <VProgressLinear color="primary" indeterminate height="2" />
      </div>
      <!-- 👉 Data Table  -->
      <div v-else>
        <div v-if="listePayments.length > 0">
          <VDataTable :loading="loading"  :headers="headers" :items="paymentsList" :search="search"
            v-model:options="options" :items-per-page="options.itemsPerPage" :page="options.page" class="text-no-wrap">

           

            <template #loading>
                <VSkeletonLoader v-for="i in 10" :key="i" type="table-row-divider" />
 
            </template>

            <template #item.nom_prenom="{ item }">
              <div class="d-flex align-center gap-x-3">
                <VAvatar variant="outlined" color="primary" size="40">{{ getAvatarText(item.student.lastName, item.student.firstName) }}
                </VAvatar>
                <span>{{ item.student.lastName }} {{ item.student.firstName }}</span>
              </div>
            </template>

            <template #item.status="{ item }">
              <VChip variant="outlined" size="small" :color="resolveStatus(item.status)?.color">
                <b class="text-uppercase"> {{ resolveStatus(item.status)?.text }}</b>
                <VIcon size="x-small" end :icon="resolveStatus(item.status)?.icon" /> 
              </VChip>
            </template>


            <template #item.type="{ item }">
              <VChip :label="false" size="small" :color="resolveType(item?.type)?.color">
                <b class="text-uppercase"> {{ resolveType(item?.type)?.text }}</b>
              </VChip>
            </template>

            <template #item.amount="{item}">
               {{ item.amount }}<span class="font-weight-bold"> DH </span>
            </template>
            <!-- ACTIONS -->
            <template #item.actions="{ item }">
              <IconBtn class="me-2 " @click="editStatus(item)">
                <VIcon color="secondary" icon="tabler-edit
                " />
                <VTooltip
                      open-on-focus
                      location="top"
                      activator="parent"
                    >
                      Modifier le statut.
                </VTooltip>
              </IconBtn>
            </template>

            <template #bottom>
              <VCardText v-if="listePayments" class="pt-2">
                <div class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 mt-2">
                  <VSelect v-model="options.itemsPerPage" :items="paginationItems"
                    style="max-inline-size: 8rem;min-inline-size: 5rem;  font-size: 95px;" label="Lignes par page :"
                    variant="filled" @update:model-value="handleChange" />

                  <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 4"
                    :length="Math.ceil(listePayments.length / options.itemsPerPage)" rounded="circle"
                    active-color="primary" />
                </div>
              </VCardText>
            </template>
          </VDataTable>
        </div>
        <div v-else>
          <VSkeletonLoader v-for="i in 10" :key="i" type="table-row-divider" />
        </div>
      </div>

    </div>
  </VCard>

<EditStatusPaymentDrawer :edit-payment="editPayment" v-model:isDrawerOpen="isEditStatusDialogVisible"
    @on-update="updateStatus" />
  

</template>


<style lang="scss">
* {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important;
}

.v-table>.v-table__wrapper>table>tbody>tr>th,
.v-table>.v-table__wrapper>table>thead>tr>th,
.v-table>.v-table__wrapper>table>tfoot>tr>th {
  font-weight: bolder !important;
  letter-spacing: 1.5px;
}

.v-table>.v-table__wrapper>table>tbody>tr>td {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.v-table {
  padding: 30px;
}

.v-data-table__td {
  font-size: small;
  font-family: "Open Sans", "Helvetica Neue", sans-serif;
}

.v-chip .v-chip__content .v-icon {
  block-size: 16px;
}

.v-chip:not(.v-chip--pill).v-chip--size-small {
  --v-chip-height: 23px;
  font-size: 10px;
}

.letter-spacing {
  letter-spacing: 2px;
  word-spacing: 2px;
}
</style>
