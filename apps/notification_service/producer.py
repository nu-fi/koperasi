import pika
import json
import os
from dotenv import load_dotenv

load_dotenv()
RABBITMQ_URL = os.getenv('CLOUDAMQP_URL')

def publish_whatsapp_notification(phone_number, message):
    try:
        # 1. Parse URL agar Pika bisa membacanya
        params = pika.URLParameters(RABBITMQ_URL)
        connection = pika.BlockingConnection(params)
        
        channel = connection.channel()

        # 2. Buat Queue (Idempotent)
        channel.queue_declare(queue='whatsapp_notifications', durable=True)

        # 3. Kirim Pesan
        payload = {
            "phone": phone_number,
            "message": message
        }

        channel.basic_publish(
            exchange='',
            routing_key='whatsapp_notifications',
            body=json.dumps(payload),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Pesan persisten (disimpan disk)
            )
        )

        print(f" [x] Sent to Queue: {phone_number}")
        connection.close()
        
    except Exception as e:
        print(f"Error connecting to RabbitMQ: {e}")