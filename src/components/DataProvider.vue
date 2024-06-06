<template>
  <slot :data="data" :loading="loading"></slot>
</template>
<script setup lang="ts">
import axios from 'axios';
  const API_ENDPOINT_URL = "https://jsonplaceholder.typicode.com/posts";
  const loading = ref(false)
  const data = ref(null)

  const fetchData = async()=>{
    loading.value = true
    const res = await axios.get(API_ENDPOINT_URL)
    data.value = await res.data
    loading.value = false
  }

  fetchData()
</script>
