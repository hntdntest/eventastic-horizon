
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Ticket, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  description: string;
}

const Tickets: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: '1', name: 'Early Bird', price: 50, quantity: 100, sold: 75, description: 'Early bird special pricing' },
    { id: '2', name: 'Regular', price: 80, quantity: 200, sold: 120, description: 'Regular ticket pricing' },
    { id: '3', name: 'VIP', price: 150, quantity: 50, sold: 30, description: 'VIP access with premium benefits' }
  ]);

  const [newTicket, setNewTicket] = useState({
    name: '',
    price: '',
    quantity: '',
    description: ''
  });

  const handleCreateTicket = () => {
    if (newTicket.name && newTicket.price && newTicket.quantity) {
      const ticket: TicketType = {
        id: Date.now().toString(),
        name: newTicket.name,
        price: parseFloat(newTicket.price),
        quantity: parseInt(newTicket.quantity),
        sold: 0,
        description: newTicket.description
      };
      setTickets([...tickets, ticket]);
      setNewTicket({ name: '', price: '', quantity: '', description: '' });
    }
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/organizer/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Ticket Management</h1>
        </div>

        <Tabs defaultValue="manage" className="space-y-6">
          <TabsList>
            <TabsTrigger value="manage">Manage Tickets</TabsTrigger>
            <TabsTrigger value="create">Create New Ticket</TabsTrigger>
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            <div className="grid gap-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <Ticket className="h-5 w-5" />
                          {ticket.name}
                        </h3>
                        <p className="text-gray-600">{ticket.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span>Price: ${ticket.price}</span>
                          <span>Available: {ticket.quantity - ticket.sold}/{ticket.quantity}</span>
                          <span>Sold: {ticket.sold}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteTicket(ticket.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Ticket Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketName">Ticket Name</Label>
                    <Input
                      id="ticketName"
                      value={newTicket.name}
                      onChange={(e) => setNewTicket({...newTicket, name: e.target.value})}
                      placeholder="e.g., Early Bird"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticketPrice">Price ($)</Label>
                    <Input
                      id="ticketPrice"
                      type="number"
                      value={newTicket.price}
                      onChange={(e) => setNewTicket({...newTicket, price: e.target.value})}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticketQuantity">Quantity</Label>
                    <Input
                      id="ticketQuantity"
                      type="number"
                      value={newTicket.quantity}
                      onChange={(e) => setNewTicket({...newTicket, quantity: e.target.value})}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketDescription">Description</Label>
                  <Input
                    id="ticketDescription"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    placeholder="Describe this ticket type"
                  />
                </div>
                <Button onClick={handleCreateTicket} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.sold), 0)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">Tickets Sold</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {tickets.reduce((sum, ticket) => sum + ticket.sold, 0)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">Remaining</h3>
                  <p className="text-3xl font-bold text-orange-600">
                    {tickets.reduce((sum, ticket) => sum + (ticket.quantity - ticket.sold), 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tickets;
