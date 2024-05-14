import mongoose from "mongoose";
const { Schema } = mongoose;

const salesOrderSchema = new Schema({
  product_id: {
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
  quantity: {
    type: Number,
    required: true,
  },
  sale_price: {
    type: Number,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  customer_address: {
    type: String,
    required: true,
  },
  delivery_date: {
    type: String,
    required: true,
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
});

export default mongoose.model("SalesOrder", salesOrderSchema);
