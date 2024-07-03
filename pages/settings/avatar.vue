<template>
  <div>
    <div class="mb-">
      <UFormGroup
        label="Current Avatar"
        class="w-full"
        help="This would be blank by default"
      >{{ url }}
        <UAvatar :src="url" />
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
const { url } = useAvatarUrl();




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

  const fileExt = file.name.split(".").pop().toLowerCase();
  const fileName = `${Math.random()}.${fileExt}`;

  try {
    uploading.value = true;
    //Get the current avatar url
    const currentAvatarUrl = user.value.user_metadata.avatar_url 
    //Upload the image to avatar bucket
    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    //Update the user metadata with the  avatar url
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });
    //Delete the old avatar file
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from("avatars")
        .remove([currentAvatarUrl]);
      if (error) throw error;
    }

    //Reset the file input
    fileInput.value.input.value = null;

    if (error) throw error;

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
