#!/bin/bash
# verify_test_install.sh

EXPECTED_PATH="/opt/hptourism-test"
EXPECTED_USER="hptourism-tst"
EXPECTED_PORT="5050"
SERVICE_NAME="hptourism-prod" # Script uses this name currently

echo "========== Verifying Installation =========="
ERRORS=0

# 1. Check Directory
if [[ -d "$EXPECTED_PATH" ]]; then
    echo "[PASS] Install path $EXPECTED_PATH exists"
    # Check permissions
    OWNER=$(stat -c '%U:%G' "$EXPECTED_PATH")
    if [[ "$OWNER" == "$EXPECTED_USER:$EXPECTED_USER" ]]; then
        echo "[PASS] Ownership is correct: $OWNER"
    else
        echo "[FAIL] Ownership wrong. Expected $EXPECTED_USER:$EXPECTED_USER, got $OWNER"
        ((ERRORS++))
    fi
else
    echo "[FAIL] Install path $EXPECTED_PATH missing"
    ((ERRORS++))
fi

# 2. Check PM2 Process
echo "Checking PM2 process..."
# PM2 is run by the service user, so we check as that user
if sudo -u "$EXPECTED_USER" pm2 describe "$SERVICE_NAME" > /dev/null 2>&1; then
    STATUS=$(sudo -u "$EXPECTED_USER" pm2 jlist | grep -o '"status":"[^"]*"' | grep -o 'online')
    if [[ "$STATUS" == "online" ]]; then
         echo "[PASS] PM2 service $SERVICE_NAME is ONLINE as $EXPECTED_USER"
    else
         echo "[FAIL] PM2 service $SERVICE_NAME is not online (Status: $STATUS)"
         ((ERRORS++))
    fi
else
    echo "[FAIL] PM2 service $SERVICE_NAME not found for user $EXPECTED_USER"
    ((ERRORS++))
fi

# 3. Check Port
if ss -tlpn | grep -q ":$EXPECTED_PORT "; then
    echo "[PASS] Port $EXPECTED_PORT is listening"
else
    echo "[FAIL] Port $EXPECTED_PORT is NOT listening"
    ((ERRORS++))
fi

# 4. Check Database connection (indirectly via logs or simple query if possible)
# For now, just check if migration success log exists in the output (manual verification needed for that)
# But we can check if .env exists and has correct values
if [[ -f "$EXPECTED_PATH/.env" ]]; then
    if grep -q "PORT=$EXPECTED_PORT" "$EXPECTED_PATH/.env"; then
        echo "[PASS] .env has correct PORT"
    else
        echo "[FAIL] .env has incorrect PORT"
        ((ERRORS++))
    fi
else
     echo "[FAIL] .env file missing"
     ((ERRORS++))
fi

echo "========== Result =========="
if [[ $ERRORS -eq 0 ]]; then
    echo "VERIFICATION PASSED"
    exit 0
else
    echo "VERIFICATION FAILED with $ERRORS errors"
    exit 1
fi
