#!/bin/bash
echo "=== VALIDATING SERVICE ==="
curl -f http://localhost:80 || exit 1
