<template>
  <UCard v-if="!success">
    <template #header> Sign-in to Finance Tracker </template>
    <form @submit.prevent="handleLogin">
      <UFormGroup
        label="email"
        name="email"
        :required="true"
        class="mb-4"
        help="You will receive an email with the confirmation link"
      >
        <UInput
          type="email"
          required
          placeholder="Enter your email"
          v-model="email"
        />
      </UFormGroup>
      <UButton
        type="submit"
        color="black"
        variant="solid"
        label="Sign in"
        :loading="pending"
        :disabled="pending"
        >Sign In</UButton
      >
    </form>
  </UCard>
  <UCard v-else>
    <template #header> Email has been sent </template>
    <div class="space-y-4">
      <p>
        We have sent an email to
        <span class="text-bold-text font-semibold">
          {{ email }}
        </span>
        with a link to sign in.
      </p>
      <p>
        <span class="text-bold-text font-semibold">Important:</span> The link
        will expire in 5 minutes
      </p>
    </div>
  </UCard>
</template>

<script setup>

const success = ref(false);
const email = ref("");
const pending = ref(false);
const { toastError, toastSuccess } = useAppToast();
const supabase = useSupabaseClient();
const redirectUrl = useRuntimeConfig().public.baseUrl;
console.log(redirectUrl, "redirectUrl");

useRedirectIfAuthenticated();

const handleLogin = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${redirectUrl}/confirm`,
      },
    });

    if (error) {
      toastError({
        title: "Error authenticating",
        description: error.message,
      });
    } else {
      success.value = true;
      toastSuccess({
        title: "Email sent",
        description: `We have sent an email to ${email.value} with a link to sign in`,
      });
    }
  } finally {
    pending.value = false;
  }
};
</script>
