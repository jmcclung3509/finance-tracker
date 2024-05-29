<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-2xl font-bold">Summary</h1>
    <div class="flex justify-content items-center gap-4">
      <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
      <USelectMenu
        v-model="selectedCurrency"
        :options="currencyOptions"
        @change="handleCurrencyChange"
      />
    </div>
  </section>
  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="green"
      title="Income"
      :amount="incomeTotal"
      :lastAmount="5000"
      :loading="isPending"
    />
    <Trend
      color="red"
      title="expense"
      :amount="expenseTotal"
      :lastAmount="1000"
      :loading="isPending"
    />
    <Trend
      color="green"
      title="Income"
      :amount="4000"
      :lastAmount="4000"
      :loading="isPending"
    />
    <Trend
      color="red"
      title="Income"
      :amount="4000"
      :lastAmount="5000"
      :loading="isPending"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div class="flex flex-col justify-center items-start space-y-1">
      <h2 class="text-bold-text">Transactions</h2>
      <p class="text-default-text">
        You have
        <span class="text-bold-text font-semibold">{{ incomeCount }}</span> and
        <span class="text-bold-text font-semibold">{{ expenseCount }} </span>
        expenses in this period
      </p>
    </div>
    <div class="right">
      <TransactionModal
        v-model="isOpen"
        @closeModal="isOpen = false"
        @saved="refreshTransactions"
      />
      <UButton
        icon="i-heroicons-plus-circle"
        @click="isOpen = true"
        color="white"
        label="Add"
        variant="solid"
      />
    </div>
  </section>
  <section v-if="!isPending" class="transaction">
    <div
      v-for="(transactionsByDay, date) in byDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactions :date="date" :transactions="transactionsByDay" />
      <Transaction
        v-for="transaction in transactionsByDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup lang="js">


import { transactionViewOptions } from '~/constants';
import { currencyOptions } from '~/constants';

const selectedView = ref(transactionViewOptions[0]);
const selectedCurrency = ref(currencyOptions[0]);

const dates = useSelectedTimePeriod(selectedView)
console.log(dates, 'dates')

const { isPending,  refreshTransactions, transactions: {incomeCount, expenseCount, incomeTotal, expenseTotal, grouped:{byDate}
}} = useFetchTransactions();

await refreshTransactions()




const isOpen = ref(false)



const handleCurrencyChange = ()=>{
    data.currencyType=selectedCurrency.value;
}
</script>
