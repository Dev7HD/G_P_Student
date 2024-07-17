export const useUserStore = defineStore('User', () => {
    const role = ref(useCookie('role').value)
    
    function setRole(rolee){
        role.value = rolee
    }

    return {role,setRole}
  })
