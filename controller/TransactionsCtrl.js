const Transaction = require("../model/Transaction");

const transactionController = {
  create: async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if (!amount || !type || !date)
      throw new Error("Name and type are required");
    //create transaksi
    const transaksi = await Transaction.create({
      user: req.user,
      type,
      category,
      amount,
      description,
    });
    res.status(201).json(transaksi);
  },
  list: async (req, res) => {
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
        //no category filter needed when filtering
      } else if (category === "Uncategorized") {
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }
    const transaksis = await Transaction.find(filters).sort({ date: -1 });
    res.json(transaksis);
  },

  update: async (req, res) => {},
  delete: async (req, res) => {},
};

module.exports = transactionController;
