"use client";
import React from "react";
import OrdersTable from "./components/OrdersTable";
import { useOrders } from "./hooks/useOrders";
import CancelOrderModal from "./components/CancelOrderModal";

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    isModalOpen,
    selectedOrder,
    openCancelModal,
    closeModal,
    confirmCancel,
  } = useOrders();

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
        <OrdersTable
          orders={orders}
          onCancel={openCancelModal}
          loading={loading}
        />
      </main>

      <CancelOrderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmCancel}
        order={selectedOrder}
        error={error}
      />
    </div>
  );
}
