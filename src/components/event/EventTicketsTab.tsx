import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Plus, Trash2, Ticket, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";


interface MultilingualText {
  [languageCode: string]: string;
}

interface TicketType {
  id: string;
  name: MultilingualText;
  description?: MultilingualText;
  price: number;
  quantity: number;
  saleStartDate?: string;
  saleEndDate?: string;
  isEarlyBird?: boolean;
  earlyBirdDiscount?: number;
  isVIP?: boolean;
  category?: string;
}

interface TicketCategory {
  id: string;
  name: string;
}

interface EventTicketsTabProps {
  eventData: {
    isFreeEvent: boolean;
    ticketTypes: TicketType[];
    id?: string;
  };
  newTicketType: Omit<TicketType, "id">;
  setNewTicketType: React.Dispatch<React.SetStateAction<Omit<TicketType, "id">>>;
  ticketCategories: TicketCategory[];
  setTicketCategories: (cats: TicketCategory[]) => void;
  showAddTicketCategory: boolean;
  setShowAddTicketCategory: (show: boolean | ((prev: boolean) => boolean)) => void;
  newTicketCategoryName: string;
  setNewTicketCategoryName: (name: string) => void;
  handleTicketChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleTicketToggle: (field: keyof TicketType, value: boolean) => void;
  handleFreeEventToggle: (checked: boolean) => void;
  handleAddTicketType: () => void;
  handleRemoveTicketType: (ticketId: string) => void;
  currentLanguage: string;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  getTicketCategoryColor: (category: string, isVIP: boolean) => string;
  navigateToTab: (tab: string) => void;
}

