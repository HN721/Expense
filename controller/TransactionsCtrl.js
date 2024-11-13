const Transaction = require("../model/Transaction");

const transactionController = {
  create: async (req, res) => {
    try {
      const { type, category, amount, date, description } = req.body;
      if (!amount || !type || !date) {
        throw new Error("Amount, type, and date are required");
      }

      // Create transaction
      const transaksi = await Transaction.create({
        user: req.user,
        type,
        category,
        amount,
        date,
        description,
      });
      res.status(201).json(transaksi);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  list: async (req, res) => {
    try {
      const { startDate, endDate, type, category } = req.query;
      let filters = {
        user: req.user,
      };

      if (startDate) {
        filters.date = { ...filters.date, $gte: new Date(startDate) };
      }
      if (endDate) {
        filters.date = { ...filters.date, $lte: new Date(endDate) };
      }
      if (type) {
        filters.type = type;
      }
      if (category) {
        if (category === "All") {
          // No category filter needed for "All"
        } else if (category === "Uncategorized") {
          filters.category = "Uncategorized";
        } else {
          filters.category = category;
        }
      }

      const transaksis = await Transaction.find(filters).sort({ date: -1 });
      res.json(transaksis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const transaksi = await Transaction.findById(req.params.id);
      if (transaksi && transaksi.user.toString() === req.user.toString()) {
        transaksi.type = req.body.type || transaksi.type;
        transaksi.category = req.body.category || transaksi.category;
        transaksi.amount = req.body.amount || transaksi.amount;
        transaksi.date = req.body.date || transaksi.date;
        transaksi.description = req.body.description || transaksi.description;

        // Save updated transaction
        const updatedTransaksi = await transaksi.save();
        res.json(updatedTransaksi);
      } else {
        res
          .status(404)
          .json({ message: "Transaction not found or unauthorized access" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const transaksi = await Transaction.findById(req.params.id);
      if (transaksi && transaksi.user.toString() === req.user.toString()) {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted" });
      } else {
        res
          .status(404)
          .json({ message: "Transaction not found or unauthorized access" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = transactionController;
