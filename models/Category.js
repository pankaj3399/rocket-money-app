import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a category name"],
    trim: true,
  },
  color: {
    type: String,
    required: [true, "Please provide a color"],
    default: "#000000",
  },
  budget: {
    type: Number,
    required: [true, "Please provide a budget amount"],
    default: 0,
    min: [0, "Budget cannot be negative"],
  },
  spent: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Spent amount cannot be negative"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
categorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add index for better query performance
categorySchema.index({ user: 1 });
categorySchema.index({ user: 1, name: 1 });

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
