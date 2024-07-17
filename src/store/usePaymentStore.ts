import { Payment, PaymentStatus } from "@/@core/types";
import axiosIns from '@/plugins/axiosIns';
export const usePaymentStore = defineStore('Payment', () => {
    const isLoading = ref(false)
    const listePayments = ref<Payment>(null);
    const error = ref(null)

     async function fetchAll() 
      {
          isLoading.value = true
          const {isFetching,data} = await useApi('/payments/all')          
          setTimeout(() => {
            listePayments.value = data.value
          }, 1000); 
          isLoading.value = isFetching.value       
      }
      async function fetchAllbyStudent(code) 
      {
          isLoading.value = true
          const {isFetching,data} = await useApi('/payments/student/'+code)          
          setTimeout(() => {
            listePayments.value = data.value
          }, 1000); 
          isLoading.value = isFetching.value       
      }
      async function editStatusPayment(id:string,status:PaymentStatus){
        console.log(id);
        
           await axiosIns.put(`${import.meta.env.VITE_SPRING_BOOT_API_URL}/payments/${id}?status=${status}`)     
      }


    return {listePayments,isLoading,error,fetchAll,editStatusPayment,fetchAllbyStudent}
  })
