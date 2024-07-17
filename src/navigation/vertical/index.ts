
export default [
  {
    title: 'Accueil',
    to: { name: 'root' },
    icon: { icon: 'tabler-home' },
    action: 'read',
    subject: 'admin',
  },
  
  {
    title: 'Paiements',
    to: { name: 'payments' },
    icon: { icon: 'tabler-brand-cashapp' },
    action: 'read',
    subject: 'admin',
   
  },
   {
    title: 'Étudiants',
    to: { name: 'students' },
    icon: { icon: 'tabler-users' },
    action: 'read',
    subject: 'admin',
  }
]
