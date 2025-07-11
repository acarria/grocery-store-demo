"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import Link from "next/link";

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_time: number;
  product?: {
    name: string;
    image_url?: string;
  };
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  order_items: OrderItem[];
  status?: string;
}

export default function OrderHistoryPage() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    api
      .get("/api/v1/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.detail || "Failed to load order history."
        );
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Header onCartClick={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
          Order History
        </h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">
            You have no orders yet.
            <br />
            <Link href="/shop" className="text-red-600 underline">
              Go shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                  <div>
                    <span className="font-semibold">Order #</span>
                    <span className="ml-1 text-gray-700">{order.order_number}</span>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Total:</span>
                  <span className="ml-1 text-green-700 font-bold">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="ml-4 mt-1 list-disc text-gray-700">
                    {(order.order_items ?? []).map((item) => (
                      <li key={item.id}>
                        {item.product?.name || `Product #${item.product_id}`} x{item.quantity} @ ${item.price_at_time.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 