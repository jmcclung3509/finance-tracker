import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdW1jbnhva2R1eGJocHp6cmVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTg4NDkwMywiZXhwIjoyMDMxNDYwOTAzfQ.BBKGehYkr4XOQNYzF-mzx9qnFJIwTx47CjLvCQYOkxU",
  {
    auth: { persistSession: false },
  }
);

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "House",
  "Entertainment",
  "Health",
  "Education",
  "Childcare",
  "Insurance",
  "Other",
];

const {
  data: { users },
  error,
} = await supabase.auth.admin.listUsers();


const usersId = users.map((user) => user.id);


  async function seedTransactions() {
    //delete all existing transactions
    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .gte("id", 0);
    if (deleteError) {
      console.error("Error deleting transactions", deleteError);
      return;
    }
    let transactions = [];
    for (const user of usersId) {
    // Generate transactions for the last two years
    for (
      let year = new Date().getFullYear();
      year > new Date().getFullYear() - 2;
      year--
    ) {
      for (let i = 0; i < 10; i++) {
        const date = new Date(
          year,
          faker.number.int({ min: 0, max: 11 }),
          faker.number.int({ min: 1, max: 28 })
        );

        let type, category;
        const typeBias = Math.random();
        if (typeBias < 0.75) {
          type = "Expense";
          category = faker.helpers.arrayElement(categories);
        } else if (typeBias < 0.85) {
          type = "Income";
        } else {
          type = faker.helpers.arrayElement(["Savings", "Investment", "Other"]);
        }
        let amount;
        switch (type) {
          case "Income":
            amount = faker.number.int({ min: 200, max: 5000 });
            break;
          case "Expense":
            amount = faker.number.int({ min: 10, max: 2000 });
            break;
          case "Savings":
          case "Investment":
          case "Other":
            amount = faker.number.int({ min: 50, max: 500 });
            break;

          default:
            amount = 0;
        }
        transactions.push({
          created_at: date,
          amount,
          type,
          description: faker.lorem.sentence(),
          category: type === "Expense" ? category : null,
          user_id: user,
        });
      }
    }
  }
  const { error: insertError } = await supabase
    .from("transactions")
    .upsert(transactions);

  if (insertError) {
    console.error("Error inserting data:", insertError);
  } else {
    console.log("Data inserted successfully");
  }
}
seedTransactions().catch(console.error);
