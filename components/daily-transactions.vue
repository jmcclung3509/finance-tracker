<template>
  <div
    class="grid grid-cols-2 border-b border-border-color py-2 text-muted-text"
  >
    <div class="text-bold-text left flex justify-between items-center">
      {{ formatedDate }}
    </div>

    <div class="right flex justify-end items-center" v-if="showTotal">
      {{ currency }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  date: String,
  transactions: Array,
});

const sum = computed(() => {
  let sum = 0;

  for (const transaction of props.transactions) {
    if (transaction.type.toLowerCase() === "income") {
      sum += transaction.amount;
    } else {
      sum -= transaction.amount;
    }
  }
  return sum;
});

const showTotal = computed(() => {
  for (const transaction of props.transactions) {
    if (Math.abs(transaction.amount) == Math.abs(sum.value)) {
      return false;
    } else {
      return true;
    }
  }
});

const currency = useCurrency(sum);
const formatedDate = computed(() => {
  const splitDate = props.date.split("-");

  return `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`;
});
</script>
