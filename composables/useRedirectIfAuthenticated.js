export const useRedirectIfAuthenticated = (url = '/') => {
  const user = useSupabaseUser();
  const router = useRouter();

  watch(
    user,
    (newUser) => {
      console.log('User state changed:', newUser); // Debugging log
      if (newUser) {
        router.push(url);
      }
    },
    { immediate: true }
  );

  return { user };
};