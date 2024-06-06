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

// const { data: productList, error } = await useApi<SalesDetails[]>('pages/datatable')
 const { data,isFetching,error } = await useApi('http://localhost:9099/students/all')
const search = ref('')

// headers
const headers = [
  { title: 'prénom', key: 'firstName' },
  { title: 'nom', key: 'lastName' },
  { title: 'email', key: 'email' },
  { title: 'Programme', key: 'programId' },
  { title: 'code', key: 'code' },
  // { title: 'STATUS', key: 'status' },
  { title: 'view', key: 'hamza', sortable: false },
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

const resolveStatusColor = (status: string) => {
  if (status === 'Confirmed')
    return 'primary'
  if (status === 'Completed')
    return 'success'
  if (status === 'Cancelled')
    return 'error'
}
const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], sortDesc: [false] })

const categoryIconFilter = (categoryName: string): {
  icon: string
  color: string }[] => {
  const index = categoryIcons.findIndex(category => category.name === categoryName)

  if (index !== -1)
    return [{ icon: categoryIcons[index].icon, color: categoryIcons[index].color }]

  return [{ icon: 'tabler-help-circle', color: 'primary' }]
}

if (error.value)
  console.error(error.value)
</script>

<template>
  <VCard>
    <v-card-text class="text-h4 m-5">
      Liste des Students
    </v-card-text>
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          offset-md="8"
          md="4"
        >
          <AppTextField
            v-model="search"
            placeholder="Search ..."
            append-inner-icon="tabler-search"
            single-line
            hide-details
            dense
            outlined
          />
        </VCol>
      </VRow>
    </VCardText>

    <!-- 👉 Data Table  -->
    <VDataTable
      :headers="headers"
      :items="data || []"
      :search="search"
     :items-per-page="options.itemsPerPage"
    :page="options.page"
    :options="options"
      class="text-no-wrap"
    >
      <template #bottom>
      <VCardText class="pt-2">
        <div class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 mt-2">
          <VTextField
            v-model="options.itemsPerPage"
            label="Rows per page:"
            type="number"
            min="-1"
            max="15"
            hide-details
            variant="underlined"
            style="max-inline-size: 8rem;min-inline-size: 5rem;"
          />

          <VPagination
            v-model="options.page"
            :total-visible="$vuetify.display.smAndDown ? 3 : 5"
            :length="Math.ceil(data.length / options.itemsPerPage)"
          />
        </div>
      </VCardText>
    </template>

      <!-- Delete -->
      <template #item.hamza="{ item }">
        <IconBtn @click="console.log(item.firstName)">
          <VIcon icon="tabler-eye" color="primary" />
        </IconBtn>
      </template>
    </VDataTable>
  </VCard>
</template>
<style lang="scss">
.v-table th .v-data-table-header__content {
  font-size:1.2em;

font-weight: bolder;
}


.v-table > .v-table__wrapper > table > tbody > tr > td{
  font-size:12px
}
</style>
