import React from "react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-center text-6xl font-extrabold text-gray-900">
          404
        </h2>
        <h3 className="mt-2 text-center text-3xl font-extrabold text-gray-800">
          Page Not Found
        </h3>
        <p className="mt-2 text-base text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="font-medium text-orange hover:text-orange-dark">
            Go back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
