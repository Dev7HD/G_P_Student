<template>
<VCard class="mb-6">
      <VCardText class=" d-flex flex-column flex-sm-row">
        <img
          :src="academyCourseIllustration1"
          :height="$vuetify.display.smAndUp ? '240' : '200'"
        >
        <div
          class="d-flex flex-column gap-y-4 justify-center mx-13"
        >
          <h4
            class="text-h6 text-center  text-wrap mx-auto letter-spacin text-sm-h4 "
          >
          <span class="text-primary text-uppercase"><span class='sizing'>g</span>estion <span class='sizing'>d</span>es <span class='sizing'>p</span>aiements <span class='sizing'>d</span>es <span class='sizing'>é</span>tudiants.</span>
          </h4>
          <p class="text-center text-wrap text-body-1 mx-auto mb-0 letter-spacing">
            Simplifiez la gestion de vos finances étudiantes avec notre solution intuitive et sécurisée. </p>
        </div>
        
      </VCardText>
</VCard>


  <VRow id=" match-height" v-if="useCookie('role').value =='admin'">
    <VCol cols="12" md="6" sm="12">
      <VCard
        title="Répartition des Paiements par Statut."
        >
        <template #subtitle>
          <span class="text-wrap text-caption">Visualisation de la distribution des paiements crées , rejetées et validées.</span>
        </template>
        <VCardText>
          <PolarAreaChart
          v-if="dataSetsByStatus"
          :chart-options="chartConfig"
          :height="400"
          :chart-data="dataSetsByStatus"
           />      
            </VCardText>
      </VCard>
    </VCol>
    <!-- 👉 Statistics Line Chart  -->
    <VCol cols="12" md="6">
      <VCard
        title="Répartition des Montants par Date de Paiement."
      >
      <template #subtitle>
          <span class="text-wrap text-caption">Visualisation des montants totaux payés chaque jour pour la période sélectionnée.</span>
        </template>
        <VCardText>
          <BarChart
            v-if="dataSets"
            :chart-options="chartConfigBar"
            :height="400"
            :chart-data="dataSets"
           />      
            </VCardText>
      </VCard>
    </VCol>
   
  </VRow>
<VRow v-if="useCookie('role').value =='student'">
  <VCol cols="12" >
    <StudentPaymentsList/>
  </VCol>
</VRow>
</template>



<script setup lang="ts">
import { useConfigStore } from '@/@core/stores/config'
import StudentPaymentsList from '@/components/students/StudentPaymentsList.vue'
import axiosIns from '@/plugins/axiosIns'
import { useUserStore } from '@/store/useUserStore'
import type { ChartJsCustomColors } from '@/views/charts/chartjs/types'
import { getLatestBarChartConfig, getPolarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import BarChart from '@core/libs/chartjs/components/BarChart'
import PolarAreaChart from '@core/libs/chartjs/components/PolarAreaChart'
import academyCourseIllustration1 from '@images/111676393_10030673.jpg'
import { useTheme } from 'vuetify'
interface PaymentData {
  date: string;
  amount: number;
}

definePage({
  meta: {
    action: 'read',
    subject: 'Admin',
  },
})
const colors: ChartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#2C4962',
  error:'#F25C69'  ,
  success:'#59D938'  ,
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}

const vuetifyTheme = useTheme()
// Function to fetch payment data from API
async function fetchPaymentData(): Promise<PaymentData[]> {
  try {
    const response = await axiosIns.get('/payments/all') 
    return response.data
  } catch (error) {
    console.error('Error fetching payment data:', error)
    return []
  }
}

// Function to process payment data and aggregate totals by date
async function processData(): Promise<any> {
  const paymentData = await fetchPaymentData();
  
  const aggregatedData = paymentData.reduce((acc, curr) => {
    // Assuming date is in ISO format, extract date
    let IsoDate = new Date(curr.date);
    const date = IsoDate.toISOString().split('T')[0]; // Extract date portion if date is in ISO format
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += curr.amount;
    return acc;
  }, {});

  const sortedDates = Object.keys(aggregatedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return {
    labels: sortedDates,
    datasets: [
      {
        maxBarThickness: 15,
        backgroundColor: colors.primary,
        borderColor: 'transparent',
        borderRadius: { topRight: 15, topLeft: 15 },
        data: sortedDates.map(date => aggregatedData[date]),
      },
    ]
  };
}

async function processDataByStatus(): Promise<any> {
  const paymentData = await fetchPaymentData()
  const aggregatedData = paymentData.reduce((acc, curr) => {
    const status = curr.status
    if (!acc[status]) {
      acc[status] = 0
    }
    acc[status] += 1
    return acc
  }, {})

  return {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        borderWidth: 0,
        label: 'Total par statut ',
        data: Object.values(aggregatedData),
        backgroundColor: [
          colors.error,
          colors.success,
          colors.primary
        ],
      },
    ],
  }
}

const role = ref(useUserStore().role)
console.log(role.value);
watch(role,(newVal,oldVal)=>{
  console.log(newVal,oldVal);
  
})
const dataSets = ref(null)
const dataSetsByStatus = ref(null)
  let userAbilities = [{
        action: 'manage',
        subject: useUserStore().role,
      }]
      
  const ability = useAbility()
  ability.update(userAbilities)
  
onMounted(()=>{  
  useUserStore().setRole(useCookie("role").value)
  useConfigStore().isVerticalNavCollapsed=true
  
  if (useUserStore().role == 'admin') {
    useConfigStore().isVerticalNavCollapsed=false
    processData().then(res=>{
    dataSets.value = res
  })
  processDataByStatus().then(res=>{
      dataSetsByStatus.value = res
  })
  }
})
const chartConfig = computed(() => getPolarChartConfig(vuetifyTheme.current.value))
const chartConfigBar = computed(() => getLatestBarChartConfig(vuetifyTheme.current.value))
</script>

<style lang="scss">
.sizing{
  font-size: 2.5rem;
}
.letter-spacing{
  letter-spacing: 3px !important;
    word-spacing: 5px;
}
</style>
