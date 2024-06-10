import { Payment, Student } from "@/@core/types";
import axios from "axios";

export const useStudentStore = defineStore('Student', () => {
    const isLoading = ref(false)
    const listeStudents = ref<Student>(null);
    const listeStudentPayments = ref<Payment>(null);

     async function fetchAll() 
      {
          isLoading.value = true
          const {isFetching,data} = await useApi('/students/all')          
          setTimeout(() => {
            listeStudents.value = data.value
          }, 1000); 
          isLoading.value = isFetching.value       
      }

      async function fetchStudentPayments(codeStudent:string){
        isLoading.value = true
          const {isFetching,data} = await useApi('/payments/student/'+codeStudent)          
          setTimeout(() => {
            listeStudentPayments.value = data.value
          }, 1000); 
          isLoading.value = isFetching.value   
      }


      async function fetchOne(code:string){
        return  await useApi('/student/'+code)
      }

      async function addPayment(payment){
        
          const {data} = await useApi('/payments/new').post({...payment})         

          console.log(data.value);
          
      }

      async function getPdfFile(idPayment:string){
         return  axios.get(`${import.meta.env.VITE_SPRING_BOOT_API_URL}/paymentFile/${idPayment}`,{
         responseType :'blob'})
         
      }

        async function updateOne(payload:Student){        
           await axios.put(`${import.meta.env.VITE_SPRING_BOOT_API_URL}/student/edit`,payload)     
      }

        async function deleteOne(code:string){
          await axios.delete(`${import.meta.env.VITE_SPRING_BOOT_API_URL}/student/delete/${code}`)
        }

    return {listeStudents, listeStudentPayments, isLoading,fetchOne,deleteOne ,getPdfFile, fetchAll,fetchStudentPayments,updateOne,addPayment}
  })
