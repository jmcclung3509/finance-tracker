<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-2xl font-bold">Summary</h1>
    <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
  </section>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend color="green" title="Income" :amount="4000" :lastAmount="5000" :loading=false />
    <Trend color="red" title="Expenditures" :amount="4000"  :lastAmount="1000":loading=false />
    <Trend color="green" title="Income" :amount="4000"  :lastAmount="4000":loading=false />
    <Trend color="red" title="Expenditures" :amount="4000" :lastAmount="5000" :loading=false />


  </section>
</template>

<script setup lang="js">

import { transactionViewOptions } from '~/constants';

const selectedView = ref(transactionViewOptions[0]);
console.log(selectedView.value)
</script>
