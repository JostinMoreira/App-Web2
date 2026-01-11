const amqp = require('amqplib');

async function sendDuplicateEvents() {
  const queue = 'reservation_queue';
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });

  const messageId = 'TEST-UUID-' + Date.now(); // Un ID único para esta ejecución
  const payload = {
    pattern: 'reservation.request',
    data: {
      message_id: messageId,
      data: {
        user_id: 'user-test',
        resource_id: 'resource-test'
      }
    }
  };

  const msgBuffer = Buffer.from(JSON.stringify(payload));

  console.log(`Enviando evento 1 con message_id: ${messageId}`);
  channel.sendToQueue(queue, msgBuffer);

  // Esperar un poco para asegurar que el primero se procese (opcional, pero realista)
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`Enviando evento 2 (DUPLICADO) con message_id: ${messageId}`);
  channel.sendToQueue(queue, msgBuffer);

  console.log('Eventos enviados. Revisa los logs de ms-reservation.');
  
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendDuplicateEvents().catch(console.error);
