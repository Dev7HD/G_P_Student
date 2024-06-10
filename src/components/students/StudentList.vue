<script setup lang="ts">
import { Student } from "@/@core/types";
import { useStudentStore } from '@/store/useStudentStore';
import axios from "axios";
import dayjs from 'dayjs';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import * as XLSX from 'xlsx';


//👉 - Variables
// const props = defineProps(['verificationsList', 'isLoading'])
const search = ref('')
const route = useRoute()
//👉 - Instance of our Store
const store = useStudentStore()
const { listeStudents, isLoading } = storeToRefs(store)
const { fetchAll,updateOne,deleteOne } = store



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
const isAjoutEtudiantDialogVisible = ref(false)
const isDeleteDialogVisible = ref(false)



//👉 - Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const headers = [
  { title: 'Code', key: 'code' },
  { title: 'Nom Complet', key: 'nom_prenom' },
  // { title: 'الاسم و اللقب', key: 'nomAr_prenomAr' },

  { title: 'Filière', key: 'programId' },
  { title: 'Email', key: 'email' },
  { title: 'ACTIONS', key: 'actions', sortable: false },
]

//👉 - Computed Functions
// const totalOrder = computed(() => props.verificationsList.length)


const isEditStudentDialogVisible = ref(false)
const editStudent = ref<Student>({})

const editerStudent = (item)=>{
  editStudent.value = item
  isEditStudentDialogVisible.value = true
}

const codeDelete = ref('')
const deleteStudentModal = (code:string)=>{
  codeDelete.value = code
  isDeleteDialogVisible.value = true
}

const deleteStudent = (code:string)=>{
  deleteOne(code).then(()=>{
    fetchAll().then((res) => {
      setTimeout(() => {
        GetData()
        loading.value = false
      }, 1000)
    })
  }).then(()=>{
      toast.warning("Your Student is DELETED !", {
        autoClose: 2000,position:"top-center"
      }); 
  })
}

const updateStudent = (editStudent)=>{
  updateOne(editStudent).then(()=>{
    
      toast.info("Your Student is Updated !", {
        autoClose: 1000,position:"top-center"
      }); 
  })
}

// SECTION METHODES
//👉 - Methode for deleting an Item 


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


