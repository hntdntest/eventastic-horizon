#!/bin/bash
# Script to reset and populate events in the database

echo "1. Xoá tất cả event"
curl -X POST http://localhost:3010/api/events/reset

echo "2. Để fake 100 sự kiện vào db"
curl -X POST http://localhost:3010/api/events/seed

echo "3. Để xoá collection cũ trên QDrant run lệnh sau"
curl -X DELETE http://localhost:6333/collections/events

echo "4. Có thể gọi api đễ index the data"
curl -X POST http://localhost:3010/api/ai-chatbot/index-events
