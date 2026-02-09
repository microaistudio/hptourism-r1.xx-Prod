#!/bin/bash

BASE_URL="http://localhost:5001"
echo "======================================================="
echo "SECURITY SCAN SIMULATION (Issues 3 & 9)"
echo "Target: $BASE_URL"
echo "======================================================="

echo ""
echo "[ISSUE 3] Checking for Documentation File Disclosure..."
echo "Scanner Logic: Requests '/README.md'. If HTTP 200, it FLAS."
echo "Running: curl -I -s $BASE_URL/README.md"
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" "$BASE_URL/README.md")
CONTENT_TYPE=$(curl -I -s "$BASE_URL/README.md" | grep -i "content-type")

if [ "$HTTP_STATUS" == "200" ]; then
  echo "❌ FAIL: Server returned 200 OK for README.md."
  echo "   Why? The server is likely serving the React Index HTML."
  echo "   Scanner sees '200 OK' and marks it as a Vulnerability."
  echo "   Content-Type received: $CONTENT_TYPE"
else
  echo "✅ PASS: Server returned $HTTP_STATUS (Correct behavior)."
fi

echo "Running: curl -I -s $BASE_URL/ReAdMe.Md (Case Insensitivity Check)"
HTTP_STATUS_MIXED=$(curl -o /dev/null -s -w "%{http_code}\n" "$BASE_URL/ReAdMe.Md")
if [ "$HTTP_STATUS_MIXED" == "404" ]; then
  echo "✅ PASS: Server returned 404 for ReAdMe.Md (Case Insensitivity Works)."
else
  echo "❌ FAIL: Server returned $HTTP_STATUS_MIXED for ReAdMe.Md."
fi

echo ""
echo "-------------------------------------------------------"
echo ""
echo "[ISSUE 9] Checking for Content-Security-Policy (CSP) Header..."
echo "Scanner Logic: Inspects headers for 'Content-Security-Policy'."
echo "Running: curl -I -s $BASE_URL/"
CSP_HEADER=$(curl -I -s "$BASE_URL/" | grep -i "content-security-policy")

if [ -z "$CSP_HEADER" ]; then
  echo "❌ FAIL: CSP Header MISSING."
  echo "   Why? Helmet is configured with { contentSecurityPolicy: false }"
else
  echo "✅ PASS: CSP Header FOUND."
  echo "   Header: $CSP_HEADER"
fi

echo ""
echo "======================================================="
