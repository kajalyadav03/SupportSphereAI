# SupportSphere AI

AI-powered customer support SaaS platform.

## Overview

SupportSphere AI is a full-stack customer support platform designed to help support teams manage customer tickets, agents, customers, and AI-powered ticket analysis from a centralized dashboard.

The platform combines a React frontend, Node.js/Express backend, MongoDB, and a dedicated FastAPI AI service powered by Google Gemini.

## Features

### 🎫 Ticket Management

- Create and manage customer support tickets
- Ticket status management
- Priority management
- Ticket categorization
- Assign tickets to support agents
- Soft-delete tickets
- Ticket activity tracking

### 👥 Customer & Agent Management

- Customer management
- Agent management
- Company-based data isolation
- Agent-wise ticket statistics

### 📊 Dashboard

- Total ticket statistics
- Open, in-progress, resolved and closed tickets
- Priority statistics
- Customer and agent statistics
- Recent tickets
- Recent activities
- AI-powered insights

## 🤖 AI Features

SupportSphere AI includes a dedicated AI service built with FastAPI and Google Gemini.

### AI Ticket Analysis

AI analyzes support tickets and provides:

- Summary
- Category
- Priority
- Sentiment
- Resolution
- Suggested reply
- Recommended status

### AI Suggested Reply

Agents can:

- Generate an AI-powered reply
- Use the generated reply
- Copy the reply
- Regenerate the reply
- Edit the reply before sending

### AI Recommendation

Agents can apply AI recommendations directly to a ticket.

AI can recommend:

- Category
- Priority
- Status

The final decision remains under the control of the human support agent.

### AI Activity Tracking

When an AI recommendation is applied, the change is recorded in the ticket activity history.

## 🏗️ Architecture

```text
                         SupportSphere AI
                                |
          ┌─────────────────────┼─────────────────────┐
          |                     |                     |
          ▼                     ▼                     ▼
     React Frontend       Node.js Backend       FastAPI AI Service
          |                     |                     |
          |                     ▼                     ▼
          |               MongoDB Atlas          Google Gemini
          |
          └────────────── HTTP API ────────────────┘


          ## 📁 Project Structure

```text
SupportSphere/
│
├── ai-service/
│   ├── app/
│   │   ├── prompts/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── requirements.txt
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
└── README.md