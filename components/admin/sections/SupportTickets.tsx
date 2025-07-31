"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, MessageSquare, AlertTriangle, Clock, CheckCircle, User } from "lucide-react"
import { useAdminStore, type SupportTicket } from "@/lib/admin-store"
import { format } from "date-fns"
import { toast } from "sonner"

export function SupportTickets() {
  const { supportTickets, updateTicketStatus, assignTicket, addTicketMessage } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [replyMessage, setReplyMessage] = useState("")

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "closed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const handleStatusUpdate = (ticketId: string, newStatus: SupportTicket["status"]) => {
    updateTicketStatus(ticketId, newStatus)
    toast.success(`Ticket status updated to ${newStatus}`)
  }

  const handleAssignTicket = (ticketId: string, assignedTo: string) => {
    assignTicket(ticketId, assignedTo)
    toast.success(`Ticket assigned to ${assignedTo}`)
  }

  const handleSendReply = () => {
    if (selectedTicket && replyMessage.trim()) {
      addTicketMessage(selectedTicket.id, {
        sender: "admin",
        message: replyMessage,
        timestamp: new Date().toISOString(),
      })
      setReplyMessage("")
      toast.success("Reply sent successfully")
    }
  }

  const ticketStats = {
    total: supportTickets.length,
    open: supportTickets.filter((t) => t.status === "open").length,
    inProgress: supportTickets.filter((t) => t.status === "in-progress").length,
    resolved: supportTickets.filter((t) => t.status === "resolved").length,
    urgent: supportTickets.filter((t) => t.priority === "urgent").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Manage customer support requests and inquiries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold">{ticketStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold">{ticketStats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{ticketStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{ticketStats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold">{ticketStats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.customerName}</p>
                      <p className="text-sm text-gray-500">{ticket.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-gray-500">{ticket.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTo ? (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{ticket.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(ticket.createdAt), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Ticket Details - {ticket.id}</DialogTitle>
                          <DialogDescription>{ticket.subject}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Customer Information</h4>
                              <p className="text-sm">{ticket.customerName}</p>
                              <p className="text-sm text-gray-600">{ticket.customerEmail}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Ticket Information</h4>
                              <div className="flex gap-2 mb-2">
                                <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                                <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">Category: {ticket.category}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Status</h4>
                              <Select
                                value={ticket.status}
                                onValueChange={(value: SupportTicket["status"]) => handleStatusUpdate(ticket.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Assign To</h4>
                              <Select
                                value={ticket.assignedTo || ""}
                                onValueChange={(value) => handleAssignTicket(ticket.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select admin" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="Support Team">Support Team</SelectItem>
                                  <SelectItem value="Technical Team">Technical Team</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Conversation</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                              {ticket.messages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`p-3 rounded-lg ${
                                    message.sender === "customer" ? "bg-gray-50 ml-8" : "bg-blue-50 mr-8"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">
                                      {message.sender === "customer" ? ticket.customerName : "Support Team"}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {format(new Date(message.timestamp), "MMM dd, yyyy HH:mm")}
                                    </span>
                                  </div>
                                  <p className="text-sm">{message.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {ticket.status !== "closed" && (
                            <div>
                              <h4 className="font-medium mb-2">Reply to Customer</h4>
                              <Textarea
                                placeholder="Type your reply..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                rows={3}
                              />
                              <Button className="mt-2" onClick={handleSendReply} disabled={!replyMessage.trim()}>
                                Send Reply
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
