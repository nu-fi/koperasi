import requests

# CONFIGURATION (Example using Meta Cloud API)
WHATSAPP_TOKEN = "YOUR_ACCESS_TOKEN"
PHONE_NUMBER_ID = "YOUR_PHONE_NUMBER_ID"

def send_whatsapp_msg(phone, text):
    """
    Sends actual HTTP request to WhatsApp Provider.
    """
    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {"body": text}
    }

    try:
        # Uncomment below to actually send
        # response = requests.post(url, headers=headers, json=data)
        # response.raise_for_status()
        
        # MOCKING FOR TESTING
        print(f" >>> [WHATSAPP API] Sending to {phone}: {text}")
        return True
    except Exception as e:
        print(f"Failed to send WhatsApp: {e}")
        return False