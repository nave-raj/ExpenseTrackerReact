const { MongoClient, ObjectId } = require('mongodb');
const IncomeExpense = require("./incomeExpense");

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

async function connect() {    
    try {
        await client.connect();
        console.log("Successfully Connected to MongoDB Server");
    } catch (err) {
        console.error("Connection unsuccessful", err);
    }
}

connect();

const expenseRepository = {
    /* Find all the history of expenses */
    findAll: async () => {
      let incomeExpenseList = [];
      const expenseCollection = client.db('expense_tracker_database').collection('expenses');
      const expenseDataFromDB = expenseCollection.find({});
      for await (const data of expenseDataFromDB) {
        const incomeExpenseObj = new IncomeExpense(data._id.toString(), data.type, data.category, data.description, data.amount);
        incomeExpenseList.push(incomeExpenseObj);
      }
      return incomeExpenseList;
    },
     /* Find an individual income/expense by id */
     findById: async (id) => {
      const expenseCollection = client.db('expense_tracker_database').collection('expenses');
      const filter = { _id: new ObjectId(id) };
      const result = await expenseCollection.findOne(filter);
      return new IncomeExpense(result._id.toString(), result.type, result.category, result.description, result.amount);
  },
}

module.exports = expenseRepository;