import React, { useState, useEffect } from "react";
import hrApi from "../services/hr.api";

// Components
import DocumentHeader from "../components/documents/DocumentHeader";
import DocumentStats from "../components/documents/DocumentStats";
import DocumentTabs from "../components/documents/DocumentTabs";
import DocumentTable from "../components/documents/DocumentTable";
import MissingDocTracker from "../components/documents/MissingDocTracker";
import DocumentUploader from "../components/DocumentUploader";

const Documents = () => {
    // State
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [employees, setEmployees] = useState([]);

    // Filters
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Stats and Employees (for upload dropdown) initially
            if (!stats) {
                const [statsRes, empRes] = await Promise.all([
                    hrApi.getDocumentStats(),
                    hrApi.getEmployees()
                ]);
                setStats(statsRes.data.data);
                setEmployees(empRes.data.data);
            }

            // Fetch Documents based on filters
            const params = {};
            if (activeTab === 'templates') {
                params.isTemplate = 'true';
            } else {
                params.isTemplate = 'false';
                if (activeTab !== 'all') {
                    params.category = getCategoryFromTab(activeTab);
                }
            }

            const docRes = await hrApi.getDocuments(params);
            setDocuments(docRes.data.data);

        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]); // Re-fetch when tab changes

    // Helpers
    const getCategoryFromTab = (tabId) => {
        const map = {
            "offer_letter": "Offer Letter",
            "id_proof": "ID Proof",
            "education": "Education",
            "reports": "Report",
            "other": "Other"
        };
        return map[tabId];
    };

    // Handlers
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            try {
                await hrApi.deleteDocument(id);
                fetchData(); // Refresh list
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    // Filter documents locally by search term
    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.employee && `${doc.employee.firstName} ${doc.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 space-y-8">
            <DocumentHeader
                onSearch={handleSearch}
                onUploadClick={() => setIsUploadModalOpen(true)}
            />

            <DocumentStats stats={stats} loading={loading} />

            {/* Only show Missing Tracker on 'All' or 'Offer Letter' tabs */}
            {(activeTab === 'all' || activeTab === 'offer_letter') && (
                <MissingDocTracker missingCount={stats?.missingMandatory} />
            )}

            <div className="space-y-4">
                <DocumentTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <DocumentTable
                    documents={filteredDocuments}
                    loading={loading}
                    onDelete={handleDelete}
                />
            </div>

            {isUploadModalOpen && (
                <DocumentUploader
                    employees={employees}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={async (data) => {
                        await hrApi.uploadDocument(data);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
};

export default Documents;
