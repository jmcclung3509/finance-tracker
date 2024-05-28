<template>
  <div
    class="border-b border-border-color py-2 text-default-text grid grid-cols-3"
  >
    <div class="flex justify-between items-center gap-14 col-span-2">
      <div class="flex justify-start space-x-1 items-center">
        <UIcon :name="icon" class="icon text-lg" :class="[iconColor]" />
        <div>{{ props.transaction.description }}</div>
      </div>
      <div >
        <UBadge
          v-show="
            props.transaction.category && props.transaction.category !== ''
          "
          color="white"
          >{{ props.transaction.category }}</UBadge
        >
      </div>
    </div>

    <div class="flex justify-end space-x-2 items-center">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-chevron-down-20-solid"
            :loading="isLoading"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const toast = useToast();
const supabase = useSupabaseClient();

const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(["deleted"]);
const isLoading = ref(false);

const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    await supabase.from("transactions").delete().eq("id", props.transaction.id);
    toast.add({
      title: "Transaction deleted",
      description: "Transaction has been deleted successfully",
      icon: "i-heroicons-trash-20-solid",
      color: "green",
    });
    emit("deleted", props.transaction.id);
  } catch (error) {
    toast.add({
      id: "transaction_deleted",
      title: "Transaction deleted",
      description: "Transaction has been deleted successfully",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit"),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteTransaction(),
    },
    {
      label: "Add",
      icon: "i-heroicons-plus-20-solid",
      click: () => console.log("Add"),
    },
  ],
];

const isIncome = computed(() => {
  return props.transaction.type.toLowerCase() === "income";
});

const icon = computed(() => {
  return isIncome.value
    ? "i-heroicons-arrow-up-right"
    : "i-heroicons-arrow-down-left";
});

const iconColor = computed(() => {
  return isIncome.value ? "text-highlight-green" : "text-highlight-red";
});
const { currency } = useCurrency(props.transaction.amount);
</script>
