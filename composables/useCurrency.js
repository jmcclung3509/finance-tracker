export const useCurrency = (amount, currencyType) =>{
    const currency = computed(() => {
    return new Intl.NumberFormat("en-In", {
      style: "currency",
      currency: currencyType || "USD",
    }).format(isRef(amount) ? amount.value : amount);
  })
  return currency
  }