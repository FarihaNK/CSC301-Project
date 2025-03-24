curl -X POST "https://slack.com/api/chat.postMessage" \
-H "Authorization: Bearer xoxe.xoxp-xoxe.xoxp-1-Mi0yLTg2Mzg3MjkzMjk0NzYtODYzODcyOTMzOTUyNC04NjM4OTMyNDg2NDY4LTg2MjgyMTQyMDM3MDItMDNjMTVkMjI2OTc5NTI0NWE0MDExZjkxY2FjM2E0Yzg2YWE3NTY3MDliOGYxNTMxMTM4OTY2YThjZjMyNWRiZg" \
-H "Content-Type: application/json" \
--data '{"channel": "C08JR09HVD1", "text": "Test message from my bot"}'
