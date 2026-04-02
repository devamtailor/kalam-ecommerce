# Kalam Shop - Auth Testing Guide

## Step 1: Verify Admin Seeded
```
mongosh
use test_database
db.admins.find({role: "admin"}).pretty()
```

## Step 2: Test Admin Login
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kalambooks.com","password":"Kalam@2024"}'
```
Should return: `{"token": "...", "email": "admin@kalambooks.com", "name": "Kalam Admin"}`

## Step 3: Test Protected Route
```bash
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kalambooks.com","password":"Kalam@2024"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

curl -X GET http://localhost:8001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Step 4: Test Products Endpoint
```bash
curl http://localhost:8001/api/products
```

## Step 5: Test Order Creation
```bash
curl -X POST http://localhost:8001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test User","customer_phone":"9876543210","customer_address":"123 Test Street","city":"Mumbai","pincode":"400001","items":[{"product_id":"test-id","product_title":"Test Book","product_image":"https://example.com/img.jpg","price":299,"quantity":1}],"total_amount":299}'
```
