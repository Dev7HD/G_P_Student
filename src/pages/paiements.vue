<!-- <template>

 <DataProvider #="{data,loading}">
   <VCard class="mb-6 w-100 sticky-header overflow-hidden rounded-t" title="Kick start your project 🚀">
    <div class="d-flex align-center gap-4 flex-wrap bg-background pa-6">
      <div  v-if="!loading">
        <div v-if="data">
          <div v-if="data.length>0">
            {{ data }}
          </div>
          <div v-else>No data found here</div> 
        </div>
        <div v-else>
          Something went wrong 
        </div>
      </div>
      <div v-else>
        Loading .......
      </div>
    </div>
  </VCard>
 </DataProvider>

</template>

<script setup lang="ts">
import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://weatherapi-com.p.rapidapi.com/current.json',
  params: {q: '53.1,-0.13'},
  headers: {
    'X-RapidAPI-Key': '6b4620f8c8msh7ea7c0ce6ec5fddp1cd442jsnf2097493c24c',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}

const res = await $api('', {
      method: 'GET',
      headers:{
         'X-RapidAPI-Key': '6b4620f8c8msh7ea7c0ce6ec5fddp1cd442jsnf2097493c24c',
         'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      },
      params: {q: '53.1,-0.13'},
      onResponseError({ response }) {
        console.log(response);
        
      }
    })
    console.log(res);
const isLoading = ref(false)






const fetchResults = async () => {
  isLoading.value = true

  const { data } = await useApi('http://localhost:9099/students/all')
  console.log(data.value);


   

  // ℹ️ simulate loading: we have used setTimeout for better user experience your can remove it
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
fetchResults()
// watch(searchQuery, fetchResults)





</script>
<!-- <script setup lang="ts">
import axios from 'axios';
const loading = ref(false)
const data = ref(null)

const fetchData = async () => {
     loading.value = true
    try {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
      data.value=res.data
    } catch (error) {
      console.log(error);
      
    }
     loading.value = false
}
onMounted(() => {
  fetchData()
})

// console.log(0);

// Promise.resolve().then(()=>console.log(1))
// setTimeout(() => {
//   console.log(2);
// }, 0);
// queueMicrotask(()=>{
//   console.log(3);
//   queueMicrotask(()=>console.log(4)
//   )
// })
// console.log(5);
</script> -->

<!-- <style lang="scss">
.sticky-header {
  position: sticky;
  z-index: -8;
  transition: all 0.3s ease-in-out;
}

.layout-nav-type-vertical {
  &.layout-navbar-sticky {
    .sticky-header {
      inset-block: 4rem 0;
    }
  }

  &.layout-navbar-static {
    .sticky-header {
      inset-block: 0 0;
    }
  }
}

.layout-nav-type-horizontal {
  &.layout-navbar-static {
    .sticky-header {
      inset-block: 0 0;
    }
  }

  &.layout-navbar-sticky {
    .sticky-header {
      inset-block: 8.1rem 0;
    }
  }
}
</style> -->
<script setup lang="ts">
// import type { SalesDetails } from '@db/pages/datatable/types';
import axios from 'axios';

// const { data: productList, error } = await useApi<SalesDetails[]>('pages/datatable')
const { data, isFetching, error } = await useApi('http://localhost:9099/payments/all')
const search = ref('')

// headers
const headers = [
  { title: 'amount', key: 'amount' },
  { title: 'type', key: 'type' },
  { title: 'date', key: 'date' },
  { title: 'status', key: 'status' },
  // { title: 'STATUS', key: 'status' },
  { title: 'Actions', key: 'hamza', sortable: false },
]

// 👉 methods
const deleteItem = (itemId: number) => {
  if (!productList.value)
    return

  const index = productList.value.findIndex(item => item.product.id === itemId)

  productList.value.splice(index, 1)
}

const categoryIcons = [
  { name: 'Mouse', icon: 'tabler-mouse', color: 'warning' },
  { name: 'Glass', icon: 'tabler-eyeglass', color: 'primary' },
  { name: 'Smart Watch', icon: 'tabler-device-watch', color: 'success' },
  { name: 'Bag', icon: 'tabler-briefcase', color: 'info' },
  { name: 'Storage Device', icon: 'tabler-device-audio-tape', color: 'warning' },
  { name: 'Bluetooth', icon: 'tabler-bluetooth', color: 'error' },
  { name: 'Gaming', icon: 'tabler-device-gamepad-2', color: 'warning' },
  { name: 'Home', icon: 'tabler-home', color: 'error' },
  { name: 'VR', icon: 'tabler-badge-vr', color: 'primary' },
  { name: 'Shoes', icon: 'tabler-shoe', color: 'success' },
  { name: 'Electronics', icon: 'tabler-cpu', color: 'info' },
  { name: 'Projector', icon: 'tabler-theater', color: 'warning' },
  { name: 'iPod', icon: 'tabler-device-airpods', color: 'error' },
  { name: 'Keyboard', icon: 'tabler-keyboard', color: 'primary' },
  { name: 'Smart Phone', icon: 'tabler-device-mobile', color: 'success' },
  { name: 'Smart TV', icon: 'tabler-device-tv', color: 'info' },
  { name: 'Google Home', icon: 'tabler-brand-google', color: 'warning' },
  { name: 'Mac', icon: 'tabler-brand-apple', color: 'error' },
  { name: 'Headphone', icon: 'tabler-headphones', color: 'primary' },
  { name: 'iMac', icon: 'tabler-device-imac', color: 'success' },
  { name: 'iPhone', icon: 'tabler-brand-apple', color: 'warning' },
]

const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], sortDesc: [false] })

