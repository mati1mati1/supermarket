@echo off

REM Navigate to the Docker directory
cd Docker

REM Build the Docker image
docker build -t my-supermarket-db .

REM Stop and remove the existing container if it exists
for /f "tokens=*" %%i in ('docker ps -aq -f name=my-supermarket-db') do (
    docker stop %%i
    docker rm %%i
)

REM Run the Docker container
docker run -d -p 1433:1433 --name my-supermarket-db my-supermarket-db

REM Confirm the container is running
docker ps | findstr my-supermarket-db

echo SQL Server is running on localhost:1433. You can connect using SQL Server Authentication with username 'SA' and password 'Aa123456'.
