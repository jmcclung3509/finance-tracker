
  
  export const useSelectedCurrency = (currencyType) => {
    return new Intl.NumberFormat("en-In", {
        style: "currency",
        currency: currencyType || "USD",
  
  });
}
  