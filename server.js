const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ข้อมูลจำลองออเดอร์
const orders = {};

// 1. API สำหรับสร้าง QR Code
app.post('/api/create-qr', (req, res) => {
    const { amount } = req.body;
    const orderId = 'ORD_' + Date.now();

    // บันทึกออเดอร์ไว้ในระบบ
    orders[orderId] = {
        status: 'PENDING',
        amount: amount,
        fileUrl: 'maps/ravenhold_map.zip' // ลิงก์ไฟล์ที่จะแจก
    };

    const qrData = `PROMPTPAY_PAYLOAD_${orderId}_AMOUNT_${amount}`;
    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

    // แสดง Order ID ใน Console ให้ก๊อปปี้ไปใช้ง่ายๆ
    console.log(`📌 ออเดอร์ใหม่ถูกสร้าง: ${orderId}`);

    res.json({
        success: true,
        orderId: orderId,
        qrImage: qrImage
    });
});

// 2. API ให้ Frontend ยิงมาเช็กสถานะ
app.get('/api/check-status/:orderId', (req, res) => {
    const order = orders[req.params.orderId];
    if (order && order.status === 'PAID') {
        res.json({ paid: true, downloadUrl: order.fileUrl });
    } else {
        res.json({ paid: false });
    }
});

// 3. Webhook รับสัญญาณจำลองการจ่ายเงิน (เพิ่มส่วนนี้เข้ามา)
app.post('/api/webhook', (req, res) => {
    const { orderId, status } = req.body;

    if (orders[orderId] && status === 'SUCCESS') {
        orders[orderId].status = 'PAID';
        console.log(`✅ ออเดอร์ ${orderId} ชำระเงินเรียบร้อยแล้ว!`);
        return res.json({ success: true, message: 'Updated to PAID' });
    }

    res.status(400).json({ success: false, message: 'Order not found' });
});

// สั่งรัน Port 3000
app.listen(3000, () => {
    console.log('✅ Backend Server running on http://localhost:3000');
});