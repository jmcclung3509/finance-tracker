<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-2xl font-bold">Summary</h1>
    <div class="flex justify-content items-center gap-4">
      <!-- <DateRangePicker @update:selectedRange="handleDateRangeChange" /> -->
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
      :lastAmount="prevIncomeTotal"
      :loading="isPending"
      :currencyType="data.currencyType"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :lastAmount="prevExpenseTotal"
      :loading="isPending"
      :currencyType="data.currencyType"
    />
    <Trend
      color="blue"
      title="Investments"
      :amount="investmentTotal"
      :lastAmount="prevInvestmentTotal"
      :loading="isPending"
      :currencyType="data.currencyType"
    />
    <Trend
      color="purple"
      title="Savings"
      :amount="savingsTotal"
      :lastAmount="prevSavingsTotal"
      :loading="isPending"
      :currencyType="data.currencyType"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div class="flex flex-col justify-center items-start space-y-1">
      <h2 class="text-bold-text text-2xl mb-4">Transactions</h2>
<p class="text-lg"> Summary for the {{ timePeriod }}</p>
      <ul class="list-none flex flex-wrap justify-start gap-4 items-center ml-1">
        <li class="text-sm">
          Income:
         <span class="font-semibold text-bold-text ">{{ incomeCount }}</span>
        </li>
        <li class="text-sm">
          Expenses:
         <span class="font-semibold text-bold-text "> {{ expenseCount }}</span>
        </li>
        <li class="text-sm">
         Investments:
          <span class="font-semibold text-bold-text "> {{ investmentCount }}</span>
        </li>
        <li class="text-sm">
         Savings:
         <span class="font-semibold text-bold-text ">  {{ savingsCount }}</span>
        </li>
      </ul>
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
    <div v-for="(transactionsByDay, date) in byDate" :key="date" class="mb-10">
      <DailyTransactions :date="date" :transactions="transactionsByDay">{{
        transactions
      }}</DailyTransactions>
      <Transaction
        v-for="transaction in transactionsByDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions()"
        @updated="refreshTransactions()"
        :currencyType="data.currencyType"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions, currencyOptions } from "~/constants";

const emit = defineEmits(["currencyChanged"]);

const isOpen = ref(false);
const selectedView = ref(transactionViewOptions[0]);
const selectedCurrency = ref(currencyOptions[0]);

const data = reactive({
  currencyType: selectedCurrency.value,
});

const { current, previous } = useSelectedTimePeriod(selectedView);

const {
  isPending,
  refreshTransactions,
  transactions: {
    incomeCount,
    expenseCount,
    investmentCount,
    savingsCount,
    incomeTotal,
    expenseTotal,
    investmentTotal,
    savingsTotal,
    grouped: { byDate },
  },
} = useFetchTransactions(current);

const {
  transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal,
    investmentTotal: prevInvestmentTotal,
    savingsTotal: prevSavingsTotal,
  },
} = useFetchTransactions(previous);

const handleCurrencyChange = () => {
  data.currencyType = selectedCurrency.value;
  emit("currencyChanged", data.currencyType);
};
watch(
  () => selectedCurrency,
  () => {
    data.currencyType = selectedCurrency.value;
    emit("currencyChanged", data.currencyType);
  }
);

const timePeriod = computed(() => {
 switch (selectedView.value) {
  case "Daily":
    return "day";
    case "Weekly":
      return "week";
    case "Monthly":
      return "month";
    case "Yearly":
      return "year";
    default:
      return "year";
  }

});
console.log(timePeriod.value);
</script>
