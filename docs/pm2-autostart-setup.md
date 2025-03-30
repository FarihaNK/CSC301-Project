# 🔁 PM2 Auto-Restart Setup on Reboot (macOS)

This guide explains how to ensure your Node.js microservices automatically restart after a system reboot using **PM2** on macOS.

---

## 📦 Prerequisites

Make sure PM2 is installed globally:

```bash
npm install pm2 -g
```

## 🚀 Start Your Services
Navigate into each microservice directory and start the service using PM2. Example:

```bash
pm2 start server.js --name user-auth-service
pm2 start server.js --name patient-profile-service
pm2 start server.js --name appointment-service
pm2 start server.js --name todolist-service
```
Each service should now be running in the background and managed by PM2.

## 💾 Save the PM2 Process List
This saves your currently running services to a file so they can be resurrected after a reboot:

```bash
pm2 save
```

## 🧠 Setup PM2 Startup Script
Run the following command to generate the appropriate startup command for your system:

```bash
pm2 startup
```

## 🔁 Reboot Your Machine
Now reboot your Mac:

```bash
sudo reboot
```

## ✅ Verify That Services Restarted
After rebooting, open a terminal and run:

```bash
pm2 ls
```
You should see your services listed and marked as online. This confirms they restarted automatically.

## 📄 Logs and Debugging
To view logs for a specific service:

```bash
pm2 logs
```
