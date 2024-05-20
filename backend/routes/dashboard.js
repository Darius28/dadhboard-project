import express from "express";
import { validJwt } from "../middleware";
import {
  addProduct,
  getProduct,
  getProducts,
  getPurchaseOrders,
  placePurchaseOrder,
  updateStockQuantity,
  getPurchaseOrder,
  markPurchaseOrderAsComplete,
  placeSalesOrder,
  getSalesStatus,
  getSalesDeliveryStatus,
  markAsDelivered,
  updateVendorItem,
  setMinMaxStock,
  getTopBarChartData,
  getSalesAndPurchaseData,
  deleteItem,
} from "../controllers/dashboard";
const router = express.Router();

router.post("/add-product", addProduct);
router.post("/get-products", validJwt, getProducts);
router.post("/get-product", validJwt, getProduct);
router.post("/place-purchase-order", validJwt, placePurchaseOrder);
router.post("/get-purchase-orders", validJwt, getPurchaseOrders);
router.post("/update-stock-quantity", validJwt, updateStockQuantity);
router.post("/get-purchase-order", validJwt, getPurchaseOrder);
router.post(
  "/mark-purchase-order-as-complete",
  validJwt,
  markPurchaseOrderAsComplete
);
router.post("/place-sales-order", validJwt, placeSalesOrder);
router.get("/get-sales-status", validJwt, getSalesStatus);
router.post("/get-sales-delivery-status", validJwt, getSalesDeliveryStatus);
router.post("/mark-as-delivered", validJwt, markAsDelivered);
router.post("/update-vendor-item", validJwt, updateVendorItem);
router.post("/set-min-max-stock", validJwt, setMinMaxStock);
router.get("/get-top-bar-chart-data", validJwt, getTopBarChartData);
router.get("/get-sales-and-purchase-data", validJwt, getSalesAndPurchaseData);
router.post("/delete-item", validJwt, deleteItem);

module.exports = router;
