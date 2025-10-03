const Expense = require('../models/Expense');

const expenseController = {
  async addExpense(req, res, next) {
    try {
      const { amount, category, date, notes } = req.body;

      const expense = new Expense({
        userId: req.user._id,
        amount,
        category,
        date: date || new Date(),
        notes
      });

      await expense.save();

      res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: {
          expense
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getExpenses(req, res, next) {
    try {
      const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
      
      // Build filter object
      const filter = { userId: req.user._id };
      
      if (category) {
        filter.category = category;
      }
      
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Get expenses with pagination
      const expenses = await Expense.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination info
      const total = await Expense.countDocuments(filter);
      
      res.json({
        success: true,
        data: {
          expenses,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateExpense(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, category, date, notes } = req.body;

      // Find expense and verify ownership
      const expense = await Expense.findOne({ _id: id, userId: req.user._id });
      
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }

      // Update expense
      const updatedExpense = await Expense.findByIdAndUpdate(
        id,
        {
          amount,
          category,
          date,
          notes
        },
        {
          new: true,
          runValidators: true
        }
      );

      res.json({
        success: true,
        message: 'Expense updated successfully',
        data: {
          expense: updatedExpense
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteExpense(req, res, next) {
    try {
      const { id } = req.params;

      // Find expense and verify ownership
      const expense = await Expense.findOne({ _id: id, userId: req.user._id });
      
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }

      await Expense.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Expense deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = expenseController;