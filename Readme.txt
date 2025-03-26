Read me: 

Setting up Slack integration: 
0) GET API KEYS FROM SLACK! 
1) python3 http.server 3000 : this starts a basic HTTP server on port 3000 Make sure port # is free check first

2) cloudflared tunnel --url http://localhost:3000
3) go to REquest URL on slack bot settings and paste generated link
4) Run python populate_database_text.py --reset (resets current chroma DB)
5) run python query_data.py
