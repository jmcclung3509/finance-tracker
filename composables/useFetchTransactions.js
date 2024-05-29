export const useFetchTransactions = () => {
  const transactions = ref([]);
  const isPending = ref(false);
  const supabase = useSupabaseClient();

  const income = computed(() => {
    return transactions.value.filter((t) => t.type.toLowerCase() === "income");
  });

  const expense = computed(() => {
    if (!transactions.value.length) return [];
    return transactions.value.filter((t) => t.type.toLowerCase() === "expense");
  });

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);

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

  const fetchTransactions = async () => {
    isPending.value = true;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select()
        .order("created_at", { ascending: false });
      if (error) return [];

      return (transactions.value = data);
    } catch (error) {
      console.error(error);
    } finally {
      isPending.value = false;
    }
  };

  const refreshTransactions = async () => {
    return (transactions.value = await fetchTransactions());
  };

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
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount,
    },
    refreshTransactions,
    isPending,
  };
};
