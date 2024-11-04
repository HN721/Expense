const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

const categoryController = {
  create: async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) throw new Error("Name and type required");
    const normalizeName = name.toLowerCase();
    //chacek if type is valid
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid category type" + type);
    }
    //check if category already exits on the user
    const categoryExits = await Category.findOne({
      name: normalizeName,
      user: req.user,
    });
    if (categoryExits) {
      throw new Error(
        `Category ${categoryExits.name} already exits in the database`
      );
    }
    const category = await Category.create({
      name: normalizeName,
      user: req.user,
      type,
    });
    res.status(201).json(category);
  },

  list: async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  },

  update: async (req, res) => {
    const { categoryId } = req.params;
    const { type, name } = req.body;
    const normalizeName = name.toLowerCase();
    const category = await Category.findById(categoryId);
    if (!category && category.user.toString() !== req.user.toString()) {
      throw new Error("category not found");
    }

    const oldName = category.name;
    //update categories propertis
    category.name = normalizeName || category.name;
    category.type = type || category.type;
    const updateCategory = await category.save();
    //update affected transaksi
    if (oldName !== updateCategory.name) {
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName,
        },
        { $set: { category: updateCategory.name } }
      );
    }
    res.json(updateCategory);
  },
  delete: async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category && category.user.toString() === req.user.toString()) {
      const defaultCategory = "Uncategorized";
      await Transaction.updateMany(
        { user: req.user, category: category._id },
        { $set: { category: defaultCategory } }
      );
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category removed and transaksi updated" });
    } else {
      res.json({ message: "Categorynit founf" });
    }
  },
};

module.exports = categoryController;
