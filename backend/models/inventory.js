import mongoose from "mongoose";
const { Schema } = mongoose;

const inventorySchema = new Schema({
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
  status: {
    type: String,
  },
  updated_on: {
    type: Date,
  },
  updated_by: {
    type: String,
  },
});

export default mongoose.model("Inventory", inventorySchema);
