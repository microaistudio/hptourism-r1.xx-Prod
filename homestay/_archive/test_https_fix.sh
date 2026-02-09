#!/bin/bash
echo "Testing HTTPS Enforcement..."

# 1. Test GET request (Should Redirect)
# We simulate coming from a proxy with X-Forwarded-Proto: http
echo "1. Testing GET http://localhost:5001"
CODE_GET=$(curl -o /dev/null -s -w "%{http_code}" -H "X-Forwarded-Proto: http" http://localhost:5001/)
if [ "$CODE_GET" == "302" ]; then
    echo "✅ PASS: GET Request Redirected (302 Found) to HTTPS"
else
    echo "❌ FAIL: GET Request returned $CODE_GET (Expected 302)"
fi

# 2. Test POST request (Should Block)
echo "2. Testing POST http://localhost:5001/api/auth/login"
CODE_POST=$(curl -X POST -o /dev/null -s -w "%{http_code}" -H "X-Forwarded-Proto: http" http://localhost:5001/api/auth/login)
if [ "$CODE_POST" == "403" ]; then
    echo "✅ PASS: POST Request Blocked (403 Forbidden)"
else
    echo "❌ FAIL: POST Request returned $CODE_POST (Expected 403)"
fi
