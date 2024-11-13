const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

const categoryController = {
  create: async (req, res) => {
    try {
      const { name, type } = req.body;
      if (!name || !type) throw new Error("Name and type required");
      const normalizeName = name.toLowerCase();

      // Check if type is valid
      const validTypes = ["income", "expense"];
      if (!validTypes.includes(type.toLowerCase())) {
        throw new Error("Invalid category type: " + type);
      }

      // Check if category already exists for the user
      const categoryExists = await Category.findOne({
        name: normalizeName,
        user: req.user,
      });
      if (categoryExists) {
        throw new Error(
          `Category ${categoryExists.name} already exists in the database`
        );
      }

      const category = await Category.create({
        name: normalizeName,
        user: req.user,
        type,
      });
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  list: async (req, res) => {
    try {
      const categories = await Category.find({ user: req.user });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { type, name } = req.body;
      const normalizeName = name ? name.toLowerCase() : undefined;

      const category = await Category.findById(categoryId);
      if (!category || category.user.toString() !== req.user.toString()) {
        throw new Error("Category not found or unauthorized access");
      }

      const oldName = category.name;
      // Update category properties
      category.name = normalizeName || category.name;
      category.type = type || category.type;
      const updatedCategory = await category.save();

      // Update affected transactions
      if (oldName !== updatedCategory.name) {
        await Transaction.updateMany(
          { user: req.user, category: oldName },
          { $set: { category: updatedCategory.name } }
        );
      }
      res.json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (category && category.user.toString() === req.user.toString()) {
        const defaultCategory = "Uncategorized";
        await Transaction.updateMany(
          { user: req.user, category: category._id },
          { $set: { category: defaultCategory } }
        );
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category removed and transactions updated" });
      } else {
        res
          .status(404)
          .json({ message: "Category not found or unauthorized access" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = categoryController;
