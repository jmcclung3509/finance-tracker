<template>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex justify-between">
          <h3>Add transaction</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal()"
          />
        </div>
      </template>
      <UForm
        :state="state"
        :schema="schema"
        ref="form"
        @submit.prevent="save"
        class="p-4"
      >
        <!-- name same as the column name in the database -->
        <UFormGroup
          label="Transaction Type"
          :required="true"
          name="type"
          class="mb-4"
        >
          <USelect
            v-model="state.type"
            :options="transactionTypes"
            placeholder="Select the transaction type"
          />
        </UFormGroup>
        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>
        <UFormGroup
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>
        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput
            type="description"
            placeholder="Description"
            v-model="state.description"
          />
        </UFormGroup>
        <UFormGroup
          v-if="state.type === 'Expense'"
          label="Category"
          :required="true"
          name="category"
          class="mb-4"
        >
          <USelect
            v-model="state.category"
            :options="categories"
            placeholder="Category"
          />
        </UFormGroup>
      </UForm>
      <UButton
        @click="save"
        type="submit"
        color="green"
        class="w-fit"
        label="Save"
        :loading="isLoading"
      />
    </UCard>
  </UModal>
</template>

<script setup>
import { categories, transactionTypes } from "~/constants";
import { z } from "zod";

const props = defineProps({
  modalValue: Boolean,
});

const emit = defineEmits(["update:modalValue", "closeModal", "saved"]);

const data = reactive({
  isOpen: false,
});
const supabase = useSupabaseClient();
const {toastError, toastSuccess} = useAppToast();
const form = ref();
const isLoading = ref(false);

const initialState = {
  type: "Income",
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};
const state = ref({ ...initialState });

const resetState = () => {
  Object.assign(state.value, initialState);
  form.value.clear();
};

const save = async () => {
  if (form.value.errors.length) return;
  isLoading.value = true;
  //store into SupaBase
  try {
    const { error } = await supabase
      .from("transactions")
      .upsert({ ...state.value });
    if (!error) {
      toastSuccess({
        title: "Transaction added",
      });
      isOpen.value = false;
      emit("saved");
      return;
    }
    throw error;
  } catch (e) {
    toastError({
      title: "Transaction not saved",
      description: "An error occurred while saving the transaction",
    });
  } finally {
    isLoading.value = false;
  }
};

const defaultSchema = z.object({
  amount: z.number().positive("Needs to be a positive number"),
  created_at: z.string(),
  description: z.string().optional(),
});

const incomeSchema = z.object({
  type: z.literal("Income"),
});

const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});

const savingsSchema = z.object({
  type: z.literal("Savings"),
});

const investmentSchema = z.object({
  type: z.literal("Investment"),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    savingsSchema,
    investmentSchema,
  ]),
  defaultSchema
);

const isOpen = computed({
  get: () => props.modalValue,
  set: (value) => {
    if (!value) resetState();
    emit("update:modalValue", value);
  },
});

const closeModal = () => {
  data.isOpen = false;
  resetState();
  emit("closeModal", data.isOpen);
};
</script>
