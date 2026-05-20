import React, { useState } from "react";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const DocumentUploader = ({ onUpload, employees = [], onClose }) => {
  const [file, setFile] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [category, setCategory] = useState("Other");
  const [visibility, setVisibility] = useState("HR");
  const [isTemplate, setIsTemplate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = [
    "Offer Letter",
    "Appointment Letter",
    "Salary Revision",
    "ID Proof",
    "Education",
    "Experience Letter",
    "Policy",
    "Other",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    if (!isTemplate && !employeeId) {
      setError("Please select an employee");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // In a real app, upload to S3/Cloudinary first
      // For now, using a mock URL or local object URL
      const fileUrl = URL.createObjectURL(file);

      const data = {
        title: file.name,
        type: file.name.split(".").pop(),
        fileUrl,
        employeeId: isTemplate ? null : employeeId,
        category,
        visibility,
        isTemplate,
      };

      await onUpload(data);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md border animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg">Upload Document</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {success ? (
            <div className="text-center py-8 text-green-600">
              <CheckCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="font-bold">Upload Successful!</p>
            </div>
          ) : (
            <>
              {/* Template Toggle */}
              <div className="flex items-center gap-2 mb-2 p-2 bg-muted/30 rounded-lg">
                <input
                  type="checkbox"
                  id="isTemplate"
                  checked={isTemplate}
                  onChange={(e) => {
                    setIsTemplate(e.target.checked);
                    if (e.target.checked) setCategory("Policy");
                  }}
                  className="rounded border-input bg-background text-primary focus:ring-ring"
                />
                <label
                  htmlFor="isTemplate"
                  className="text-sm font-medium cursor-pointer">
                  Upload as Company Template / Policy
                </label>
              </div>

              {/* Employee Select (Hidden if template) */}
              {!isTemplate && (
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Employee
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}>
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visibility Select */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Visibility
                </label>
                <div className="flex gap-4 p-2 border rounded-lg bg-background">
                  {["Employee", "HR", "Admin"].map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value={role}
                        checked={visibility === role}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>

              {/* File Input */}
              <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center hover:bg-muted/50 transition-colors group relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block w-full h-full">
                  {file ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-primary">
                      <FileText className="h-8 w-8" />
                      <span className="font-medium text-sm break-all">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Click to browse</p>
                      <p className="text-xs mt-1 opacity-70">
                        PDF, Images, Docs (Max 5MB)
                      </p>
                    </div>
                  )}
                </label>
                {file && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering file input
                      setFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-background rounded-full shadow hover:bg-red-50 hover:text-red-600 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
