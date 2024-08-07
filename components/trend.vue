<template>
  <div  class="py-7 md:py-0">
    <div class="">
      <h2 class="text-2xl" :class="[color]">{{ title }}</h2>
    </div>

    <div class="text-2xl text-default-text font-semibold mb-2">
      <USkeleton
        class="h-8 w-full bg-gray-300 rounded-sm"
        v-if="props.loading"
      />
      <div v-else>{{ currency }}</div>
    </div>

    <div class="">
      <USkeleton
        class="h-4 w-full bg-gray-300 rounded-sm"
        v-if="props.loading"
      />

      <div v-else class="flex space-x-1 items-center text-sm">

        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="{
            green: trendingUp === true,
            red: trendingUp === false,
            'default-text': trendingUp === null,
          }"
        />
        <p class="text-default">{{ percent }} vs last period</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
  percent: Number,
  currencyType: {
    type: String,
    default: "USD",
  },
});

const currency = computed(() => {
  return new Intl.NumberFormat("en-In", {
    style: "currency",
    currency: props.currencyType || "USD",
  }).format(isRef(props.amount) ? props.amount.value : props.amount);
});

const trendingUp = computed(() => {
  if (props.amount > props.lastAmount) {
    return true;
  } else if (props.amount < props.lastAmount) {
    return false;
  } else {
    return null;
  }
});

const icon = computed(() => {
  if (trendingUp.value === null) return " ";
  return trendingUp.value
    ? "i-heroicons-arrow-trending-up"
    : "i-heroicons-arrow-trending-down";
});

const percent = computed(() => {
  if (props.amount === props.lastAmount) {
    return "No change";
  }

  const bigger = Math.max(props.amount, props.lastAmount);
  const lower = Math.min(props.amount, props.lastAmount);
  let ratio;
  if (props.amount === 0 || props.lastAmount === 0) {
    ratio = Math.abs((bigger - lower)) ;
  } else {
    ratio = ((bigger - lower) / lower) * 100;
  }
  return Math.ceil(ratio) + "%";
});
</script>

<style scoped>
.green {
  @apply text-highlight-green;
}
.red {
  @apply text-highlight-red;
}
.blue {
  @apply text-highlight-blue;
}
.purple {
  @apply text-highlight-purple;
}
.pink{
  @apply text-highlight-pink;
}
</style>
