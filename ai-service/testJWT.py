import jwt
import time

JWT_SECRET = "superlongrandomstringwithlettersnumberssymbols123!"
payload = {
    "id": "test_patient",  # or "test_doctor" for a doctor role
    "role": "patient",     # change to "doctor" as needed
    "exp": time.time() + 3600  # token expires in 1 hour
}
token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
print(token)

