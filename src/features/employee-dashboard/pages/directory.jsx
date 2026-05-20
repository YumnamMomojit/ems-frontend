import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, Mail, User } from "lucide-react";
import { Input } from "~/components/employee-ui/input";
import { Card, CardContent } from "~/components/employee-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/employee-ui/avatar";
import { Badge } from "~/components/employee-ui/badge";
import { Skeleton } from "~/components/employee-ui/skeleton";
import api from "~/services/api";
import { resolveFileUrl } from "~/lib/fileUrl";

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["/api/employee/directory"],
    queryFn: async () => {
      const response = await api.get("/employee/directory");
      return response.data;
    }
  });

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            Employee Directory
          </h1>
          <p className="text-muted-foreground text-sm">
            Find and connect with your colleagues
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, or dept..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No employees found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((emp, index) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="bg-card border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group universal-card-child h-full flex flex-col justify-between">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center border-2 border-primary/10 group-hover:border-primary/30 transition-colors overflow-hidden">
                      {emp.avatar ? (
                        <img src={resolveFileUrl(emp.avatar)} alt={emp.name} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-primary/40" />
                      )}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 h-5 w-5 ${emp.status === 'Present' || emp.status === 'PUNCHED_IN' ? 'bg-green-500' :
                        emp.status === 'On Leave' ? 'bg-yellow-500' : 'bg-gray-400'
                        } border-2 border-background rounded-full`}
                      title={emp.status}
                    ></div>
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">
                      {emp.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider mt-1">
                      {emp.designation || 'Employee'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {emp.department}
                    </p>
                  </div>

                  <div className="w-full border-t border-border pt-4 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span className="truncate">{emp.phone || 'No Phone'}</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
                       <MapPin className="h-3.5 w-3.5" />
                       <span className="truncate">{emp.location || 'Office'}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
