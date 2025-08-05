# 1. Xoá tất cả event
`curl -X POST http://localhost:3010/api/events/reset`

# 2. Để fake 100 sự kiện vào db
`curl -X POST http://localhost:3010/api/events/seed`

# 3. Để xoá collection cũ trên QDrant run lệnh sau
`curl -X DELETE http://localhost:6333/collections/events`

# 4. Có thể gọi api đễ index the data
`curl -X POST http://localhost:3010/api/ai-chatbot/index-events`
Kết quả trả về như sau
`{"message":"Indexed 24 events to Qdrant. Failed: 0"}` là thành công

# Index data from db to qdrant, cái này không khuyến khích run
Required qdrant db runing and embedded service runing
`cd backend && npx ts-node src/chatbot/qdrant_index_events.ts`

Nếu báo lỗi liên quan đến EMBEDDING_DIM thì điều chỉnh lại trong code qdrant.service.ts