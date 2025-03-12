import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaypalCancelPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
      <p className="text-lg text-gray-700 mt-2">
        Oops! Your payment was cancelled or failed. Please try again.
      </p>
      <div className="mt-6 flex space-x-4">
        <Link
          to="/shop/home"
          className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PaypalCancelPage