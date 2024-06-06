

<script setup lang="ts">
import { Student } from "@/@core/types";
// import EditDialog from "@/components/Verifications/Dialogs/EditDialog.vue";
import { useStudentStore } from '@/store/useStudentStore';
import dayjs from 'dayjs';
// import * as XLSX from 'xlsx';

//👉 - Variables
// const props = defineProps(['verificationsList', 'isLoading'])
const search = ref('')


//👉 - Instance of our Store
const store = useStudentStore()
const { listeStudentPayments, isLoading } = storeToRefs(store)
const { fetchStudentPayments } = store



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
const isCarteInfoEditDialogVisible = ref(false)
const isCarteInfoViewDialogVisible = ref(false)

//👉 - Methode for handling a verification type
const resolveStatusVerification = (idVerification: number) => {
  if (idVerification === null)
    return { text: 'Non Verifiée', color: 'error', icon: 'tabler-ban' }
  else
    return { text: 'Verifiée', color: 'success', icon: 'tabler-check' }
}

//👉 - Data table options
const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const headers = [
  { title: 'Date Payment', key: 'date' },
  // { title: 'الاسم و اللقب', key: 'nomAr_prenomAr' },
  { title: 'Amount', key: 'amount' },
  { title: 'type', key: 'type' },
  { title: 'pdfUrl', key: 'pdfUrl' },
]

//👉 - Computed Functions
// const totalOrder = computed(() => props.verificationsList.length)



// SECTION METHODES
//👉 - Methode for deleting an Item 
const deleteItem = (itemId: number) => {
  if (!props.verificationsList)
    return

  console.log(itemId);

}

//👉 - Methode for Resolving a Status
const resolveStatus = (status: string) => {
  if (status === 'Confirmed')
    return { text: 'Confirmed', color: 'success', icon: 'tabler-check' }
  else if (status === 'Completed')
    return { text: 'Completed', color: 'primary', icon: 'tabler-checks' }
  else if (status === 'Cancelled')
    return { text: 'Cancelled', color: 'error', icon: 'tabler-ban' }
  return { text: 'Pending', color: 'warning', icon: 'tabler-dots' }

}


