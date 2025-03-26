from slack_sdk import WebClient

SLACK_BOT_TOKEN = "blank"
SLACK_CHANNEL = "C08JR09HVD1"  # Replace with your Slack Channel ID

client = WebClient(token=SLACK_BOT_TOKEN)

response = client.chat_postMessage(channel=SLACK_CHANNEL, text="Hello from the bot!")
print(response)
