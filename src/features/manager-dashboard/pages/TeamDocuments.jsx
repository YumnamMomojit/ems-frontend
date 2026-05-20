import React, { useState, useEffect } from "react";
import managerService from "../services/manager.service";
import { format } from "date-fns";
import { FileText, Download, Eye, Tag } from "lucide-react";

const TeamDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const data = await managerService.getTeamDocuments();
                setDocuments(data);
            } catch (err) {
                console.error("Docs fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Team Documents</h1>
                <p className="text-muted-foreground">View official documents and records for your team members.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-10 text-center text-muted-foreground">Loading documents...</div>
                ) : documents.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                        <FileText className="h-10 w-10 opacity-20" />
                        No team documents available.
                    </div>
                ) : (
                    documents.map((doc) => (
                        <div key={doc.id} className="bg-card border rounded-xl shadow-sm p-4 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary/5 rounded-lg text-primary">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="flex gap-1">
                                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary">
                                        <Eye className="h-4 w-4" />
                                    </a>
                                    <a href={doc.fileUrl} download className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="flex-1 space-y-1">
                                <h3 className="font-bold text-sm truncate" title={doc.title}>{doc.title}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Tag className="h-3 w-3" /> {doc.type}
                                </p>
                            </div>

                            <div className="pt-4 mt-4 border-t border-dashed space-y-2">
                                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                    Owner
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                        {doc.employee.firstName[0]}{doc.employee.lastName[0]}
                                    </div>
                                    <span className="text-xs font-medium">{doc.employee.firstName} {doc.employee.lastName}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamDocuments;
