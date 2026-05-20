import React from "react";

const ReimbursementHeader = () => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Reimbursements</h1>
                <p className="text-muted-foreground">Review and manage employee expense claims.</p>
            </div>
            {/* Add Export/Print buttons here if needed */}
        </div>
    );
};

export default ReimbursementHeader;