//👉 - Methode for showing a student
const showItem = (item: Student) => {
  console.table(item);
  
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

//👉 - Methode for handling onUpdate carte Event
const updateCarte = (item: Carte) => {
  carteData.value = item
}


//👉 - Methode for adding a verification to datatable
const router = useRouter()
const addVerification = () => {
  router.push('/new-verification')
}

const isDialogVisible  = ref(false);

//👉 - Methode for export data to Excell
const showModalAjout = () => {
  isDialogVisible.value = true 
}


// const isLoaded = computed(() => listeStudentPayments.value.length === 0)
// const isLoaded = ref(listeStudentPayments.value)

//👉 - Providing CarteList to DataTable
const studentsList = ref([])
const loading = ref(false) 
const GetData = () => {
  studentsList.value = listeStudentPayments.value.map(item => {    
    return {
      ...item,
      pdfUrl: `${item.receipt}`,
    }
  })

}
const route = useRoute()

onMounted(() => {
 
      loading.value = true
      fetchStudentPayments(route.params.code).then((res)=>{
        setTimeout(() => {
          GetData()
          loading.value = false
        }, 1000);
      })
      
 
})
</script>


<template>

<!-- <v-btn color="success" @click="isConfirmDialogVisible=true">text</v-btn>
<v-btn color="success" @click="isErrorDialogVisible=true">error</v-btn>

  <ConfirmationDialog  
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Voulez-vous vraiment sauvegarder ces modifications ?" 
      title="Confirmation " 
      @confirm="console.log('iklikj')"/>

 <ErrorDialog  
      v-model:isDialogVisible="isErrorDialogVisible"
      error-msg ="Aucune Personne Identifiée avec ce cni => " 
      title="CNIE Introuvable." 
      @confirm="console.log('ok')"/> -->


  <VCard no-padding>
    <VCardTitle class="pt-9 pl-10 text-h5 "> <span class="letter-spacing font-weight-bold">Données de l' Etudiant code : {{ route.params.code  }}
      </span></VCardTitle>
    <div>

      <!-- 👉 Filters -->
      <VCardText>
        <div class="demo-space-x d-flex justify-space-between">
          <VCol cols="12" md="5">
            <VTextField density="comfortable" label="Recherche Multicritère" variant="filled"
              prepend-inner-icon="tabler-search" v-model="search"
              placeholder="Recherchez par cni, matricule, status..." />
          </VCol>

          <div>
            <VBtn variant="tonal" class="mr-3" color="secondary" prepend-icon="tabler-circle-plus" text="Nouveau Paiement"
              @click="showModalAjout" />
          </div>
        </div>
      </VCardText>



      <div v-if="!listeStudentPayments" class="text-center">
        <VProgressLinear color="primary" indeterminate height="2" />
      </div>
      <!-- 👉 Data Table  -->
      <div v-else>
        <div v-if="listeStudentPayments.length > 0">
          <VDataTable :loading="loading"  :headers="headers" :items="studentsList" :search="search"
            v-model:options="options" :items-per-page="options.itemsPerPage" :page="options.page" class="text-no-wrap">

           

            <template #loading>
                <VSkeletonLoader v-for="i in 10" :key="i" type="table-row-divider" />
 
            </template>

            <template #item.nom_prenom="{ item }">
              <div class="d-flex align-center gap-x-3">
                <VAvatar variant="tonal" color="secondary" size="40">{{ getAvatarText(item.lastName, item.firstName) }}
                </VAvatar>
                <span>{{ item.lastName }} {{ item.firstName }}</span>
              </div>
            </template>

            <template #item.date="{ item }">
              <span>{{ getDateNaissance(item?.date) }}</span>
            </template>

            <!-- <template #item.status="{ item }">
              <VChip size="small" :color="resolveStatus(item.status)?.color">
                <VIcon size="x-small" start :icon="resolveStatus(item.status)?.icon" /> 
                <b class="text-uppercase"> {{ resolveStatus(item.status)?.text }}</b>
              </VChip>
            </template> -->
<!-- 
            <template #item.id_verification="{ item }">
              <VChip size="small" :color="resolveStatusVerification(item.id_verification)?.color">
                <VIcon size="x-small" start :icon="resolveStatusVerification(item.id_verification)?.icon" />
                <b class="text-uppercase"> {{ resolveStatusVerification(item.id_verification)?.text }}</b>
              </VChip>
            </template> -->

            <!-- ACTIONS -->
            <template #item.actions="{ item }">
               <RouterLink
               
                  :to="{ name: 'students-view-code', params: { code: item.code } }"
                  class="font-weight-medium me-2"
                  style="line-height: 1.375rem;"
                >
                <VIcon color="secondary" icon="tabler-eye" />
                </RouterLink>
             
             <!-- <IconBtn @click="editItem(item)">
                <VIcon color="primary" icon="tabler-edit" />
              </IconBtn>
-->              <!-- <IconBtn @click="deleteItem(item.cni)">
            <VIcon color="error" icon="tabler-trash" />
          </IconBtn> -->
            </template>



            <!-- pagination -->

            <template #bottom>
              <VCardText v-if="listeStudentPayments" class="pt-2">
                <div class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 mt-2">
                  <VSelect v-model="options.itemsPerPage" :items="paginationItems"
                    style="max-inline-size: 8rem;min-inline-size: 5rem;  font-size: 95px;" label="Lignes par page :"
                    variant="filled" @update:model-value="handleChange" />
                  <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 4"
                    :length="Math.ceil(listeStudentPayments.length / options.itemsPerPage)" rounded="circle"
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
  <ModalAjoutPayment v-model:is-dialog-visible="isDialogVisible" @add-paiement="(obj)=>console.table(obj)"/>

  <!-- <EditDialog :carte-data="carteData" v-model:is-dialog-visible="isCarteInfoEditDialogVisible"/>
 -->

  <!-- <ViewDialog :carte-data="carteData" v-model:is-dialog-visible="isCarteInfoViewDialogVisible" />

  <EditDialogDrawer :carte-data="carteData" v-model:isDrawerOpen="isCarteInfoEditDialogVisible"
    @on-update="updateCarte" /> -->

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
  // font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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

<!-- <script setup lang="ts">
const route = useRoute()
</script> -->
