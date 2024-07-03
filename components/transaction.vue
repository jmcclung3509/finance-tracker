<template>
  <div class="border-b border-border-color py-2 text-default-text ">
    <div class="flex flex-col md:flex-row items-start justify-between md:items-center gap-14 ">
      <div class="flex justify-between items-center md:w-3/4">
        <div class="flex items-center gap-4 justify-start  md:w-3/4" >
          <div class="icon-container relative" @mouseover="showTransactionType=true" @mouseleave="showTransactionType=false">
            <transition name="fade">
          <span v-if="showTransactionType === true" class="text-default-text text-xs font-semibold absolute top-10">{{ props.transaction.type }}</span> 
          </transition>
          <Icon :name="icon" class="icon text-[24px] }" :class="[iconColor]"/>
         </div>
          <p class="description-text truncate overflow-hidden w-1/3 md:w-full" ref="descriptionRef"  :class="{ showing: showMore }">
            {{ props.transaction.description }}
          </p>
          <UIcon :name="chevronIcon" @click="showMore = !showMore"  v-if="isOverflowing" />
        </div>
        <UBadge class="hidden md:block"
          v-show= "
            props.transaction.category && props.transaction.category !== ''
          "
          color="white"
          >{{ props.transaction.category }}</UBadge
        >
      </div>

      <TransactionUpdateModal
        :transaction="props.transaction"
        v-model="updateModalIsOpen"
        @closeModal="updateModalIsOpen = false"
        @updated="updated"
      />

      <div class="flex justify-between md:justify-end space-x-2 items-center  w-full md:w-fit">
        <div>{{ currency }}</div>
        <div>
          <UDropdown :items="items" :popper="{ placement: 'bottom-start' }" class="button">
            <UButton
              color="white"
              class="button"
              variant="ghost"
              trailing-icon="i-heroicons-chevron-down-20-solid"
              :loading="isLoading"
            />
          </UDropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
console.log(useScreensize().value )
const {isMobile, size}= useScreensize();
console.log( isMobile.value, size.value)
const toast = useToast();
const supabase = useSupabaseClient();
const updateModalIsOpen = ref(false);
const showMore = ref(false);
const descriptionRef = ref(null);
const isOverflowing = ref(false);
const showTransactionType = ref(false);

const props = defineProps({
  transaction: Object,
  currencyType: String,
});

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
const isOther= computed(() => {
  return props.transaction.type.toLowerCase() === "other";
});

const transactionType = computed(() => {
  if (isIncome.value) return "income";
  if (isExpense.value) return "expense";
  if (isInvestment.value) return "investment";
  if (isSavings.value) return "savings";
  if(isOther.value) return "other";
});

const icon = computed(() => {
  switch (transactionType.value) {
    case "income":
      return "mdi:dollar";
    case "expense":
      return "mdi:credit-card";
    case "investment":
      return "mdi:bank";
    case "savings":
      return "mdi:piggy-bank";
      case "other":
        return "mdi:dots-horizontal-circle-outline";
    default:
      return " ";
  }
});

const iconColor = computed(() => {
  switch (transactionType.value) {
    case "income":
      return "text-highlight-green";
    case "expense":
      return "text-highlight-pink";
    case "investment":
      return "text-highlight-blue";
    case "savings":
      return "text-highlight-purple";
      case "other":
        return "text-default-text";
    default:
      return " ";
  }
});

const chevronIcon = computed(() => {
  return showMore.value
    ? "i-heroicons-chevron-up-20-solid"
    : "i-heroicons-chevron-down-20-solid";
});

const currency = computed(() => {
  return new Intl.NumberFormat("en-In", {
    style: "currency",
    currency: props.currencyType || "USD",
  }).format(
    isRef(props.transaction.amount)
      ? props.transaction.amount.value
      : props.transaction.amount
  );
});

const checkOverflow = () => {
  const element = descriptionRef.value;
  if (element) {
    isOverflowing.value = element.scrollWidth > element.clientWidth;
  }
};

onMounted(() => {
checkOverflow();
});

watch(showMore, (newValue, oldValue) => {
  console.log(`showMore changed from ${oldValue} to ${newValue}`);
  checkOverflow();
});

</script>

<style lang="scss" scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.showing {
  overflow: visible;
  white-space: wrap;
}
</style>