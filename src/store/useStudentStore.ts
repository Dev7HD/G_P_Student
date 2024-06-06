import { Payment, Student } from "@/@core/types";

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



    return {listeStudents, listeStudentPayments, isLoading, fetchAll,fetchStudentPayments}
  })
