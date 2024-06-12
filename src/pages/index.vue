<template>
<VCard class="mb-6">
      <VCardText class="py-12 position-relative">
        <div
          class="d-flex flex-column gap-y-4 mx-auto"
          :class="$vuetify.display.mdAndUp ? 'w-100' : $vuetify.display.xs ? 'w-50' : 'w-75'"
        >
          <h4
            class="text-h4 text-center text-uppercase text-wrap mx-auto"
            
          >
          Bienvenue sur notre application de <span class="text-decoration-underline text-primary text-no-wrap">gestion des paiements des étudiants.</span>
          </h4>
          <p class="text-center text-wrap text-body-1 mx-auto mb-0">
            Facilitez vos paiements avec notre application . </p>
        </div>
        <img
          :src="academyCourseIllustration2"
          class="illustration1 d-none d-md-block"
          height="180"
        >
        <img
          :src="academyCourseIllustration1"
          class="illustration2 d-none d-md-block"
          height="180"
        >
      </VCardText>
</VCard>


  <VRow id=" match-height">
    <VCol cols="12" md="6">
      <VCard
        title="Statut des Paiements"
        subtitle="Statistiques des paiements classés par statut."
      >
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
         title="Date des Paiements"
        subtitle="Statistiques des paiements classés par date."
      >
      
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

</template>


<style lang="scss">

.illustration1 {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.illustration2 {
  position: absolute;
  inset-block-start: 2rem;
  inset-inline-start: 2.5rem;
}
</style>





<script setup lang="ts">
import type { ChartJsCustomColors } from '@/views/charts/chartjs/types'
import { getLatestBarChartConfig, getPolarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import BarChart from '@core/libs/chartjs/components/BarChart'
import PolarAreaChart from '@core/libs/chartjs/components/PolarAreaChart'
import academyCourseIllustration2 from '@images/illustrations/classic-pack-payment-methods.png'
import academyCourseIllustration1 from '@images/illustrations/payment-elements-background.png'
import axios from 'axios'

import { useTheme } from 'vuetify'
interface PaymentData {
  date: string;
  amount: number;
}


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
    const response = await axios.get(import.meta.env.VITE_SPRING_BOOT_API_URL+'/payments/all') // Replace with your API endpoint
    return response.data
  } catch (error) {
    console.error('Error fetching payment data:', error)
    return []
  }
}

// Function to process payment data and aggregate totals by date
async function processData(): Promise<any> {
  const paymentData = await fetchPaymentData()
  const aggregatedData = paymentData.reduce((acc, curr) => {
    
    // Assuming date is in ISO format, extract date
    let IsoDate = new Date(curr.date)
    const date = IsoDate.toISOString().split('T')[0] // Extract date portion if date is in ISO format
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += curr.amount
    return acc
  }, {})
  const sortedDates = Object.keys(aggregatedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  return {
    labels: Object.keys(aggregatedData),
    datasets: [
    {
      maxBarThickness: 20,
      backgroundColor: colors.primary,
      borderColor: 'transparent',
      borderRadius: { topRight: 15, topLeft: 15 },
      data: sortedDates.map(date => aggregatedData[date]),
    },
  ]
  }
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
        label: 'Total Payments by Status',
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

const dataSets = ref(null)
const dataSetsByStatus = ref(null)

onMounted(()=>{
  processData().then(res=>{
    dataSets.value = res
})
processDataByStatus().then(res=>{
    dataSetsByStatus.value = res
})
})
const chartConfig = computed(() => getPolarChartConfig(vuetifyTheme.current.value))
const chartConfigBar = computed(() => getLatestBarChartConfig(vuetifyTheme.current.value))
</script>

