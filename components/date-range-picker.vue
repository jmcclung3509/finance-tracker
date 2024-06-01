<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton icon="i-heroicons-calendar-days-20-solid">
      <template v-if="selected.start && selected.end">
      {{ format(selected.start, "d MMM, yyy") }} -
      {{ format(selected.end, "d MMM, yyy") }}</template>
    </UButton>

    <template #panel="{ close }">
      <DatePicker v-model="selected"  @update:modelValue="handleDateChange" />
    </template>
</UPopover>
</template>

<script setup>
import { sub, format } from "date-fns";

const selected = ref({ start: sub(new Date(), { days: 14 }), end: new Date() });

const emit = defineEmits(['update:selectedRange']);

const handleDateChange = () => {
  emit('update:selectedRange', selected.value);
};

</script>
