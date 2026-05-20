import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";

const MissingDocTracker = ({ missingCount }) => {
    if (!missingCount || missingCount === 0) return null;

    return (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-900">Compliance Action Required</h3>
            </div>

            <p className="text-sm text-red-700 mb-4">
                <span className="font-bold">{missingCount}</span> employees have missing mandatory documents (Offer Letters, ID Proofs).
            </p>

            <button className="text-sm font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 hover:underline">
                View Missing Documents List <ArrowRight className="h-4 w-4" />
            </button>
        </div>
    );
};

export default MissingDocTracker;
