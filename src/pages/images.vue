<template>
  <DataProvider #="{data,loading}">
    <div v-if="loading">....Loading</div>
    <div v-else>{{ data }}</div>
</DataProvider>
</template>

<script setup lang="ts">
  import DataProvider from '@components/DataProvider.vue';
</script>

<style>
</style>
