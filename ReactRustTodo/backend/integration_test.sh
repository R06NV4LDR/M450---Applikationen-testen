#!/usr/bin/bash
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Start the db with in memory option
cargo run -- -m memory > /dev/null 2>&1 &
DB_PID=$!
sleep 2 # wait for the db to start

# Test endpoints of the db

echo -e "\n=== GET /api/health ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}Health check passed!${NC}"
else
    echo -e "${RED}Health check failed with status code $HTTP_CODE${NC}"
fi

# Add a todo
echo -e "\n=== POST /api/todos ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/todos -H "Content-Type: application/json" -d '{"title":"Test Todo","completed":false}')
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}Todo creation passed!${NC}"
else
    echo -e "${RED}Todo creation failed with status code $HTTP_CODE${NC}"
fi

# Get Todo
echo -e "\n=== GET /api/todos/{id} ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8080/api/todos/1)
if [ "$HTTP_CODE" -eq  200 ]; then
  echo -e "${GREEN}GET todo passed${NC}"
else
  echo -e "${RED}Get todo failed with status code $HTTP_CODE${NC}"
fi

# Get all Todos
echo -e "\n=== GET /api/todos ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8080/api/todos)
if [ "$HTTP_CODE" -eq  200 ]; then
  echo -e "${GREEN}GET todos passed${NC}"
else
  echo -e "${RED}Get todos failed with status code $HTTP_CODE${NC}"
fi


# PUT Todo
echo -e "\n=== PUT /api/todos ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT http://localhost:8080/api/todos/1 -H "Content-Type: application/json" -d '{"todo_id": 1,"title":"Updated Test Todo","completed":true}')
if [ "$HTTP_CODE" -eq  200 ]; then
  echo -e "${GREEN}PUT todo passed${NC}"
else
  echo -e "${RED}PUT todo failed with status code $HTTP_CODE${NC}"
fi

# DELETE Todo
echo -e "\n=== DELETE /api/todos/{id} ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8080/api/todos/1)
if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}DELETE todo passed${NC}"
else
  echo -e "${RED}DELETE todo failed with status code $HTTP_CODE${NC}"
fi

# Verify deletion - should return 404
echo -e "\n=== Verify deletion (GET /api/todos/1 should fail) ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8080/api/todos/1)
if [ "$HTTP_CODE" -eq 404 ]; then
  echo -e "${GREEN}Deletion verified - todo not found${NC}"
else
  echo -e "${RED}Deletion verification failed - expected 404, got $HTTP_CODE${NC}"
fi

echo -e "\n${GREEN}=== All integration tests completed ===${NC}"

# Stop the db
kill $DB_PID

