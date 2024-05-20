import Product from "../models/product";
import PurchaseOrder from "../models/purchaseOrder";
import SalesOrder from "../models/salesOrder";
import User from "../models/user";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const addProduct = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const {
      productName,
      productImage,
      description,
      cost,
      stock,
      updatedBy,
      updatedOn,
      createdUserId,
    } = req.body;
    if (!productImage) return res.status(400).send("No Image");

    var uploadedImgUrl;

    const S3Upload = () => {
      return new Promise((resolve, reject) => {
        const base64Data = new Buffer.from(
          productImage.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        const type = productImage.split(";")[0].split("/")[1];

        const params = {
          Bucket: "product-image-2-bucket",
          Key: `${nanoid()}.${type}`,
          Body: base64Data,
          ACL: "public-read",
          ContentEncoding: "base64",
          ContentType: `image/${type}`,
        };

        S3.upload(params, async (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
            return res.sendStatus(400);
          }
          if (data) {
            console.log("data added");
            uploadedImgUrl = data;
            resolve();
          }
        });
      });
    };

    S3Upload()
      .then(async () => {
        new Product({
          product_name: productName,
          product_image: uploadedImgUrl,
          description,
          cost,
          stock,
          updated_by: updatedBy,
          updated_on: updatedOn,
          created_user_id: createdUserId,
          qty_in_stock: 0,
          total_sales: 0,
        }).save();
        res.json({ ok: true });
      })
      .catch((err) => console.log("promise error: ", err));
  } catch (err) {
    console.log(err);
  }
};

export const getProducts = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  const { vendorId, vendorCategory } = req.body;
  console.log(vendorId);

  try {
    var productsData;
    if (vendorCategory === "user") {
      productsData = await Product.find();
    } else {
      productsData = await Product.find({
        created_user_id: vendorId,
      });
    }

    console.log("getProducts: ", productsData);
    res.send(productsData);
  } catch (err) {
    console.log(err);
  }
};

export const getProduct = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { productId } = req.body;
    const product = await Product.findOne({
      _id: productId,
    });
    res.send({ product });
    console.log("user found: ", product);
  } catch (err) {
    console.log(err);
  }
};

