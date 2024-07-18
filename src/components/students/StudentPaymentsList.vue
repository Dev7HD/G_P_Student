

<script setup lang="ts">
import { Student } from "@/@core/types";
import axiosIns from "@/plugins/axiosIns";
import { useStudentStore } from '@/store/useStudentStore';
import dayjs from 'dayjs';
import "vue3-pdf-app/dist/icons/main.css";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
//👉 - Variables
const search = ref('')

//👉 - Instance of our Store
const store = useStudentStore()
const { listeStudentPayments, isLoading } = storeToRefs(store)
const { fetchStudentPayments , addPayment,fetchOne } = store
const isPdfDialogVisible = ref(false)


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
const route= useRoute()
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const headers = [
  { title: 'Date de Payment', key: 'date' },
  { title: 'Statut', key: 'status' },
  { title: 'Montant', key: 'amount' },
  { title: 'type', key: 'type' },
  { title: 'pdfUrl', key: 'receipt' },
]

//👉 - Methode for Resolving a Status
const resolveStatus = (status: string) => {
  if (status === 'CREATED')
    return { text: 'Créé', color: 'success', icon: 'tabler-check' }
  else if (status === 'VALIDATED')
    return { text: 'Valide', color: 'primary', icon: 'tabler-checks' }
  else 
    return { text: 'Rejetée', color: 'error', icon: 'tabler-ban' }

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


const isDialogVisible  = ref(false);

//👉 - Methode for export data to Excell
const showModalAjout = () => {
  isDialogVisible.value = true 
}

const studentsList = ref([])
const loading = ref(false) 
const GetData = () => {  
  studentsList.value = listeStudentPayments.value.map(item => {    
    return {
      ...item,
      pdfUrl: `${item.receipt}`
    }
  })
}

// watch(studentsList,(val)=>sortByDate())

const sortByDate = () => {
  studentsList.value.sort((a, b) => {
    return dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1;
  });
}


const addPaiement = async(obj)=>{    
      try {
        const response = await axiosIns.post(`/payments/new`, obj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fetchStudentPayments("11223344").then((res)=>{
        setTimeout(() => {
          GetData()
          sortByDate()
          loading.value = false
        }, 1000)
      })
        console.log('Response:', response.data);
        toast.success("Votre paiement est ajouté !", {
        autoClose: 1000,position:"top-center"
      }); 
      } catch (error) {
        console.error('Error:', error);
      }
    }


const pdfUrl = ref(null)
const currentStudent = ref<Student>({})

const showPdf =async (payment)=>{
  let blobUrl ,  data 
  useStudentStore().getPdfFile(payment.id).then(response=>{
        const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        pdfUrl.value = url
        isPdfDialogVisible.value = true
  })
}

onMounted(() => {
      fetchOne('11223344').then(res=>  currentStudent.value = (res.data.value)
      )
      loading.value = true
      fetchStudentPayments('11223344').then((res)=>{
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
    <VCardTitle  class="pt-9 pl-10 text-h5 "> <span class="letter-spacing font-weight-bold">Données de l' Etudiant : <span>
      <VAvatar
          size="34"
          icon="tabler-user"
          color="primary"
        />
        <span class="text-white ms-2 text-primary text-underline text-uppercase mb-5">{{ currentStudent.lastName }}  {{ currentStudent.firstName }} </span>
    </span>
      </span>
    <StudentDetails v-if="currentStudent"  :student="currentStudent"/>
    <div v-else>
          <VSkeletonLoader v-for="i in 2" :key="i" type="card-avatar" />
        </div>
    </VCardTitle>
   
    <div>

      <!-- 👉 Filters -->
      <VCardText>
        <div class="demo-space-x d-flex justify-space-between">
          <VCol cols="12" md="6">
            <VTextField density="comfortable" label="Recherche Multicritère" variant="filled"
              prepend-inner-icon="tabler-search" v-model="search"
              placeholder="Chercher par Date de paiement, Statut, Type et Montant." />
          </VCol>

          <div>
            <VBtn  class="mr-3" color="primary" prepend-icon="tabler-new-section" text="Nouveau Paiement"
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
          <VDataTable   
          
          :loading="loading"  :headers="headers" :items="studentsList" :search="search"
            v-model:options="options" :items-per-page="options.itemsPerPage" :page="options.page" class="text-no-wrap"
            >

           

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
            <template #item.type="{ item }">
              <VChip :label="false" size="small" :color="resolveType(item.type)?.color">
                <b class="text-uppercase"> {{ resolveType(item.type)?.text }}</b>
              </VChip>
            </template>
            <template #item.receipt="{item}">
                <VBtn
                  variant="outlined"
                  color="info"
                  prepend-icon="tabler-stereo-glasses"
                  size="small"
                  @click="showPdf(item)"
                >
                 Pdf
                </VBtn>                
                <VTooltip
                      open-on-focus
                      location="top"
                      activator="parent"
                    >
                    Afficher le reçu de paiement.
                </VTooltip>
            </template>

            <template #item.status="{ item }">
              <VChip variant="outlined" size="small" :color="resolveStatus(item.status)?.color">
                <b class="text-uppercase"> {{ resolveStatus(item.status)?.text }}</b>
                <VIcon size="x-small" end :icon="resolveStatus(item.status)?.icon" /> 
              </VChip>
            </template>
           
            <template #item.amount="{item}">
               {{ item.amount }}<span class="font-weight-bold"> DH </span>
            </template>
           
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
        <div class="pa-5"v-else>
          <VAlert
            title="Information"
            color="warning"
            type="info"
            prominent
            text="Aucune Paiement disponible... , Cliquer sur le bouton Nouvelle Paiement pour l'ajouter"
          />        
        </div>
      </div>
    </div>
  </VCard>
  <ModalAjoutPayment :code="'11223344'" v-model:is-dialog-visible="isDialogVisible" @add-paiement="addPaiement"/>
  <ModalPdf v-if="isPdfDialogVisible"  v-model:is-dialog-visible="isPdfDialogVisible" :pdf-url="pdfUrl"/>
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


