#!/bin/bash
# Script to reset and populate events in the database

echo "1. Xoá tất cả event \n"
curl -X POST http://localhost:3010/api/events/reset

echo "2. Để fake 100 sự kiện vào db \n"
curl -X POST http://localhost:3010/api/events/seed

echo "3. Để xoá collection cũ trên QDrant run lệnh sau \n"
curl -X DELETE http://localhost:6333/collections/events

echo "4. Có thể gọi api đễ index the data \n"
curl -X POST http://localhost:3010/api/ai-chatbot/index-events

echo "5. Để kiểm tra dữ liệu đã được index hay chưa, có thể gọi API sau \n"
curl -X POST http://localhost:3010/api/ai-chatbot/debug-qdrant \
  -H "Content-Type: application/json" \
  -d '{"eventId": "0141de0f-0421-4ec7-9fcd-71b79ebc6cf2"}'

echo "6. Hoặc có thể gọi API sau để lấy dữ liệu từ QDrant \n"
curl -X POST http://localhost:6333/collections/events/points/scroll \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 5
  }'


echo "6. Hoặc có thể gọi API sau để lấy dữ liệu từ QDrant \n"
curl -X POST http://localhost:6333/collections/events/points/get \
  -H "Content-Type: application/json" \
  -d '{"ids": ["075a8c3b-4e89-43b1-b567-18ec32c0fb07"]}'