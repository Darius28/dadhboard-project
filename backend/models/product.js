import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_image: {},
  description: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  updated_by: {
    type: String,
    required: true,
  },
  updated_on: {
    type: String,
    required: true,
  },
  created_user_id: {
    type: String,
    required: true,
  },
  qty_in_stock: {
    type: Number,
    required: true,
  },
  min_stock: {
    type: Number,
  },
  max_stock: {
    type: Number,
  },
  total_sales: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Product", productSchema);
