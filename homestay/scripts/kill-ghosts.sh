#!/bin/bash

# Define critical ports
PORTS=(5040 5055 5060)

echo "👻 Hunting for Ghost Processes on ports: ${PORTS[*]}..."

for PORT in "${PORTS[@]}"; do
    echo "🔍 Checking Port $PORT..."
    
    PID=""
    
    # Try netstat first (robust)
    if [ -z "$PID" ] && command -v netstat >/dev/null 2>&1; then
        # Check TCP4 and TCP6
        LINE=$(netstat -nlp 2>/dev/null | grep -E ":$PORT\s" | head -n 1)
        if [ -n "$LINE" ]; then
             # Extract PID (usually last column before program name, e.g., 1234/node)
             # awk '{print $NF}' gets last column
             # cut -d'/' -f1 gets PID
             PID=$(echo "$LINE" | awk '{print $NF}' | cut -d'/' -f1)
        fi
    fi

    # Try ss (modern replacement for netstat)
    if [ -z "$PID" ] && command -v ss >/dev/null 2>&1; then
        # ss -lptn 'sport = :5055' output: "LISTEN ... users:(("node",pid=123,fd=18))"
        LINE=$(ss -lptn "sport = :$PORT" 2>/dev/null | grep "pid=")
        if [ -n "$LINE" ]; then
             # Extract pid=123
             PID=$(echo "$LINE" | grep -o 'pid=[0-9]*' | cut -d'=' -f2 | head -n 1)
        fi
    fi

    # Try fuser
    if [ -z "$PID" ] && command -v fuser >/dev/null 2>&1; then
        PID=$(fuser $PORT/tcp 2>/dev/null | awk '{print $1}')
    fi

    # Try lsof
    if [ -z "$PID" ] && command -v lsof >/dev/null 2>&1; then
        PID=$(lsof -t -i:$PORT | head -n 1)
    fi
    
    if [ -n "$PID" ]; then
        echo "⚠️ Found process $PID on port $PORT. Attempting to kill..."
        
        # Validate PID is number
        if [[ "$PID" =~ ^[0-9]+$ ]]; then
            # Try graceful kill first
            kill $PID 2>/dev/null
            sleep 1
            
            # Check if still alive
            if kill -0 $PID 2>/dev/null; then
                echo "💀 Force killing process $PID..."
                kill -9 $PID
            fi
            echo "✅ Port $PORT liberated."
        else
            echo "⚠️ Extracted invalid PID: '$PID'. Skipping."
        fi
    else
        echo "✅ Port $PORT is free (or tool missing)."
    fi
done

echo "🎉 cleanup complete."
