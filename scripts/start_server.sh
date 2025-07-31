#!/bin/bash
echo "=== STARTING NODE SERVER WITH PM2 ==="
cd /home/ec2-user/projet-specialisation-developpement/backend
pm2 start server.js --name projet-specialisation --time
pm2 save
