export const useFetchTransactions = (period) => {
  const transactions = ref([]);
  const isPending = ref(false);
  const supabase = useSupabaseClient();

  const income = computed(() => {
    if (!transactions.value.length) return [];
    return transactions.value.filter((t) => t.type.toLowerCase() === "income");
  });

  const expense = computed(() => {
    if (!transactions.value.length) return [];
    return transactions.value.filter((t) => t.type.toLowerCase() === "expense");
  });
  const investment = computed(() => {
    if (!transactions.value.length) return [];
    return transactions.value.filter((t) => t.type.toLowerCase() === "investment");
  });

  const savings= computed(() => {
    if (!transactions.value.length) return [];
    return transactions.value.filter((t) => t.type.toLowerCase() === "savings");
  });


  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);
  const investmentCount = computed(() => investment.value.length);
  const savingsCount = computed(() => savings.value.length);

  const incomeTotal = computed(() => {
    return income.value.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  });

  const expenseTotal = computed(() => {
    return expense.value.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  });

  const investmentTotal = computed(() => {
    return investment.value.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  });

  const savingsTotal = computed(() => {
    return savings.value.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  });


  const fetchTransactions = async () => {
    isPending.value = true;
    try {
      const { data } = await useAsyncData(
        `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from("transactions")
            .select()
            .gte("created_at", period.value.from.toISOString())
            .lte("created_at", period.value.to.toISOString())
            .order("created_at", { ascending: false });
          if (error) return [];

          return data;
        }
      );
      return data.value;
    } finally {
      isPending.value = false;
    }
  };

  const refreshTransactions = async () => {
    return (transactions.value = await fetchTransactions());
  };

  watch(period, async () => await refreshTransactions(), { immediate: true });

  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      let date = new Date(transaction.created_at);
      date =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(transaction);
    }
    //How to sort on the frontend by date
    // const sortedKeys = Object.keys(grouped).sort().reverse()
    // console.log(sortedKeys, 'sortedKeys')
    // const sortedGroup = {}
    // for (const key of sortedKeys){
    //     sortedGroup[key] = grouped[key]
    //     console.log(sortedGroup[key], 'sortedGroup')

    // }
    // return sortedGroup
    return grouped;
  });
  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      investment,
      savings,
      incomeTotal,
      expenseTotal,
      investmentTotal,
      savingsTotal,
      incomeCount,
      expenseCount,
      investmentCount,
      savingsCount,
    },
    refreshTransactions,
    isPending,
  };
};
