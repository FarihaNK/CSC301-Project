from slack_sdk import WebClient

SLACK_BOT_TOKEN = "xoxb-8638729329476-8645740876177-tC1b9gISBPUut13MNP806y1M"
SLACK_CHANNEL = "C08JR09HVD1"  # Replace with your Slack Channel ID

client = WebClient(token=SLACK_BOT_TOKEN)

response = client.chat_postMessage(channel=SLACK_CHANNEL, text="Hello from the bot!")
print(response)
