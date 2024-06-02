<template>
  <div
    class="grid grid-cols-2 border-b border-border-color py-2 text-muted-text"
  >
    <div class=" text-bold-text left flex justify-between items-center">{{ date }}</div>

    <div class="right flex justify-end items-center">{{ currency }}</div>
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
  return sum
});

const { currency } = useCurrency(sum);
</script>