const resolveStatusColor = (status: string) => {
  if (status === 'Confirmed')
    return 'primary'
  if (status === 'Completed')
    return 'success'
  if (status === 'Cancelled')
    return 'error'
}

const resolveStatus = (status: string) => {
  if (status === 'CREATED')
    return { text: 'Created', color: 'info', icon: 'tabler-dots' }
  if (status === 'REJECTED')
    return { text: 'REJECTED', color: 'error', icon: 'tabler-ban' }
  if (status === 'VALIDATED')
    return { text: 'VALIDATED', color: 'success', icon: 'tabler-checks' }
}


const categoryIconFilter = (categoryName: string): {
  icon: string
  color: string
}[] => {
  const index = categoryIcons.findIndex(category => category.name === categoryName)

  if (index !== -1)
    return [{ icon: categoryIcons[index].icon, color: categoryIcons[index].color }]

  return [{ icon: 'tabler-help-circle', color: 'primary' }]
}

if (error.value)
  console.error(error.value)


const isEditDialog = ref(false)
const status = ref('')
const idPayment = ref('')
const showDialog = (item) => {
  isEditDialog.value = true
  status.value = item.status
  idPayment.value = item.id
  console.table(item.id);
}
const router = useRouter()
const editStatus = (status:string,id:string)=>{
  axios.put(`http://localhost:9090/payments/${id}?status=${status}`).then((res)=>{
    console.table(res.data)
    isEditDialog.value = false
  }).then(()=>{
     axios.get(`http://localhost:9090/payments/all`).then(res=>{
      data.value = res.data
      
      }
     )
  }).catch(error=>console.log(error)
  )
  
}


onMounted(() => {
    
})

</script>

<template>
  <VCard>
    <v-card-text class="text-h4 m-5">
      Liste des Paiements
    </v-card-text>
    <VCardText>
      <VRow>
        <VCol cols="12" offset-md="8" md="4">
          <AppTextField v-model="search" placeholder="Search ..." append-inner-icon="tabler-search" single-line
            hide-details dense outlined />
        </VCol>
      </VRow>
    </VCardText>

    <!-- 👉 Data Table  -->
    <VDataTable :loading="isFetching" :headers="headers" :items="data || []" :search="search" class="text-no-wrap"
      :items-per-page="options.itemsPerPage" :page="options.page" :options="options">

      <template #bottom>
        <VCardText class="pt-2">
          <div class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 mt-2">
            <VTextField v-model="options.itemsPerPage" label="Rows per page:" type="number" min="-1" max="15"
              hide-details variant="underlined" style="max-inline-size: 8rem;min-inline-size: 5rem;" />

            <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
              :length="Math.ceil(data.length / options.itemsPerPage)" />
          </div>
        </VCardText>
      </template>

      <template #item.status="{ item }">
        <VChip :prepend-icon="resolveStatus(item.status).icon" :color="resolveStatus(item.status).color" size="small"
          class="text-xs">
          {{ resolveStatus(item.status).text }}
        </VChip>
      </template>

      <!-- Delete -->
      <template #item.hamza="{ item }">
        <IconBtn @click="console.log(item.firstName)">
          <VIcon icon="tabler-eye" color="primary" />
        </IconBtn>
        <IconBtn @click="showDialog(item)">
          <VIcon icon="tabler-edit" color="secobndary" />
        </IconBtn>
      </template>








    </VDataTable>

    <div class="text-center pa-4">


      <v-dialog v-model="isEditDialog" width="auto">
        <v-card max-width="400" title="Modifier le statut du paiement">


          <VCol md="8" class="mx-auto">
            <VSelect v-model="status" variant="filled" label="Status" :items="['CREATED',
            'VALIDATED',
            'REJECTED']"></VSelect>
          </VCol>

          
          <template v-slot:actions>
            <v-btn variant="outlined" class="ms-auto" color="success" text="Confirmer"
              @click="editStatus(status,idPayment)"></v-btn>
            <v-btn variant="outlined" class="ms-auto" color="error" text="Annuler"
              @click="isEditDialog = false"></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </VCard>




</template>

<style lang="scss">
.v-table th .v-data-table-header__content {
  font-size: 1.2em;

  font-weight: bolder;
}


.v-table>.v-table__wrapper>table>tbody>tr>td {
  font-size: 12px
}
</style>