export const placePurchaseOrder = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const {
      userId,
      userName,
      productId,
      quantity,
      cost,
      purchaseDate,
      deliveryDate,
      updatedOn,
      updatedBy,
      status,
      productName,
      productImage,
      description,
      oldStock,
    } = req.body;

    const productId2 = await Product.findOne({
      _id: productId,
    });

    console.log("productId2: ", productId2);

    const vendorDetails = await User.findOne(
      {
        _id: productId2.created_user_id,
      },
      {
        name: 1,
        address: 1,
      }
    );

    console.log("vendorDetails: ", vendorDetails);

    const data = await new PurchaseOrder({
      user_id: userId,
      user_name: userName,
      product_id: productId,
      quantity,
      cost,
      purchase_date: purchaseDate,
      delivery_date: deliveryDate,
      updated_on: updatedOn,
      updated_by: updatedBy,
      status,
      product_name: productName,
      product_image: productImage,
      description,
      vendor_name: vendorDetails.name,
      vendor_address: vendorDetails.address,
      total_sales: 0,
    }).save();

    const update = await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $set: {
          stock: oldStock - quantity,
          updated_by: userName,
          updated_on: updatedOn,
        },
      }
    );

    console.log(req.body);
    res.send({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const getPurchaseOrders = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { userId } = req.body;
    const data = await PurchaseOrder.find({
      user_id: userId,
    });
    console.log("get purchase order: ", data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

export const updateStockQuantity = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { userName, productId, newStock, updatedOn } = req.body;

    const update = await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $set: {
          updated_by: userName,
          updated_on: updatedOn,
        },
        $inc: {
          stock: newStock,
        },
      }
    );
    res.send({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const getPurchaseOrder = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { productId } = req.body;
    const data = await PurchaseOrder.findOne({
      _id: productId,
    });
    console.log("getPurchaseOrder: ", data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

export const markPurchaseOrderAsComplete = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { productId, userName, updatedOn, quantity, itemId } = req.body;
    console.log("quantity: ", quantity);

    await PurchaseOrder.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $set: {
          status: "Completed",
          updated_by: userName,
          updated_on: updatedOn,
          delivery_date: updatedOn,
        },
      }
    );
    await Product.findOneAndUpdate(
      {
        _id: itemId,
      },
      {
        $inc: {
          qty_in_stock: quantity,
        },
      }
    );
    res.send({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const placeSalesOrder = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const {
      productId,
      productName,
      productImage,
      description,
      quantity,
      salePrice,
      customerName,
      customerAddress,
      deliveryDate,
      updatedOn,
      updatedBy,
      status,
    } = req.body;

    const productQtyUpdate = await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $inc: {
          qty_in_stock: -quantity,
          total_sales: quantity,
        },
      }
    );

    const newSalesOrder = await new SalesOrder({
      product_id: productId,
      product_name: productName,
      product_image: productImage,
      description,
      quantity,
      sale_price: salePrice,
      customer_name: customerName,
      customer_address: customerAddress,
      delivery_date: deliveryDate,
      updated_on: updatedOn,
      updated_by: updatedBy,
      status,
    }).save();

    res.send({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const getSalesStatus = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const data = await SalesOrder.find();
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

export const getSalesDeliveryStatus = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { productId } = req.body;
    const data = await SalesOrder.findOne({
      _id: productId,
    });
    console.log("getSalesDeliveryStatus", data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

export const markAsDelivered = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { itemId, deliveryDate } = req.body;
    console.log("MAD", itemId, deliveryDate);
    await SalesOrder.findByIdAndUpdate(
      {
        _id: itemId,
      },
      {
        $set: {
          delivery_date: deliveryDate,
          status: "Completed",
        },
      }
    );
    res.send({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const updateVendorItem = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { varsToModify, itemId } = req.body;
    console.log(varsToModify);

    const setObj = {};
    varsToModify.forEach((update) => {
      setObj[update.field] = update.value;
    });

    await Product.findByIdAndUpdate(
      {
        _id: itemId,
      },
      {
        $set: setObj,
      }
    );
    res.send({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const setMinMaxStock = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { itemId, min, max } = req.body;

    const data = await Product.findOneAndUpdate(
      {
        _id: itemId,
      },
      {
        $set: {
          min_stock: min,
          max_stock: max,
        },
      }
    );
    res.send({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const getTopBarChartData = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const data = await Product.find(
      {},
      {
        total_sales: 1,
        product_name: 1,
      }
    );
    const top5 = data.sort((a, b) => b.total_sales - a.total_sales).slice(0, 5);

    const top5WithData = top5.map((item) => {
      console.log("top 5 item: ", item);
      return {
        product_name: item.product_name,
        total_sales: item.total_sales,
      };
    });
    res.send(top5WithData);
  } catch (err) {
    console.log(err);
  }
};

export const getSalesAndPurchaseData = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const purchaseOrderData = await PurchaseOrder.find();
    const salesOrderData = await SalesOrder.find();

    const purchaseOrderSalesByMonth = {};
    const salesOrderSalesByMonth = {};

    purchaseOrderData.forEach((sale) => {
      if (sale.delivery_date !== "To be updated") {
        const [day, month, year] = sale.delivery_date.split("/").map(Number);
        const deliveryDate = new Date(year, month - 1, day); // Months are 0-indexed in JavaScript

        const monthName = deliveryDate.toLocaleString("default", {
          month: "long",
        });
        if (!purchaseOrderSalesByMonth[monthName]) {
          purchaseOrderSalesByMonth[monthName] = 0;
        }
        purchaseOrderSalesByMonth[monthName] += sale.quantity;
      }
    });

    salesOrderData.forEach((sale) => {
      if (sale.delivery_date !== "To be updated") {
        const [day, month, year] = sale.delivery_date.split("/").map(Number);
        const deliveryDate = new Date(year, month - 1, day); // Months are 0-indexed in JavaScript

        const monthName = deliveryDate.toLocaleString("default", {
          month: "long",
        });
        if (!salesOrderSalesByMonth[monthName]) {
          salesOrderSalesByMonth[monthName] = 0;
        }
        salesOrderSalesByMonth[monthName] += sale.quantity;
      }
    });

    res.send({ purchaseOrderSalesByMonth, salesOrderSalesByMonth });
  } catch (err) {
    console.log(err);
  }
};

export const deleteItem = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const { itemId } = req.body;
    await Product.deleteOne({
      _id: itemId,
    });
    res.send({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const searchItem = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const { search } = req.body;
    console.log("SEARCH ====>: ", search);
    const data = await Product.find({
      product_name: { $regex: search, $options: "i" },
    });
    res.send(data);
    console.log("SEARCH DATA =====> ", data);
  } catch (err) {
    console.log(err);
  }
};
