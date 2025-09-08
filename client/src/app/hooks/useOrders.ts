import { useEffect, useState, useCallback } from "react";

export interface Order {
  id: number;
  customer: { name: string };
  store: { name: string };
  amount_cents: number;
  status: string;
  created_at: string;
}

export interface ErrorResponse {
  message?: string;
}

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  /**
   * Fetches orders from the server.
   */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetch(`${SERVER_URL}/orders`);
      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }
      const json = await data.json();
      setOrders(json);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(
        err.message || "An unknown error occurred while fetching orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /**
   * Cancels an order.
   * @param orderId The ID of the order to cancel.
   * @param refund Whether to refund the order amount.
   */
  const cancelOrder = useCallback(
    async (orderId: number, refund: boolean) => {
      setError(null);
      try {
        const res = await fetch(`${SERVER_URL}/orders/${orderId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refund }),
        });
        if (!res.ok) {
          const errorBody: ErrorResponse = await res.json();
          throw new Error(
            `Failed to cancel order: ${errorBody.message ?? res.statusText}`
          );
        }
        // Refresh the orders list after successful cancellation
        await fetchOrders();
        return true; // Indicate success
      } catch (err: any) {
        console.error("Failed to cancel order:", err);
        setError(
          err.message || "An unknown error occurred during cancellation."
        );
        return false; // Indicate failure
      }
    },
    [fetchOrders]
  );

  function openCancelModal(order: Order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }

  async function confirmCancel(refund: boolean) {
    if (!selectedOrder) return;
    try {
      const success = await cancelOrder(selectedOrder.id, refund);
      if (success) {
        closeModal();
      }
    } catch (err: any) {
      console.error("Failed to confirm cancellation:", err);
      setError(err.message || "An unknown error occurred during confirmation.");
    }
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    cancelOrder,
    isModalOpen,
    selectedOrder,
    openCancelModal,
    closeModal,
    confirmCancel,
  };
}
