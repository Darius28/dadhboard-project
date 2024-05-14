import mongoose from "mongoose";
const { Schema } = mongoose;

const purchaseOrderSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  purchase_date: {
    type: String,
  },
  delivery_date: {
    type: String,
  },
  updated_on: {
    type: String,
    required: true,
  },
  updated_by: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  product_image: {},
  description: {
    type: String,
    required: true,
  },
  vendor_name: {
    type: String,
  },
  vendor_address: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);
