import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/employee-ui/card";
import { Badge } from "~/components/employee-ui/badge";
import { Button } from "~/components/employee-ui/button";
import { Skeleton } from "~/components/employee-ui/skeleton";
import { Input } from "~/components/employee-ui/input";
import { Textarea } from "~/components/employee-ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/employee-ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/employee-ui/select";
import { Mail, Inbox, Send, Trash2, Search, Plus, Circle, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useToast } from "~/hooks/use-toast";
import { apiRequest, queryClient } from "~/lib/queryClient";

export default function MailboxPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({ recipientId: "", subject: "", content: "" });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages", activeTab],
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const sendMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      toast({ title: "Message sent", description: "Your message has been sent successfully" });
      setComposeOpen(false);
      setNewMessage({ recipientId: "", subject: "", content: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest("PATCH", `/api/messages/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const filteredMessages = messages.filter(m =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activeTab === "inbox" ? m.senderName : m.recipientName).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead && activeTab === "inbox").length;

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead && activeTab === "inbox") {
      markReadMutation.mutate(message.id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <Mail className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Mailbox</h1>
            <p className="text-muted-foreground">Internal messages</p>
          </div>
        </div>
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-compose">
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Select value={newMessage.recipientId} onValueChange={(v) => setNewMessage({ ...newMessage, recipientId: v })}>
                <SelectTrigger data-testid="select-recipient">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                data-testid="input-subject"
              />
              <Textarea
                placeholder="Write your message..."
                rows={5}
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                data-testid="input-content"
              />
              <Button
                className="w-full"
                onClick={() => sendMutation.mutate(newMessage)}
                disabled={!newMessage.recipientId || !newMessage.subject || !newMessage.content || sendMutation.isPending}
                data-testid="button-send"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex gap-2 mb-3">
                <Button
                  variant={activeTab === "inbox" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => { setActiveTab("inbox"); setSelectedMessage(null); }}
                  data-testid="tab-inbox"
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  Inbox
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
                  )}
                </Button>
                <Button
                  variant={activeTab === "sent" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => { setActiveTab("sent"); setSelectedMessage(null); }}
                  data-testid="tab-sent"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Sent
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No messages</p>
              ) : (
                filteredMessages.map(message => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover-elevate ${
                      selectedMessage?.id === message.id
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/50"
                    }`}
                    onClick={() => handleSelectMessage(message)}
                    data-testid={`message-${message.id}`}
                  >
                    <div className="flex items-start gap-2">
                      {activeTab === "inbox" && (
                        message.isRead ? (
                          <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0 fill-primary" />
                        )
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${!message.isRead && activeTab === "inbox" ? "text-foreground" : "text-muted-foreground"}`}>
                          {activeTab === "inbox" ? message.senderName : message.recipientName}
                        </p>
                        <p className={`text-sm truncate ${!message.isRead && activeTab === "inbox" ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(parseISO(message.sentAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            {selectedMessage ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="text-xl text-foreground">{selectedMessage.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activeTab === "inbox" ? "From" : "To"}: {activeTab === "inbox" ? selectedMessage.senderName : selectedMessage.recipientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(parseISO(selectedMessage.sentAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-6">
                  <p className="whitespace-pre-wrap text-foreground">{selectedMessage.content}</p>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <p>Select a message to read</p>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
