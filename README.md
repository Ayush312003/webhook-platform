Steps to run the project:

1) Spin up Docker
2) docker compose up

   New terminal tab
1) cd backend
2) npm i
3) npm start

   New terminal tab
1) cd frontend
2) npm i
3) npm run dev


# 🚀 Webhook Delivery Platform

A scalable webhook delivery system designed to reliably send events to external services with retry mechanisms, failure handling, and monitoring.

---

## 🧠 Overview

This project simulates a production-grade webhook system (similar to Stripe/Razorpay) where events are delivered to registered endpoints with guaranteed reliability.

It focuses on:
- Asynchronous processing
- Retry mechanisms
- Failure handling
- Observability (logs & monitoring)

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Redis (for job queues)
- React (for dashboard UI)

---

##  Features

###  Webhook Delivery
- Send events to registered webhook endpoints
- Supports multiple endpoints

###  Retry Mechanism
- Automatic retries on failure
- Exponential backoff strategy

###  Failure Handling
- Tracks failed deliveries
- Prevents infinite retry loops

###  Monitoring Dashboard
- View webhook delivery logs
- Status tracking (success / failed / retrying)
- Manual retry support

###  Asynchronous Processing
- Uses Redis queues for background job processing
- Non-blocking request handling

---

##  Architecture
    Client → API Server → Redis Queue → Worker → External Webhook Endpoint -> MongoDB (logs)


### Flow:
1. Event is received via API
2. Job is pushed to Redis queue
3. Worker processes job and sends webhook
4. Response is logged in MongoDB
5. Failed jobs are retried with backoff

---

##  Retry Strategy

- Exponential backoff (e.g. 1s → 2s → 4s → 8s)
- Configurable retry attempts
- Failed jobs stored for analysis

---

##  API Endpoints

### Create Webhook


### Trigger Event


### Retry Failed Delivery

