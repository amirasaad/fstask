# Order Management Frontend - Development Task

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Copy .env

```bash
cp .env.dist .env
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Frontend Requirements

1. **Load Orders List**

   - Show all orders when the page opens
   - Display orders in a table format

2. **Cancel Orders**

   - Each order should have a "Cancel" button
   - Clicking cancel opens a modal with 2 buttons:
     - "Cancel with refund"
     - "Cancel without a refund"

3. **Handle Cancellation**
   - When cancellation is successful, close the modal and update the orders list
   - If there's an error, show an error message and keep the modal open
   - It should deduct the order amount from the store balance
