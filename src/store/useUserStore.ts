import type { User } from '@/@core/types'

interface State {
  listUser: User[]
  data: User | null 
  isLoading: boolean
}
export const useUserStore = defineStore('user', {
  state: (): State => ({
    listUser: [{
      cni: 'EE2',
      nom: 'BADRI',
      prenom: 'ILHAM',
      matricule: '45899/c',
      promotion: 68,
      grade: 'MDL Gendrame',
      telephone: '0644512878',
      ville: 'Marrakech',
      imageUrl: 'https://www.mapnews.ma/fr/sites/default/files/styles/corps_article_image/public/Boutaina%20Mezrane.jpg?itok=70woGakq',
    }, {
      cni: 'EE1',
      nom: 'Salhaoui',
      prenom: 'Amal',
      matricule: '58899/c',
      promotion: 38,
      grade: 'Adjaudant',
      telephone: '0754512878',
      ville: 'Rabat',
      imageUrl: 'https://pam.ma/fr/wp-content/uploads/2021/03/gandarme.jpg',
    }],
    isLoading: false,
    data: null,
  }),
  actions: {
     fetchOne(cni: string) {
      const searchedCni = cni.toLocaleLowerCase()

      this.isLoading = true
      setTimeout(() => {
        const foundUser = this.listUser.find(user => user.cni.toLocaleLowerCase() === searchedCni)

        if (foundUser)
          this.data = foundUser

        else
          this.data = null

        this.isLoading = false
      }, 1000)
    },
  },

})
