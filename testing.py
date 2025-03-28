import jwt
import datetime

JWT_SECRET = "superlongrandomstringwithlettersnumberssymbols123!@"  # Replace with the secret used in your Flask app
payload = {
    "id": "test_user_123",
    "role": "patient",
    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
}
token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
print(token)
