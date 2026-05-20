import React from "react";
import { Search, Filter, Plus } from "lucide-react";

const DocumentHeader = ({ onSearch, onFilter, onUploadClick }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Documents</h1>
                <p className="text-muted-foreground text-sm">Manage official employee and company documents.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search document..."
                        className="pl-9 pr-4 py-2 w-full md:w-64 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <button
                    onClick={onFilter}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                >
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    Filters
                </button>

                <button
                    onClick={onUploadClick}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-bold shadow-md shadow-primary/20"
                >
                    <Plus className="h-4 w-4" />
                    Upload Document
                </button>
            </div>
        </div>
    );
};

export default DocumentHeader;