const resolveProgramId = (programId: string) => {
  if (programId === 'ISI')
    return { text: 'ISI', color: 'info' }
  else if (programId === 'GI')
    return { text: 'GI', color: 'success' }
  else if (programId === 'MF')
    return { text: 'MF', color: 'error' }
  return { text: 'IIR', color: 'warning' }

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


//👉 - Methode for export data to Excell
const exportToExcell = () => {
  const worksheet = XLSX.utils.json_to_sheet(studentsList.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Liste_Des_Students');
  XLSX.writeFile(workbook, 'liste_globale_students.xlsx');
}


// const isLoaded = computed(() => listeStudents.value.length === 0)
// const isLoaded = ref(listeStudents.value)

//👉 - Providing CarteList to DataTable
const studentsList = ref([])
const loading = ref(false)
const GetData = () => {
  studentsList.value = listeStudents.value.map(item => {
    return {
      ...item,
      nom_prenom: `${item.lastName} ${item.firstName}`,
    }
  })

}
const addEtudiant = async (etudiant) => {
  console.log(etudiant);
  await axios.post(`${import.meta.env.VITE_SPRING_BOOT_API_URL}/students/new`,

    {
      firstName: etudiant.firstName,
      lastName: etudiant.lastName,
      email: etudiant.email,
      code: etudiant.code,
      programId: etudiant.programId
    }

  ).catch((err)=>{
     toast.error(err.message, {
        autoClose: 2000,position:"top-center"
      }); 
  })


  fetchAll().then((res) => {
    setTimeout(() => {
      GetData()
      loading.value = false
    }, 1000)
  }).then(()=>{
    toast.success("Your Student is Added !", {
        autoClose: 2000,position:"top-center"
      }); 
  })

}

onMounted(() => {

  loading.value = true
  fetchAll().then((res) => {
    setTimeout(() => {
      GetData()
      loading.value = false
    }, 1000);
  })


})
</script>


<template>

  <VCard no-padding>
    <VCardTitle class="pt-9 pl-10 text-h5 "> <span class="letter-spacing font-weight-bold">LISTE DES ETUDIANTS
      </span></VCardTitle>
    <div>

      <!-- 👉 Filters -->
      <VCardText>
        <div class="demo-space-x d-flex justify-space-between">
          <VCol cols="12" md="5">
            <VTextField density="comfortable" label="Recherche Multicritère" variant="filled" prepend-inner-icon="tabler-search" v-model="search" placeholder="Recherchez par nom complet, filière, email." />
          </VCol>

          <div>
            <VBtn variant="tonal" class="mr-3" color="secondary" prepend-icon="tabler-upload" text="Exporter" @click="exportToExcell" />
            <VBtn variant="flat" color="primary" @click="isAjoutEtudiantDialogVisible=true">
              <v-icon icon="tabler-new-section" size="20" start> </v-icon>Nouvelle étudiant
            </VBtn>
          </div>
        </div>
      </VCardText>

      <div v-if="!listeStudents" class="text-center">
        <VProgressLinear color="primary" indeterminate height="2" />
      </div>
      <!-- 👉 Data Table  -->
      <div v-else>
        <div v-if="listeStudents.length > 0">
          <VDataTable :loading="loading" :headers="headers" :items="studentsList" :search="search" v-model:options="options" :items-per-page="options.itemsPerPage" :page="options.page" class="text-no-wrap">

            <template #loading>
              <VSkeletonLoader v-for="i in 10" :key="i" type="table-row-divider" />

            </template>

            <template #item.nom_prenom="{ item }">
              <div class="d-flex align-center gap-x-3">
                <VAvatar variant="outlined" color="primary" size="40">{{ getAvatarText(item.lastName, item.firstName) }}
                </VAvatar>
                <span>{{ item.lastName.toUpperCase() }} {{ item.firstName.toUpperCase() }}</span>
              </div>
            </template>

          

            <template #item.programId="{ item }">
              <VChip size="small" :color="resolveProgramId(item.programId)?.color">
                <b class="text-uppercase"> {{ resolveProgramId(item.programId)?.text }}</b>
              </VChip>
            </template>
           

            <!-- ACTIONS -->
            <template #item.actions="{ item }">

              <RouterLink :to="{ name: 'students-view-code', params: { code: item.code } }" class="font-weight-medium " style="line-height: 1.375rem;">

                <IconBtn>
                  <VIcon color="secondary" icon="tabler-eye" />
                </IconBtn>

              </RouterLink>
              <IconBtn  @click="editerStudent(item)">
                <VIcon  color="primary" icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="deleteStudentModal(item.code)">
               <VIcon color="error" icon="tabler-trash" />
          </IconBtn>
            </template>

            <!-- pagination -->

            <template #bottom>
              <VCardText v-if="listeStudents" class="pt-2">
                <div class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 mt-2">
                  <VSelect v-model="options.itemsPerPage" :items="paginationItems" style="max-inline-size: 8rem;min-inline-size: 5rem;  font-size: 95px;" label="Lignes par page :" variant="filled" @update:model-value="handleChange" />

                  <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 4" :length="Math.ceil(listeStudents.length / options.itemsPerPage)" rounded="circle" active-color="primary" />
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

  <ModalAjouteEtudiant v-model:is-dialog-visible="isAjoutEtudiantDialogVisible" @add-etudiant="addEtudiant" />
 

  <EditStudentDrawer :edit-student="editStudent" v-model:isDrawerOpen="isEditStudentDialogVisible"
    @on-update="updateStudent" />

  <DeleteConfirmation :code-delete="codeDelete" v-model:is-dialog-visible="isDeleteDialogVisible"  confirmation-question="Vouler vous vraiment supprimer l'Etudiant ? " title="SUPPRESSION" @confirm="deleteStudent"/>

</template>


<style lang="scss">
* {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important;
}

.v-table > .v-table__wrapper > table > tbody > tr > th,
.v-table > .v-table__wrapper > table > thead > tr > th,
.v-table > .v-table__wrapper > table > tfoot > tr > th {
  font-weight: bolder !important;
  letter-spacing: 1.5px;
  // font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
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
