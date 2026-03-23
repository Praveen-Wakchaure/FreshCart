export const sendOrderConfirmation = async (mobileNumber, order) => {
  if (process.env.NODE_ENV !== 'production' || !process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_API_TOKEN.startsWith('your_')) {
    console.log(`[DEV] WhatsApp order confirmation to +91${mobileNumber}:`);
    console.log(`  Order #${order._id}`);
    console.log(`  Items: ${order.orderItems.map((i) => `${i.name} x${i.quantity}`).join(', ')}`);
    console.log(`  Total: ₹${order.totalPrice}`);
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: `91${mobileNumber}`,
          type: 'text',
          text: {
            body: `🥭 *FreshCart Order Confirmed!*\n\nOrder #${order._id}\n${order.orderItems.map((i) => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`).join('\n')}\n\n*Total: ₹${order.totalPrice}*\n\nThank you for your order! 🎉`,
          },
        }),
      }
    );
    const data = await response.json();
    console.log('WhatsApp confirmation sent:', data);
  } catch (error) {
    console.error('WhatsApp API error:', error.message);
  }
};

export const sendDeliveryUpdate = async (mobileNumber, orderId, status) => {
  if (process.env.NODE_ENV !== 'production' || !process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_API_TOKEN.startsWith('your_')) {
    console.log(`[DEV] WhatsApp delivery update to +91${mobileNumber}: Order #${orderId} is now ${status}`);
    return;
  }

  try {
    await fetch(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: `91${mobileNumber}`,
          type: 'text',
          text: {
            body: `🥭 *FreshCart Order Update*\n\nOrder #${orderId}\nStatus: *${status}*\n\nTrack your order on FreshCart! 📦`,
          },
        }),
      }
    );
  } catch (error) {
    console.error('WhatsApp API error:', error.message);
  }
};
