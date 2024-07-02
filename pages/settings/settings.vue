<template>
  <UForm
    :state="state"
    :schema="schema"
    @submit="saveSettings"
    class="space-y-7"
  >
    <UFormGroup
      label="Transaction View"
      class="mb-4"
      help="Choose how you would like to view transactions"
    />
    <USelect
      v-model="state.transactionView"
      :options="transactionViewOptions"
    />

    <UFormGroup
      label="Currency View"
      class="mb-4"
      help="Choose your default currency"
    />
    <USelect v-model="state.currencyView" :options="currencyOptions" />
    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"

    />
  </UForm>
</template>

<script setup>
import { z } from "zod";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();

import { transactionViewOptions, currencyOptions } from "~/constants";

const pending = ref(false);

const state = ref({
  transactionView:
    user.value.user_metadata?.transactionView ?? transactionViewOptions[1],
  currencyView: user.value.user_metadata?.currencyView ?? currencyOptions[0],
});

const schema = z.object({
  transactionView: z.enum(transactionViewOptions),
  currencyView: z.enum(currencyOptions),
});

const saveSettings = async () => {
  pending.value = true;
  try {
    const { error } = await supabase.auth.updateUser({
      
      data: {
        transactionView: state.value.transactionView,
        currencyView: state.value.currencyView,
      },
   
    });
    if (error) throw error;
    toastSuccess({
      title: "Settings updated",
    });
  } catch (error) {
    toastError({
      title: "Error updating settings",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};

</script>
