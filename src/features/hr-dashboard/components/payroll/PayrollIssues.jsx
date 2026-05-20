import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PayrollIssues = ({ issues = [] }) => {
    if (!issues || issues.length === 0) return null;

    return (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-900">Action Required: Payroll Issues Found</h3>
            </div>

            <div className="grid gap-3">
                {issues.slice(0, 3).map((issue, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                {issue.employeeName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{issue.employeeName}</p>
                                <p className="text-xs text-red-600 font-medium">
                                    {issue.daysMissing} Days Missing Worksheets
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/hr/reports/worksheets"
                            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                            Resolve <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                ))}
            </div>

            {issues.length > 3 && (
                <button className="w-full text-center text-sm font-semibold text-red-700 mt-4 hover:underline">
                    View all {issues.length} issues
                </button>
            )}
        </div>
    );
};

export default PayrollIssues;
