#!/usr/bin/env bash

AUTH="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS2lyYW4iLCJlbWFpbCI6ImtpcmFuZ295YWwxOTk4QGdtYWlsLmNvbSIsImRhdGUiOiIyMDI2LTAxLTMxIDEzOjM3OjU0In0.plRzvLcFmiTKE0J8WGn8IJIfFuAPsh0rkNP3KIl6VGo"

BASE="https://workwithus.lucioai.com"

resp=$(curl --location 'https://workwithus.lucioai.com/logic-it-out' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS2lyYW4iLCJlbWFpbCI6ImtpcmFuZ295YWwxOTk4QGdtYWlsLmNvbSIsImRhdGUiOiIyMDI2LTAxLTMxIDEzOjM3OjU0In0.plRzvLcFmiTKE0J8WGn8IJIfFuAPsh0rkNP3KIl6VGo' \
--header 'Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS2lyYW4iLCJlbWFpbCI6ImtpcmFuZ295YWwxOTk4QGdtYWlsLmNvbSIsImRhdGUiOiIyMDI2LTAxLTMxIDEzOjM3OjU0In0.plRzvLcFmiTKE0J8WGn8IJIfFuAPsh0rkNP3KIl6VGo')

# 1️⃣ fetch quiz
# resp=$(curl -s "$BASE/logic-it-out" \
#   -H "Authorization: $AUTH")

echo "Response: $resp"

# 2️⃣ extract token
token=$(echo "$resp" | jq -r '.token')

echo "Token: $token"

# 3️⃣ decode JWT payload (middle part)
payload=$(echo "$token" | cut -d '.' -f2 | base64 -d 2>/dev/null)

echo "Payload: $payload"

# 4️⃣ extract answers
answers=$(echo "$payload" | jq '.answers')

echo "Answers: $answers"

# 5️⃣ submit instantly
curl -s -X POST "$BASE/fastest-fingers-first" \
  -H "Authorization: Bearer $AUTH" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$token\",\"answers\":$answers}"