const EventTicketsTab: React.FC<EventTicketsTabProps> = ({
  eventData,
  newTicketType,
  setNewTicketType,
  ticketCategories,
  setTicketCategories,
  showAddTicketCategory,
  setShowAddTicketCategory,
  newTicketCategoryName,
  setNewTicketCategoryName,
  handleTicketChange,
  handleTicketToggle,
  handleAddTicketType,
  handleRemoveTicketType,
  handleFreeEventToggle,
  currentLanguage,
  t,
  formatCurrency,
  getTicketCategoryColor,
  navigateToTab,
}) => {
  useEffect(() => {
    setNewTicketType(prev => {
      const nameObj = typeof prev.name === 'object' && prev.name !== null ? { ...prev.name } : {};
      const descObj = typeof prev.description === 'object' && prev.description !== null ? { ...prev.description } : {};
      if (nameObj[currentLanguage] === undefined) nameObj[currentLanguage] = '';
      if (descObj[currentLanguage] === undefined) descObj[currentLanguage] = '';
      return {
        ...prev,
        name: nameObj,
        description: descObj,
      };
    });
  }, [currentLanguage, setNewTicketType]);

  return (
    <CardContent className="pt-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium mb-4">
            {eventData.isFreeEvent ? t("organizer.tickets.freeEvent") : t("organizer.tickets.ticketManagement")}
          </h3>
          <div className="flex items-center space-x-2">
            <Switch
              id="isFreeEvent-tickets"
              checked={eventData.isFreeEvent}
              onCheckedChange={handleFreeEventToggle}
            />
            <Label htmlFor="isFreeEvent-tickets" className="cursor-pointer">{t("organizer.tickets.freeEvent")}</Label>
          </div>
        </div>

        {eventData.isFreeEvent ? (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex items-center space-x-4">
            <BadgeCheck className="h-12 w-12 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-800">{t("organizer.tickets.freeEvent")}</h4>
              <p className="text-blue-600">{t("organizer.tickets.createTickets")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Display existing ticket types */}
            {eventData.ticketTypes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {eventData.ticketTypes.map(ticket => (
                  <Card key={ticket.id} className="relative overflow-hidden group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-destructive"
                      onClick={() => handleRemoveTicketType(ticket.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {ticket.isVIP && (
                      <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rotate-45 translate-x-6 translate-y-1">
                        VIP
                      </div>
                    )}

                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">{ticket.name?.[currentLanguage] || ''}</h4>
                          <Badge className={cn("mt-1", getTicketCategoryColor(ticket.category || "General", ticket.isVIP))}>
                            {ticket.category}
                          </Badge>
                          {ticket.description && ticket.description[currentLanguage] && (
                            <div
                              className="text-sm text-muted-foreground mt-2"
                              dangerouslySetInnerHTML={{ __html: ticket.description[currentLanguage] }}
                            />
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold text-blue-600">
                            {formatCurrency(ticket.price)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {ticket.quantity} {t("organizer.tickets.available")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t("organizer.tickets.saleStart")}:</p>
                          <p>{ticket.saleStartDate || t("organizer.tickets.notSet")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("organizer.tickets.saleEnd")}:</p>
                          <p>{ticket.saleEndDate || t("organizer.tickets.notSet")}</p>
                        </div>

                        {ticket.isEarlyBird && ticket.earlyBirdDiscount && ticket.earlyBirdDiscount > 0 && (
                          <div className="col-span-2 mt-2 bg-yellow-50 p-2 rounded">
                            <p className="font-medium text-yellow-800">
                              {t("organizer.tickets.earlyBirdDiscount")}: {ticket.earlyBirdDiscount}% {t("organizer.tickets.off")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                <Ticket className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-medium">{t("organizer.tickets.noTickets")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("organizer.tickets.createTickets")}
                </p>
              </div>
            )}

            {/* Form to add new ticket type */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-md">{t("organizer.tickets.addTicket")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketName">{t("organizer.tickets.ticketName")} ({currentLanguage.toUpperCase()})</Label>
                    <Input
                      id="ticketName"
                      name="name"
                      value={newTicketType.name?.[currentLanguage] || ''}
                      onChange={e => setNewTicketType(prev => ({
                        ...prev,
                        name: { ...prev.name, [currentLanguage]: e.target.value }
                      }))}
                      placeholder={t("organizer.tickets.ticketName.placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticketCategory">{t("organizer.tickets.category")}</Label>
                    <div className="flex gap-2 items-center">
                      <select
                        id="ticketCategory"
                        name="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value={(() => {
                          if (!newTicketType.category) return '';
                          if (["General", "Student", "Section A", "Section B", "Premium"].includes(newTicketType.category)) return newTicketType.category;
                          const found = ticketCategories.find(cat => cat.name.trim().toLowerCase() === newTicketType.category.trim().toLowerCase());
                          if (found) return found.id;
                          return '';
                        })()}
                        onChange={e => {
                          const value = e.target.value;
                          if (["General", "Student", "Section A", "Section B", "Premium"].includes(value)) {
                            setNewTicketType(prev => ({ ...prev, category: value }));
                          } else if (value) {
                            const userCat = ticketCategories.find(cat => cat.id === value);
                            if (userCat) {
                              setNewTicketType(prev => ({ ...prev, category: userCat.name }));
                            } else {
                              setNewTicketType(prev => ({ ...prev, category: '' }));
                            }
                          } else {
                            setNewTicketType(prev => ({ ...prev, category: '' }));
                          }
                        }}
                      >
                        <option value="">{t("organizer.tickets.category.select") || "Select or add category"}</option>
                        <option value="General">General</option>
                        <option value="Student">Student</option>
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                        <option value="Premium">Premium</option>
                        {ticketCategories.filter(cat => !["General", "Student", "Section A", "Section B", "Premium"].includes(cat.name)).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <Button type="button" size="sm" variant="outline" onClick={() => setShowAddTicketCategory(v => !v)}>
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      {t("organizer.tickets.category.tip") || "Tip: Some common ticket categories are General, Student, Section A, Section B, Premium... You can add your own."}
                    </div>
                    {showAddTicketCategory && (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newTicketCategoryName}
                          onChange={e => setNewTicketCategoryName(e.target.value)}
                          placeholder={t("organizer.tickets.category.addPlaceholder") || "New category name"}
                          className="w-48"
                        />
                        <Button type="button" size="sm" onClick={() => {/* handle add category logic in parent */}}>
                          {t("organizer.tickets.addCategory") || "Add"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="ticketDescription">{t("organizer.tickets.description")} ({currentLanguage.toUpperCase()})</Label>
                  <RichTextEditor
                    key={`ticketDescription-${currentLanguage}`}
                    value={newTicketType.description?.[currentLanguage] || ''}
                    onChange={val => setNewTicketType(prev => ({
                      ...prev,
                      description: { ...prev.description, [currentLanguage]: val }
                    }))}
                    placeholder={t("organizer.tickets.description.placeholder")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketPrice">{t("organizer.tickets.price")}</Label>
                    <Input
                      id="ticketPrice"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newTicketType.price}
                      onChange={handleTicketChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticketQuantity">{t("organizer.tickets.quantity")}</Label>
                    <Input
                      id="ticketQuantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={newTicketType.quantity}
                      onChange={handleTicketChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketSaleStartDate">{t("organizer.tickets.saleStart")}</Label>
                    <Input
                      id="ticketSaleStartDate"
                      name="saleStartDate"
                      type="date"
                      value={newTicketType.saleStartDate}
                      onChange={handleTicketChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticketSaleEndDate">{t("organizer.tickets.saleEnd")}</Label>
                    <Input
                      id="ticketSaleEndDate"
                      name="saleEndDate"
                      type="date"
                      value={newTicketType.saleEndDate}
                      onChange={handleTicketChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isVIP"
                        checked={newTicketType.isVIP}
                        onCheckedChange={checked => handleTicketToggle("isVIP", checked)}
                      />
                      <Label htmlFor="isVIP" className="cursor-pointer">{t("organizer.tickets.isVIP")}</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isEarlyBird"
                        checked={newTicketType.isEarlyBird}
                        onCheckedChange={checked => handleTicketToggle("isEarlyBird", checked)}
                      />
                      <Label htmlFor="isEarlyBird" className="cursor-pointer">{t("organizer.tickets.isEarlyBird")}</Label>
                    </div>

                    {newTicketType.isEarlyBird && (
                      <div className="flex items-center space-x-2">
                        <Input
                          id="earlyBirdDiscount"
                          name="earlyBirdDiscount"
                          type="number"
                          min="1"
                          max="99"
                          value={newTicketType.earlyBirdDiscount}
                          onChange={handleTicketChange}
                          className="w-20"
                        />
                        <span>% {t("organizer.tickets.earlyBirdDiscount")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={() => navigateToTab("basic")}> 
                  {t("organizer.cancel")}
                </Button>
                <Button onClick={handleAddTicketType} className="flex items-center gap-2">
                  <Plus size={16} /> {t("organizer.tickets.add")}
                </Button>
              </CardFooter>
            </Card>

            {/* Pricing and revenue preview */}
            {eventData.ticketTypes.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-md">{t("organizer.tickets.revenuePreview")}</CardTitle>
                  <CardDescription>
                    {t("organizer.tickets.revenueDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {eventData.ticketTypes.map(ticket => (
                      <div key={ticket.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{ticket.name?.[currentLanguage] || ''}</p>
                          <p className="text-sm text-muted-foreground">{ticket.quantity} {t("organizer.tickets.tickets")} × {formatCurrency(ticket.price)}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(ticket.quantity * ticket.price)}</p>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="font-medium">{t("organizer.tickets.potentialTotalRevenue")}</p>
                      <p className="font-bold text-lg">
                        {formatCurrency(
                          eventData.ticketTypes.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0)
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default EventTicketsTab;
