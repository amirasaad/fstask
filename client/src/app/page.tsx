"use client";
import React, { useEffect, useState } from "react";

type Order = {
  id: number;
  customer: { name: string };
  store: { name: string };
  amount_cents: number;
  status: string;
  created_at: string;
};

type ErrorResponse = {
  message?: string;
};

const SERVER_URL = "http://localhost:4000";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetch(`${SERVER_URL}/orders`);
        const json = await data.json();
        if (mounted) setOrders(json);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

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
      // call cancel endpoint (adjust path/method to your API)
      const res = await fetch(`${SERVER_URL}/orders/${selectedOrder.id}`, {
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
      const ordersRes = await fetch(`${SERVER_URL}/orders`);
      const updatedOrders = await ordersRes.json();
      setOrders(updatedOrders);

      // Close the modal
      closeModal();
    } catch (err) {
      console.error(err);
      setError(`Could not cancel order. ${err}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Orders Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Order List</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td>
                        <div className="flex justify-center items-center h-full">
                          {order.id}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center h-full">
                          {order.customer?.name}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center h-full">
                          {order.store?.name}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center h-full">
                          {order.amount_cents}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center h-full">
                          {order.status}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center h-full">
                          {order.created_at}
                        </div>
                      </td>

                      <td>
                        <div className="flex justify-center items-center h-full">
                          <button
                            onClick={() => openCancelModal(order)}
                            className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="fixed inset-0 bg-black opacity-30"
            onClick={closeModal}
          />

          <div className="bg-white rounded-lg shadow-xl max-w-md w-full z-10 p-6 mx-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Cancel Order
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to cancel order{" "}
              <strong>#{selectedOrder.id}</strong> from{" "}
              <strong>{selectedOrder.customer.name}</strong>?
            </p>
            {error ? (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            ) : (
              <></>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={() => confirmCancel(true)}
                className="px-3 py-1.5 bg-green-600 rounded-md text-sm font-semibold text-white hover:bg-green-700"
              >
                Cancel with refund
              </button>
              <button
                onClick={() => confirmCancel(false)}
                className="px-3 py-1.5 bg-red-600 rounded-md text-sm font-semibold text-white hover:bg-red-700"
              >
                Cancel without refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
