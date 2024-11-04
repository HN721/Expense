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

  update: async (req, res) => {
    const transaksi = await Transaction.findById(req.params.id);
    if (transaksi && transaksi.user.toString() === req.user.toString()) {
      transaksi.type = req.body.type || transaksi.type;
      transaksi.category = req.body.category || transaksi.category;
      transaksi.amount = req.body.amount || transaksi.amount;
      transaksi.date = req.body.date || transaksi.date;
      transaksi.description = req.body.description || transaksi.description;
      //update
      const updateTransaksi = await transaksi.save();
      res.json(updateTransaksi);
    }
  },
  delete: async (req, res) => {
    const transaksi = await Transaction.findById(req.params.id);
    if (transaksi && transaksi.user.toString() === req.user.toString()) {
      await Transaction.findByIdAndDelete(req.params.id);
      res.json({ message: "Trnasaki Dihapus" });
    }
  },
};

module.exports = transactionController;
