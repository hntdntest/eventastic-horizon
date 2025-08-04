# Index data from db to qdrant
Required qdrant db runing and embedded service runing
`cd backend && npx ts-node src/chatbot/qdrant_index_events.ts`

Nếu báo lỗi liên quan đến EMBEDDING_DIM thì điều chỉnh lại trong code qdrant.service.ts
Để xoá collection cũ trên QDrant run lệnh sau
`curl -X DELETE http://localhost:6333/collections/events`
Nếu ok, kết quả tương tự như là
<!-- 
Found 24 events. Indexing to Qdrant...
Indexed event 00c7485e-a10b-44cc-b756-e7e2f686b945
Indexed event 05dfa6ae-2470-4d2f-92a0-80b984f6e27e
Indexed event 09eb502a-5b34-4b04-9eab-d0028b285be6
Indexed event 0f536446-710e-47bd-a011-d6cb72e0c543
Done. 
-->

Có thể gọi api đễ index the data
`curl -X POST http://localhost:3010/api/ai-chatbot/index-events`
Kết quả trả về như sau
`{"message":"Indexed 24 events to Qdrant. Failed: 0"}` là thành công
