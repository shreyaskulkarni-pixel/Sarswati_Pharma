import nodemailer from 'nodemailer';
import twilio from 'twilio';
import admin from 'firebase-admin';

function formatOrderItems(order) {
  return order.items
    .map((item) => `- ${item.medicineName} x${item.quantity} (INR ${item.subtotal})`)
    .join('\n');
}

function getDistributorContacts() {
  return {
    email: process.env.DISTRIBUTOR_EMAIL_TO || '',
    whatsapp: process.env.DISTRIBUTOR_WHATSAPP_TO || '',
    fcmTokens: (process.env.DISTRIBUTOR_FCM_TOKENS || '')
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean),
  };
}

async function sendDistributorEmail(order) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || smtpUser;
  const { email } = getDistributorContacts();

  if (!smtpHost || !smtpUser || !smtpPass || !fromEmail || !email) {
    return { channel: 'email', skipped: true, reason: 'Email config missing' };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject = `New order received: ${order.orderNumber}`;
  const text = [
    `New order from ${order.customerName}`,
    `Order Number: ${order.orderNumber}`,
    `Customer Email: ${order.customerEmail}`,
    `Customer Phone: ${order.customerPhone || 'N/A'}`,
    `Delivery Address: ${order.deliveryAddress || 'N/A'}`,
    `Total Amount: INR ${order.totalAmount}`,
    '',
    'Items:',
    formatOrderItems(order),
  ].join('\n');

  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject,
    text,
  });

  return { channel: 'email', sent: true };
}

async function sendDistributorWhatsApp(order) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const { whatsapp } = getDistributorContacts();

  if (!accountSid || !authToken || !from || !whatsapp) {
    return { channel: 'whatsapp', skipped: true, reason: 'WhatsApp config missing' };
  }

  const client = twilio(accountSid, authToken);

  const body = [
    `New Order: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Email: ${order.customerEmail}`,
    `Phone: ${order.customerPhone || 'N/A'}`,
    `Total: INR ${order.totalAmount}`,
    `Items: ${order.items.length}`,
  ].join('\n');

  await client.messages.create({
    from,
    to: whatsapp,
    body,
  });

  return { channel: 'whatsapp', sent: true };
}

function getFirebaseCredentials() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64) {
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }

  return null;
}

function ensureFirebaseApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const credentials = getFirebaseCredentials();
  if (!credentials) {
    return null;
  }

  return admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

async function sendDistributorPush(order) {
  const { fcmTokens } = getDistributorContacts();

  if (fcmTokens.length === 0) {
    return { channel: 'push', skipped: true, reason: 'No distributor FCM tokens configured' };
  }

  const app = ensureFirebaseApp();
  if (!app) {
    return { channel: 'push', skipped: true, reason: 'Firebase credentials missing' };
  }

  const multicastMessage = {
    tokens: fcmTokens,
    notification: {
      title: `New Order ${order.orderNumber}`,
      body: `${order.customerName} placed an order of INR ${order.totalAmount}`,
    },
    data: {
      type: 'new_order',
      orderId: String(order._id),
      orderNumber: String(order.orderNumber),
      uniqueNotificationId: `new-order-${order.orderNumber}`,
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'orders',
        tag: `order-${order.orderNumber}`,
      },
    },
  };

  const response = await admin.messaging().sendEachForMulticast(multicastMessage);

  return {
    channel: 'push',
    sent: response.successCount > 0,
    successCount: response.successCount,
    failureCount: response.failureCount,
  };
}

export async function notifyDistributorOnNewOrder(order) {
  const channels = [sendDistributorEmail(order), sendDistributorWhatsApp(order), sendDistributorPush(order)];

  const settled = await Promise.allSettled(channels);
  return settled.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    return {
      channel: 'unknown',
      sent: false,
      error: result.reason?.message || 'Notification send failed',
    };
  });
}
