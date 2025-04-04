#!/bin/bash
echo "Starting Elegent Electronics Store Applications..."

# Start Backend API
cd electronicstoreapi
./mvnw spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 10

# Start Admin Dashboard
cd ../electronicstoreadmin
npm run dev &
ADMIN_PID=$!

# Start Customer Frontend
cd ../electronicstore
npm run dev &
FRONTEND_PID=$!

# Return to root directory
cd ..

echo "All applications started successfully!"
echo "Backend API: http://localhost:8090"
echo "Admin Dashboard: http://localhost:3003"
echo "Customer Frontend: http://localhost:3000"

# Wait for user to press Ctrl+C, then kill all processes
trap "kill $BACKEND_PID $ADMIN_PID $FRONTEND_PID; exit" INT
wait 