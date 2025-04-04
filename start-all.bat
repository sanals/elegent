@echo off
echo Starting Elegent Electronics Store Applications...

REM Start Backend API
start cmd /k "cd electronicstoreapi && mvnw spring-boot:run"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 10

REM Start Admin Dashboard
start cmd /k "cd electronicstoreadmin && npm run dev"

REM Start Customer Frontend 
start cmd /k "cd electronicstore && npm run dev"

echo All applications started successfully!
echo Backend API: http://localhost:8090
echo Admin Dashboard: http://localhost:3003
echo Customer Frontend: http://localhost:3000 