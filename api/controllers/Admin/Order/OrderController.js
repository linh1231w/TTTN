const Order = require('../../../models/Order/Order');
const OrderItem = require('../../../models/Order/OrderItem');
const Product = require('../../../models/Product/Product');
const sequelize = require('../../../models/database');
const CryptoJS = require('crypto-js');
const { Op } = require('sequelize');
const moment = require('moment');
const axios = require('axios');
const configs = require('../../../config/config');
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

exports.createOrder = async (req, res) => {
  try {
    const {  
      customerName, 
      customerEmail, 
      customerPhone, 
      items, 
      totalAmount, 
      paymentMethod, 
      shippingAddress 
    } = req.body;
    // Tạo đơn hàng tạm thời (không lưu vào database)
    const tempOrder = {
      customerName, 
      customerEmail, 
      customerPhone, 
      shippingAddress, 
      totalAmount,
      paymentMethod,
      status: 'pending',
      items
    };

    if (paymentMethod === 'cod') {
      // Xử lý thanh toán COD
      try {
        // Tạo đơn hàng trong database
        const newOrder = await Order.create({
          customerName,
          customerEmail,
          customerPhone,
          totalAmount,
          paymentMethod,
          status: 'Pending cod',
          shippingAddress
        });

        for (const item of items) {
          await OrderItem.create({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          });
        }

        res.status(200).json({
          message: 'COD order created successfully',
          orderId: newOrder.id,
       
          checkoutUrl: `${configs.frontendUrl}/checkout`,
          backendUrl: `${configs.backendUrl}/order` 
        });
      } catch (error) {
        console.error('COD order creation error:', error);
        res.status(500).json({
          message: 'Error creating COD order',
          checkoutUrl: `${configs.frontendUrl}/checkout`,
          backendUrl: `${configs.backendUrl}/order`
        });
      }
    } else if (paymentMethod === 'zalopay') {
      const embed_data = JSON.stringify({
        redirecturl: `${configs.frontendUrl}`, // Frontend URL// Backend URL
      });
      const itemsJson = JSON.stringify(tempOrder.items);
      const transID = Math.floor(Math.random() * 1000000);
      const order_data = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${config.app_id}_${transID}`,
        app_user: customerEmail,
        app_time: Date.now(),
        item: itemsJson,
        embed_data: embed_data,
        amount: totalAmount,
        callback_url:'https://97b2-115-75-223-147.ngrok-free.app/api/order/callback',
        description: `Thanh toán đơn hàng`,
        bank_code: "",
      };

      const data = config.app_id + "|" + order_data.app_trans_id + "|" + order_data.app_user + "|" + order_data.amount + "|" + order_data.app_time + "|" + order_data.embed_data + "|" + order_data.item;
      order_data.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      console.log('ZaloPay request data:', order_data);
      try {
        const zaloPayResponse = await axios.post(config.endpoint, null, { params: order_data });
        console.log('ZaloPay response:', zaloPayResponse.data);
        
        if (zaloPayResponse.data.return_code === 1) {

          const newOrder = await Order.create({
            customerName,
            customerEmail,
            customerPhone,
            totalAmount,
            paymentMethod,
            status: 'pending',
            shippingAddress,
            zaloPayTransId: order_data.app_trans_id
          });

          // Tạo các mục đơn hàng
          for (let item of items) {
            // Kiểm tra sự tồn tại của sản phẩm
            const product = await Product.findByPk(item.productId);
            if (!product) {
              throw new Error(`Product with id ${item.productId} not found`);
            }
            // Tạo mục đơn hàng
            await OrderItem.create({
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: product.price
            });
          }
          
          // Move error handling outside the loop
         

          res.status(200).json({ 
            orderId: order_data.app_trans_id,
            redirectUrl: zaloPayResponse.data.order_url,
            data:data,
            mac: order_data.mac
          });
        } else {
          // Có lỗi khi khởi tạo thanh toán
          res.status(400).json({ 
            message: 'Error initializing ZaloPay payment',
            checkoutUrl: `${configs.frontendUrl}/checkout`,
            backendUrl: `${configs.backendUrl}/order`
          });
        }
      } catch (error) {
        console.error('ZaloPay API error:', error);
        res.status(500).json({ 
          message: 'Error creating ZaloPay order',
          checkoutUrl: `${configs.frontendUrl}/checkout`,
          backendUrl: `${configs.backendUrl}/order`
        });
      }
    } else {
      // Xử lý các phương thức thanh toán khác ở đây
      res.status(400).json({ 
        message: 'Unsupported payment method',
        checkoutUrl: `${configs.frontendUrl}/checkout`,
        backendUrl: `${configs.backendUrl}/order`
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      message: error.message,
      checkoutUrl: `${configs.frontendUrl}/checkout`,
      backendUrl: `${configs.backendUrl}/order`
    });
  }
};

exports.handleZaloPayCallback = async (req, res) => {
  let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);



   let result = {};
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;
  
    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // Kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // Callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      console.log("dataStr:", dataStr);
      let dataJson = JSON.parse(dataStr);
      const app_trans_id = dataJson.app_trans_id;
      const server_time = parseInt(dataJson.server_time, 10);

      const order = await Order.findOne({ where: { zaloPayTransId: app_trans_id } });

      if (order) {
          if (order.status === 'pending') {
            // Thanh toán thành công trong vòng 15 phút
            order.status = 'success';
            await order.save();
            console.log("Updated order status to success for app_trans_id:", app_trans_id);

            result.return_code = 1;
            result.return_message = "success";
          } else {
            // Đơn hàng đã được xử lý trước đó
            result.return_code = 1;
            result.return_message = "Order already processed";
          }
        } else {
          // Cập nhật trạng thái thất bại nếu đơn hàng vẫn đang pending sau 15 phút
          if (order.status === 'pending') {
            order.status = 'failed';
            await order.save();
            console.log("Updated order status to failed for app_trans_id:", app_trans_id);
          }
          result.return_code = 0;
          result.return_message = "Payment timeout";
        }
      
    
    }
  } catch (ex) {
    console.error("Error in handleZaloPayCallback:", ex);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = "Internal server error";
  }
};

// Hàm để tự động cập nhật trạng thái đơn hàng sau 15 phút
const autoUpdateOrderStatus = async () => {
  try {
    const fifteenMinutesAgo = moment().subtract(15, 'minutes').toDate();
    console.log("fifteenMinutesAgo:", fifteenMinutesAgo);
    const pendingOrders = await Order.findAll({
      where: {
        status: 'pending',
        createdAt: {
          [Op.lt]: fifteenMinutesAgo // Sử dụng `Op.lt` cho toán tử "less than"
        }
      }
    });

    for (const order of pendingOrders) {
      order.status = 'failed';
      await order.save();
      console.log(`Auto-updated order status to failed for order ID: ${order.id}`);
    }
  } catch (error) {
    console.error('không có trạng thái');
    // Log the full error stack trace
    
  }
};

// Chạy hàm tự động cập nhật mỗi phút
setInterval(autoUpdateOrderStatus, 60000);// Test: Đúng, hàm này sẽ tự động chạy mà không cần gọi API. 




// API to get orders by email
exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const orders = await Order.findAll({
      where: { customerEmail: email },
      include: [{
        model: OrderItem,
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this email' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};
// API to delete orders and associated order items by email
exports.deleteOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

   
    const orders = await Order.findAll({
      where: { customerEmail: email },
      attributes: ['id']
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this email' });
    }

    const orderIds = orders.map(order => order.id);

    // Delete associated order items
    await OrderItem.destroy({
      where: { orderId: orderIds }
    });

    // Delete the orders
    const deletedOrders = await Order.destroy({
      where: { customerEmail: email }
    });

    res.status(200).json({ 
      message: `Successfully deleted ${deletedOrders} order(s) and associated order items for email: ${email}` 
    });
  } catch (error) {
    console.error('Error deleting orders and order items by email:', error);
    res.status(500).json({ message: 'Error deleting orders and order items', error: error.message });
  }
};







