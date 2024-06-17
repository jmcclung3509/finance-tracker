<template>
  <div>
    <div class="mb-">
      <UFormGroup
        label="Current Avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
      </UFormGroup>
    </div>
    <div class="mb-4">
      <UFormGroup
        label="New Avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to upload the new Avatar"
      >
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>
    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>


const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();

const uploading = ref(false);
const fileInput = ref(null);

const saveAvatar = async () => {
  const file = fileInput.value.input.files[0];
  if (!file) {
    toastError({
      title: "Select a file to upload first",
    });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  console.log(fileName)


  try {
    uploading.value = true;

    toastSuccess({
      title: "Avatar updated",
    });
  } catch (error) {
    toastError({
      title: "Error updating avatar",
      description: error.message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>
