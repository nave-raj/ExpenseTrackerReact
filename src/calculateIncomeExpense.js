 /* to calculate income and expense from all the entries */
 const expenseRepository = require('../src/repository');
 
 const calculateIncomeExpense = {
    calculate: async() => {
        try {
            const allEntries = await expenseRepository.findAll();
            let totalIncome = 0;
            let totalExpense = 0;
            
            // Iterate through each entry
            allEntries.forEach(entry => {
                if (entry.type === 'income') {
                totalIncome += parseFloat(entry.amount);
                } else if (entry.type === 'expense') {
                totalExpense += parseFloat(entry.amount);
                }
            });
            console.log('inside calc');
            console.log(totalExpense);
            return { totalIncome: totalIncome, totalExpense: totalExpense };
        } catch (error) {
            console.error('Error calculating income and expense:', error);
        }
    }
}

module.exports = calculateIncomeExpense;