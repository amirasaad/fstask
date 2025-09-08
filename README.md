# Full Stack Order Management System

## 🎯 Project Overview

A complete order management system with NestJS backend and Next.js frontend. The system allows viewing orders and cancelling them with balance management.

## Backend Requirements:

### Core Tasks:

1. **Complete GET /orders endpoint**

   [x] Return orders with customer and store names
   [x] Add database joins to fetch customer and store data
   [x] Match exact response format in TODO comments

2. **Complete DELETE /orders/:id endpoint**

   [x] Cancel order with balance checking (no email sending)
   [x] Check user balance when refund is requested
   [x] If balance sufficient AND refund=true: deduct from store balance
   [x] If insufficient balance: return error "Insufficient balance"
   [x] Return formatted response matching TODO specifications

3. **Write Tests**
   [x] Unit tests for both endpoints
   [x] Test balance checking and deduction logic
   [x] Test error handling scenarios

## Frontend Requirements:

1. **Load Orders List**

   [x] Show all orders when the page opens
   [x] Display orders in a table format

2. **Cancel Orders**

   [x] Each order should have a "Cancel" button
   [x] Clicking cancel opens a modal with 2 buttons:
     [x] "Cancel with refund"
     [x] "Cancel without a refund"

3. **Handle Cancellation**
   [x] When cancellation is successful, close the modal and update the orders list
   [x] If there's an error, show an error message and keep the modal open
   [x] It should deduct the order amount from the store balance

## 📁 Project Structure

- `server/` - NestJS backend API
- `client/` - Next.js frontend application

## ⏱️ Time Estimates

- **Backend**: 3-4 hours
- **Frontend**: 3-4 hours
