export const useAvatarUrl = (userId) => {
  //Get current user metadata-which contains the avatar url

  //Get public url of that image from supabase storage

  //Watch user for any changes so we always display the latest avatar

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const getPublicUrl = () => {
    if (!user.value?.user_metadata?.avatar_url) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl("generic_avatar.png");
        return data.publicUrl;
    } else {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(user.value?.user_metadata?.avatar_url);
      return data.publicUrl;
    }
  };

  const url = ref(getPublicUrl());
  watch(user, () => (url.value = getPublicUrl()), { immediate: true });

  return { url };
};
