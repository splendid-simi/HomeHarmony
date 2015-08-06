var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseSchema = new Schema({
  expenseId: Number
  expenseName: String,
  description: String,
  cost: Number,
  dueDate: Date,
  repeat: { type: Number, default: -1 }
});

var Expense = mongoose.model('Expense', schema);
