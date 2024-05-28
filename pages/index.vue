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
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="expense"
      :amount="expenseTotal"
      :lastAmount="1000"
      :loading="isLoading"
    />
    <Trend
      color="green"
      title="Income"
      :amount="4000"
      :lastAmount="4000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Income"
      :amount="4000"
      :lastAmount="5000"
      :loading="isLoading"
    />
  </section>

  <section class="flex justify-between mb-10">
<div class="flex flex-col justify-center items-start space-y-1">
  <h2 class="text-bold-text"> Transactions</h2>
 <p class="text-default-text" >You have <span class="text-bold-text font-semibold">{{incomeCount }}</span> and <span class="text-bold-text font-semibold">{{ expenseCount }} </span> expenses in this period</p> 
</div>
<div class="right">
<TransactionModal v-model="isOpen"  @closeModal="isOpen=false"/> 
  <UButton icon="i-heroicons-plus-circle" @click="isOpen = true" color="white"  label="Add" variant="solid"/>
</div>
  </section>
  <section  v-if="!isLoading" class="transaction">
    <div
      v-for="(transactionsByDay, date) in transactionGroupedByDate"
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
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4"  :key="i"/>
  </section>
</template>

<script setup lang="js">


import { transactionViewOptions } from '~/constants';
import { currencyOptions } from '~/constants';

const supabase = useSupabaseClient()

const selectedView = ref(transactionViewOptions[0]);
const selectedCurrency = ref(currencyOptions[0]);

const transactions = ref([])
const isLoading=  ref(false)
const isOpen = ref(false)



const handleCurrencyChange = ()=>{
    data.currencyType=selectedCurrency.value;

}

const fetchTransactions = async()=>{
    isLoading.value=true
    try{
        const {data} = await useAsyncData('transactions', async ()=>{
         const { data, error } = await supabase
         .from('transactions')
         .select()
         .order('created_at', {ascending: false})
            if(error) return []
            return data

        })
    return data.value
    }catch(error){
        console.error(error)
    }finally{
    isLoading.value = false

}
}

const refreshTransactions = async ()=>{
 return  transactions.value = await fetchTransactions() 
}
await refreshTransactions()


const transactionGroupedByDate = computed(()=>{
    let grouped={}

    for (const transaction of transactions.value){

       let date = new Date(transaction.created_at)
       date = date.getFullYear() + '-' +
                                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                                String(date.getDate()).padStart(2, '0');

        if(!grouped[date]){
            grouped[date] = []
        }

    grouped[date].push(transaction)

    }
//How to sort on the frontend by date
    // const sortedKeys = Object.keys(grouped).sort().reverse()
    // console.log(sortedKeys, 'sortedKeys')
    // const sortedGroup = {}
    // for (const key of sortedKeys){
    //     sortedGroup[key] = grouped[key]
    //     console.log(sortedGroup[key], 'sortedGroup')
      
    // }
    // return sortedGroup
 return grouped
})

const income = computed(()=>{
return transactions.value.filter(t=>t.type.toLowerCase() === 'income')
})


const  expense = computed(()=>{
    if(!transactions.value.length) return []
    return transactions.value.filter(t=>t.type.toLowerCase() === 'expense')
})

const incomeCount= computed(()=> income.value.length)
const expenseCount=computed(()=> expense.value.length)   



const incomeTotal = computed(()=>{
   return income.value.reduce((sum, transaction)=> sum + transaction.amount, 0)
})


const expenseTotal = computed(()=>{
    return expense.value.reduce((sum, transaction)=> sum + transaction.amount, 0)

})

</script>
