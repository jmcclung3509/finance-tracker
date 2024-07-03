export const useScreensize = () => {
    const windowWidth = ref(0);
    const isMobile = ref(false);
    const size = ref(null);
  
    const handleResize = () => {
      windowWidth.value = window.innerWidth;
      isMobile.value = windowWidth.value <= 768;
  
      if (windowWidth.value < 768) {
        size.value = 'sm';
      } else if (windowWidth.value < 1024) {
        size.value = 'md';
      } else if (windowWidth.value < 1280) {
        size.value = 'lg';
      } else {
        size.value = 'default';
      }
    };
  
    onMounted(() => {
      window.addEventListener('resize', handleResize);
      handleResize();
    });
  
    return { isMobile, handleResize, size };
  };