<template>
  <div
    class="border-b border-border-color py-2 text-default-text grid grid-cols-3"
  >
    <div class="flex justify-between items-center gap-14 col-span-2">
      <div class="flex justify-start space-x-2 items-center">
     
        <Icon :name="icon" class="icon text-2xl" :class="[iconColor]" />
        <div>{{ props.transaction.description }}</div>
      </div>
      <div>
        <UBadge
          v-show="
            props.transaction.category && props.transaction.category !== ''
          "
          color="white"
          >{{ props.transaction.category }}</UBadge
        >
      </div>{{ props.transaction.type }}
    </div>
    <TransactionUpdateModal
      :transaction="props.transaction"
      v-model="updateModalIsOpen"
      @closeModal="updateModalIsOpen = false"
      @updated="updated"
    />

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
const updateModalIsOpen = ref(false);

const props = defineProps({
  transaction: Object,
  currencyType: String,
})

const emit = defineEmits(["deleted", "updated"]);
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

const selectedTransactionId = ref(null);



const openUpdateModal = (transactionId) => {
  console.log(transactionId);
  selectedTransactionId.value = transactionId;
  updateModalIsOpen.value = true;
};
const updated = () => {
  emit("updated");
  updateModalIsOpen.value = false;
 
};

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => openUpdateModal(props.transaction.id),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteTransaction(),
    },
  ],
];

const isIncome = computed(() => {
  return props.transaction.type.toLowerCase() === "income";
});
const isExpense = computed(() => {
  return props.transaction.type.toLowerCase() === "expense";
});
const isInvestment = computed(() => {
  return props.transaction.type.toLowerCase() === "investment";
});
const isSavings = computed(() => {
  return props.transaction.type.toLowerCase() === "savings";
});

const transactionType = computed(() => {
  if (isIncome.value) return "income";
  if (isExpense.value) return "expense";
  if (isInvestment.value) return "investment";
  if (isSavings.value) return "savings";
});


const icon = computed(() => {
switch(transactionType.value){
  case "income":
    return "mdi:dollar";
  case "expense":
    return "mdi:credit-card";
    case  "investment":
    return "mdi:bank";
    case "savings":
    return "mdi:piggy-bank";
  default:
    return " ";
}
});


const iconColor = computed(() => {

  switch(transactionType.value){
  case "income":
    return "text-highlight-green";
  case "expense":
    return "text-highlight-red";
    case  "investment":
    return "text-highlight-blue";
    case "savings":
    return "text-highlight-purple";
  default:
    return " ";
}
});

const currency = computed(() => {
    return new Intl.NumberFormat("en-In", {
      style: "currency",
      currency: props.currencyType || "USD",
    }).format(isRef(props.transaction.amount) ? props.transaction.amount.value : props.transaction.amount);
  });



</script>
