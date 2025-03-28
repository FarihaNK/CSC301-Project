# CSC301-Project-AI service
Install all dependencies before you try to run this. Also paste the user-auth file (.js) inside your root user AuthService
Before running: Make sure that all dependencies are installed (in Venv)
1) Run app.py in ai-service 
2) Run simpleserver in ai-service ( to handle slack GET and POST requests)
3) Paste the following command into CLI: cloudflared tunnel --url http://localhost:3000
Note: make sure the port numbers are unique throughout. 
4) go into Slack bot settings update event & subscriptions link to new link
5) update slack API key in agents.py to latest key
4) cd into User-auth-service and do : npm install & npm run dev 
5) cd into front end src folder and run npm run dev. 
