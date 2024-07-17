<script setup lang="ts">
import { useUserStore } from '@/store/useUserStore';

// import user1 from '@images/me.jpg';

const router = useRouter()
// const role = ref(useCookie('role').value)
const logout = async () => {
  useCookie('accessToken').value = null
  useCookie('role').value = null
  await router.push('/login')
}
const userProfileList = [
  { type: 'divider' },
  { type: 'navItem', icon: 'tabler-user', title: 'Profile', to: { name: 'apps-user-view-id', params: { id: 21 } } },
  { type: 'navItem', icon: 'tabler-settings', title: 'Settings', to: { name: 'pages-account-settings-tab', params: { tab: 'account' } } },
  { type: 'navItem', icon: 'tabler-file-dollar', title: 'Billing Plan', to: { name: 'pages-account-settings-tab', params: { tab: 'billing-plans' } }, badgeProps: { color: 'error', content: '4' } },
  { type: 'divider' },
  { type: 'navItem', icon: 'tabler-currency-dollar', title: 'Pricing', to: { name: 'pages-pricing' } },
  { type: 'navItem', icon: 'tabler-question-mark', title: 'FAQ', to: { name: 'pages-faq' } },
]
console.log(useUserStore().role);


</script>


<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
    <VIcon v-if="useUserStore().role=='admin'" icon="tabler-user-cog"/> 
    <VIcon v-else icon="tabler-user"/> 
      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="outlined"
                  >
                  <VIcon v-if="useUserStore().role=='admin'" icon="tabler-user-cog"/> 
                  <VIcon v-if="useUserStore().role=='student'" icon="tabler-user"/> 

                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>
            <VListItemTitle v-if="useUserStore().role == 'admin'" class="font-weight-bold text-uppercase">
              {{ 'M.FALL HACHIM'}}
            </VListItemTitle>
            <VListItemTitle v-if="useUserStore().role=='student'" class="font-weight-bold text-uppercase">
              {{ "BISSI OUSSAMA"}}
            </VListItemTitle>
            <VListItemSubtitle v-if="useUserStore().role == 'admin'">
              {{"ADMIN"}}
            </VListItemSubtitle>
            <VListItemSubtitle v-else>{{"STUDENT"}}</VListItemSubtitle>
          </VListItem>

          <!-- 👉 Logout -->
          <VListItem @click="logout" to="/login">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle  >
              Se Déconnecter
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
