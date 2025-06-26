import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/useLanguage';
import { Trash2, Plus, Upload, Users, Calendar, List, BadgeCheck, Ticket, Award, Building, Image } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Định nghĩa lại các interface (Speaker, Sponsor, Booth, Activity, EventDay, TicketType, EventData) như CreateEvent
interface Speaker {
    id: string;
    name: string;
    title: string;
    bio?: string;
    avatarUrl?: string;
}
interface Sponsor {
    id: string;
    name: string;
    level: 'platinum' | 'gold' | 'silver' | 'bronze';
    website?: string;
    description?: string;
    logoUrl?: string;
}
interface ExhibitionBooth {
    id: string;
    name: string;
    company: string;
    description?: string;
    location?: string;
    coverImageUrl?: string;
}
interface Activity {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    type: 'meeting' | 'workshop' | 'exhibit' | 'networking' | 'other';
    location?: string;
    speakerIds?: string[];
}
interface EventDay {
    id: string;
    date: string;
    activities: Activity[];
}
interface TicketType {
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    saleStartDate?: string;
    saleEndDate?: string;
    isEarlyBird: boolean;
    earlyBirdDiscount?: number;
    isVIP: boolean;
    category?: string;
}
interface EventData {
    title: string;
    description: string;
    category: string;
    location: string;
    startDate: string;
    endDate: string;
    days: EventDay[];
    speakers: Speaker[];
    sponsors: Sponsor[];
    booths: ExhibitionBooth[];
    isFreeEvent: boolean;
    ticketTypes: TicketType[];
    media?: string[]; // Thêm trường media để lưu trữ URL hình ảnh
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

const defaultEventData: EventData = {
    title: '',
    description: '',
    category: 'Technology',
    location: '',
    startDate: '',
    endDate: '',
    days: [],
    speakers: [],
    sponsors: [],
    booths: [],
    isFreeEvent: true,
    ticketTypes: [],
    media: [] // Khởi tạo media là mảng rỗng
};

const EditEvent: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [eventData, setEventData] = useState<EventData>(defaultEventData);
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
    const [newSpeaker, setNewSpeaker] = useState<Omit<Speaker, 'id'>>({ name: '', title: '', bio: '', avatarUrl: '' });
    const [newSponsor, setNewSponsor] = useState<Omit<Sponsor, 'id'>>({ name: '', level: 'gold', website: '', description: '', logoUrl: '' });
    const [newBooth, setNewBooth] = useState<Omit<ExhibitionBooth, 'id'>>({ name: '', company: '', description: '', location: '', coverImageUrl: '' });
    const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({ title: '', description: '', startTime: '09:00', endTime: '10:00', type: 'workshop', location: '', speakerIds: [] });
    const [newTicketType, setNewTicketType] = useState<Omit<TicketType, 'id'>>({ name: '', description: '', price: 0, quantity: 100, saleStartDate: '', saleEndDate: '', isEarlyBird: false, earlyBirdDiscount: 0, isVIP: false, category: 'General' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        if (!eventId) return;
        setLoading(true);
        fetch(`${API_URL}/events/${eventId}`)
            .then(res => {
                if (!res.ok) throw new Error('Event not found');
                return res.json();
            })
            .then(data => {
                // Giữ nguyên giá trị isFreeEvent từ backend, không ghi đè mặc định
                setEventData(prev => ({ ...prev, ...data }));
                if (data.days && data.days.length > 0) setSelectedDayId(data.days[0].id);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [eventId]);

    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/events/${eventId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });
            if (!response.ok) throw new Error('Update failed');
            alert(t('organizer.createEvent.success'));
            navigate('/organizer/dashboard');
        } catch (err) {
            alert(t('organizer.createEvent.error'));
        }
    };

    const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setEventData(prev => ({ ...prev, [id]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEventData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleToggleFreeEvent = (checked: boolean) => {
        setEventData(prev => ({
            ...prev,
            isFreeEvent: checked
        }));
    };

    // Handler for removing ticket type
    const handleRemoveTicketType = (ticketId: string) => {
        setEventData(prev => ({
            ...prev,
            ticketTypes: prev.ticketTypes.filter(ticket => ticket.id !== ticketId)
        }));
    };

    // Handler for tab navigation
    const navigateToTab = (tabValue: string) => {
        const tabElement = document.querySelector(`[data-value="${tabValue}"]`) as HTMLElement | null;
        if (tabElement && 'click' in tabElement) {
            tabElement.click();
        }
    };

    // Handler for removing speaker
    const handleRemoveSpeaker = (speakerId: string) => {
        setEventData(prev => ({
            ...prev,
            speakers: prev.speakers.filter(speaker => speaker.id !== speakerId),
            days: prev.days.map(day => ({
                ...day,
                activities: day.activities.map(activity => ({
                    ...activity,
                    speakerIds: activity.speakerIds?.filter(id => id !== speakerId) || [],
                })),
            })),
        }));
    };

    // Handler for adding speaker
    const handleAddSpeaker = () => {
        if (!newSpeaker.name.trim() || !newSpeaker.title.trim()) return;
        const newSpeakerWithId = {
            ...newSpeaker,
            id: `speaker-${Date.now()}`,
            avatarUrl: newSpeaker.avatarUrl || "/placeholder.svg"
        };
        setEventData(prev => ({
            ...prev,
            speakers: [...prev.speakers, newSpeakerWithId],
        }));
        setNewSpeaker({ name: '', title: '', bio: '', avatarUrl: '' });
    };

    // Handler for image upload (placeholder logic)
    const handleImageUpload = (entityType: 'speaker' | 'sponsor' | 'booth', field: string, value: string) => {
        const placeholders = [
            "/placeholder.svg",
            "https://images.unsplash.com/photo-1501286353178-1ec881214838",
            "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
        ];
        const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
        switch (entityType) {
            case 'speaker':
                setNewSpeaker(prev => ({ ...prev, avatarUrl: randomPlaceholder }));
                break;
            case 'sponsor':
                setNewSponsor(prev => ({ ...prev, logoUrl: randomPlaceholder }));
                break;
            case 'booth':
                setNewBooth(prev => ({ ...prev, coverImageUrl: randomPlaceholder }));
                break;
        }
    };

    // Handler for adding activity (schedule tab)
    const handleAddActivity = () => {
        if (!selectedDayId || !newActivity.title.trim() || !newActivity.startTime || !newActivity.endTime) return;
        const newActivityWithId = { ...newActivity, id: `activity-${Date.now()}` };
        setEventData(prev => ({
            ...prev,
            days: prev.days.map(day => day.id === selectedDayId ? { ...day, activities: [...day.activities, newActivityWithId] } : day),
        }));
        setNewActivity({ title: '', description: '', startTime: '09:00', endTime: '10:00', type: 'workshop', location: '', speakerIds: [] });
    };
    const handleRemoveActivity = (dayId: string, activityId: string) => {
        setEventData(prev => ({
            ...prev,
            days: prev.days.map(day => day.id === dayId ? { ...day, activities: day.activities.filter(activity => activity.id !== activityId) } : day),
        }));
    };
    const sortActivitiesByTime = (activities: Activity[]) => {
        return [...activities].sort((a, b) => a.startTime.localeCompare(b.startTime));
    };
    const formatTime = (time: string) => time;

    // Handler for ticket type field changes
    const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const numValue = type === 'number' ? parseFloat(value) : value;
        setNewTicketType(prev => ({
            ...prev,
            [name]: numValue,
        }));
    };
    const handleTicketToggle = (field: keyof TicketType, value: boolean) => {
        setNewTicketType(prev => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleAddTicketType = () => {
        if (!newTicketType.name.trim()) {
            alert(t('organizer.tickets.nameRequired'));
            return;
        }
        if (!eventData.isFreeEvent && newTicketType.price <= 0) {
            alert(t('organizer.tickets.priceError'));
            return;
        }
        const newTicketWithId: TicketType = {
            ...newTicketType,
            id: `ticket-${Date.now()}`,
            price: eventData.isFreeEvent ? 0 : newTicketType.price,
        };
        setEventData(prev => ({
            ...prev,
            ticketTypes: [...prev.ticketTypes, newTicketWithId],
        }));
        setNewTicketType({
            name: '',
            description: '',
            price: 0,
            quantity: 100,
            saleStartDate: '',
            saleEndDate: '',
            isEarlyBird: false,
            earlyBirdDiscount: 0,
            isVIP: false,
            category: 'General'
        });
    };
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    const getTicketCategoryColor = (category: string, isVIP: boolean) => {
        if (isVIP) return 'bg-purple-500 hover:bg-purple-600 text-white';
        switch (category) {
            case 'General': return 'bg-blue-500 hover:bg-blue-600 text-white';
            case 'Student': return 'bg-green-500 hover:bg-green-600 text-white';
            case 'Section A': return 'bg-orange-500 hover:bg-orange-600 text-white';
            case 'Section B': return 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900';
            default: return 'bg-gray-500 hover:bg-gray-600 text-white';
        }
    };

    // Sponsors tab handlers
    const handleAddSponsor = () => {
        if (!newSponsor.name.trim()) return;
        const newSponsorWithId = {
            ...newSponsor,
            id: `sponsor-${Date.now()}`,
            logoUrl: newSponsor.logoUrl || "/placeholder.svg"
        };
        setEventData(prev => ({
            ...prev,
            sponsors: [...prev.sponsors, newSponsorWithId],
        }));
        setNewSponsor({ name: '', level: 'gold', website: '', description: '', logoUrl: '' });
    };
    const handleRemoveSponsor = (sponsorId: string) => {
        setEventData(prev => ({
            ...prev,
            sponsors: prev.sponsors.filter(sponsor => sponsor.id !== sponsorId)
        }));
    };
    const getSponsorLevelColor = (level: Sponsor['level']) => {
        switch (level) {
            case 'platinum': return 'bg-slate-300 hover:bg-slate-300';
            case 'gold': return 'bg-yellow-300 hover:bg-yellow-400 text-yellow-900';
            case 'silver': return 'bg-gray-300 hover:bg-gray-400 text-gray-900';
            case 'bronze': return 'bg-amber-700 hover:bg-amber-800 text-white';
            default: return '';
        }
    };

    // Booths tab handlers
    const handleAddBooth = () => {
        if (!newBooth.name.trim() || !newBooth.company.trim()) return;
        const newBoothWithId = {
            ...newBooth,
            id: `booth-${Date.now()}`,
            coverImageUrl: newBooth.coverImageUrl || "/placeholder.svg"
        };
        setEventData(prev => ({
            ...prev,
            booths: [...prev.booths, newBoothWithId],
        }));
        setNewBooth({ name: '', company: '', description: '', location: '', coverImageUrl: '' });
    };
    const handleRemoveBooth = (boothId: string) => {
        setEventData(prev => ({
            ...prev,
            booths: prev.booths.filter(booth => booth.id !== boothId)
        }));
    };

    // Media tab handlers
    const handleAddMedia = (fileUrl: string) => {
        setEventData(prev => ({
            ...prev,
            media: [...(prev.media || []), fileUrl],
        }));
    };
    const handleRemoveMedia = (fileUrl: string) => {
        setEventData(prev => ({
            ...prev,
            media: (prev.media || []).filter(url => url !== fileUrl),
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">{t('organizer.editEventTitle')}</h1>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button variant="outline" type="button" onClick={() => navigate('/organizer/dashboard')}>{t('organizer.cancel')}</Button>
                        <Button type="submit">{t('organizer.editEvent.updateEvent')}</Button>
                    </div>
                </div>
                <Card className="mb-8">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-7">
                            <TabsTrigger value="basic">{t('organizer.tabs.basic')}</TabsTrigger>
                            <TabsTrigger value="tickets">{t('organizer.tabs.tickets')}</TabsTrigger>
                            <TabsTrigger value="speakers">{t('organizer.tabs.speakers')}</TabsTrigger>
                            <TabsTrigger value="schedule">{t('organizer.tabs.schedule')}</TabsTrigger>
                            <TabsTrigger value="sponsors">{t('organizer.tabs.sponsors')}</TabsTrigger>
                            <TabsTrigger value="booths">{t('organizer.tabs.booths')}</TabsTrigger>
                            <TabsTrigger value="media">{t('organizer.tabs.media')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="basic">
                            <CardContent className="pt-6">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">{t('organizer.basic.eventName')}</Label>
                                        <Input
                                            id="title"
                                            placeholder={t('organizer.basic.eventName.placeholder')}
                                            value={eventData.title}
                                            onChange={handleBasicInfoChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">{t('organizer.basic.description')}</Label>
                                        <Textarea
                                            id="description"
                                            placeholder={t('organizer.basic.description.placeholder')}
                                            rows={5}
                                            value={eventData.description}
                                            onChange={handleBasicInfoChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">{t('organizer.basic.category')}</Label>
                                            <select
                                                id="category"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                value={eventData.category}
                                                onChange={handleBasicInfoChange}
                                            >
                                                <option>Technology</option>
                                                <option>Music</option>
                                                <option>Sports</option>
                                                <option>Business</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">{t('organizer.basic.location')}</Label>
                                            <Input
                                                id="location"
                                                placeholder={t('organizer.basic.location.placeholder')}
                                                value={eventData.location}
                                                onChange={handleBasicInfoChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="startDate">{t('organizer.basic.startDate')}</Label>
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={eventData.startDate}
                                                onChange={handleDateChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endDate">{t('organizer.basic.endDate')}</Label>
                                            <Input
                                                id="endDate"
                                                type="date"
                                                value={eventData.endDate}
                                                onChange={handleDateChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="isFreeEvent"
                                            checked={eventData.isFreeEvent}
                                            onCheckedChange={handleToggleFreeEvent}
                                        />
                                        <Label htmlFor="isFreeEvent" className="cursor-pointer">{t('organizer.basic.isFreeEvent')}</Label>
                                    </div>
                                    <div className="flex justify-end pt-4 gap-2">
                                        <Button variant="outline" type="button" onClick={() => navigate('/organizer/dashboard')}>{t('organizer.cancel')}</Button>
                                        <Button type="submit">{t('organizer.editEvent.updateEvent')}</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </TabsContent>
                        {/* Tickets Tab */}
                        <TabsContent value="tickets">
                            <CardContent className="pt-6">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium mb-4">
                                            {eventData.isFreeEvent ? t('organizer.tickets.freeEvent') : t('organizer.tickets.ticketManagement')}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="isFreeEvent-tickets"
                                                checked={eventData.isFreeEvent}
                                                onCheckedChange={handleToggleFreeEvent}
                                            />
                                            <Label htmlFor="isFreeEvent-tickets" className="cursor-pointer">{t('organizer.tickets.freeEvent')}</Label>
                                        </div>
                                    </div>
                                    {eventData.isFreeEvent ? (
                                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex items-center space-x-4">
                                            <BadgeCheck className="h-12 w-12 text-blue-600" />
                                            <div>
                                                <h4 className="font-medium text-blue-800">{t('organizer.tickets.freeEvent')}</h4>
                                                <p className="text-blue-600">{t('organizer.tickets.createTickets')}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {eventData.ticketTypes.length > 0 && (
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
                                                                <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rotate-45 translate-x-6 translate-y-1">VIP</div>
                                                            )}
                                                            <CardContent className="pt-6">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium text-lg">{ticket.name}</h4>
                                                                        <Badge className={cn("mt-1", getTicketCategoryColor(ticket.category || 'General', ticket.isVIP))}>
                                                                            {ticket.category}
                                                                        </Badge>
                                                                        {ticket.description && (
                                                                            <p className="text-sm text-muted-foreground mt-2">{ticket.description}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-xl font-semibold text-blue-600">{formatCurrency(ticket.price)}</p>
                                                                        <p className="text-sm text-muted-foreground">{ticket.quantity} {t('organizer.tickets.available')}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
                                                                    <div>
                                                                        <p className="text-muted-foreground">{t('organizer.tickets.saleStart')}:</p>
                                                                        <p>{ticket.saleStartDate || t('organizer.tickets.notSet')}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-muted-foreground">{t('organizer.tickets.saleEnd')}:</p>
                                                                        <p>{ticket.saleEndDate || t('organizer.tickets.notSet')}</p>
                                                                    </div>
                                                                    {ticket.isEarlyBird && ticket.earlyBirdDiscount && ticket.earlyBirdDiscount > 0 && (
                                                                        <div className="col-span-2 mt-2 bg-yellow-50 p-2 rounded">
                                                                            <p className="font-medium text-yellow-800">
                                                                                {t('organizer.tickets.earlyBirdDiscount')}: {ticket.earlyBirdDiscount}% {t('organizer.tickets.off')}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                            {eventData.ticketTypes.length === 0 && (
                                                <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                                                    <Ticket className="mx-auto h-12 w-12 text-slate-400" />
                                                    <h3 className="mt-4 text-lg font-medium">{t('organizer.tickets.noTickets')}</h3>
                                                    <p className="mt-2 text-sm text-muted-foreground">{t('organizer.tickets.createTickets')}</p>
                                                </div>
                                            )}
                                            <Card className="mt-8">
                                                <CardHeader>
                                                    <CardTitle className="text-md">{t('organizer.tickets.addTicket')}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="ticketName">{t('organizer.tickets.ticketName')}</Label>
                                                            <Input
                                                                id="ticketName"
                                                                name="name"
                                                                value={newTicketType.name}
                                                                onChange={handleTicketChange}
                                                                placeholder={t('organizer.tickets.ticketName.placeholder')}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="ticketCategory">{t('organizer.tickets.category')}</Label>
                                                            <select
                                                                id="ticketCategory"
                                                                name="category"
                                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                                value={newTicketType.category}
                                                                onChange={handleTicketChange}
                                                            >
                                                                <option value="General">General</option>
                                                                <option value="Student">Student</option>
                                                                <option value="Section A">Section A</option>
                                                                <option value="Section B">Section B</option>
                                                                <option value="Premium">Premium</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        <Label htmlFor="ticketDescription">{t('organizer.tickets.description')}</Label>
                                                        <Textarea
                                                            id="ticketDescription"
                                                            name="description"
                                                            value={newTicketType.description}
                                                            onChange={handleTicketChange}
                                                            placeholder={t('organizer.tickets.description.placeholder')}
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="ticketPrice">{t('organizer.tickets.price')}</Label>
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
                                                            <Label htmlFor="ticketQuantity">{t('organizer.tickets.quantity')}</Label>
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
                                                            <Label htmlFor="ticketSaleStartDate">{t('organizer.tickets.saleStart')}</Label>
                                                            <Input
                                                                id="ticketSaleStartDate"
                                                                name="saleStartDate"
                                                                type="date"
                                                                value={newTicketType.saleStartDate}
                                                                onChange={handleTicketChange}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="ticketSaleEndDate">{t('organizer.tickets.saleEnd')}</Label>
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
                                                                    onCheckedChange={checked => handleTicketToggle('isVIP', checked)}
                                                                />
                                                                <Label htmlFor="isVIP" className="cursor-pointer">{t('organizer.tickets.isVIP')}</Label>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Switch
                                                                    id="isEarlyBird"
                                                                    checked={newTicketType.isEarlyBird}
                                                                    onCheckedChange={checked => handleTicketToggle('isEarlyBird', checked)}
                                                                />
                                                                <Label htmlFor="isEarlyBird" className="cursor-pointer">{t('organizer.tickets.isEarlyBird')}</Label>
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
                                                                    <span>% {t('organizer.tickets.earlyBirdDiscount')}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-between border-t pt-4">
                                                    <Button variant="outline" onClick={() => navigateToTab("basic")}>{t('organizer.cancel')}</Button>
                                                    <Button onClick={handleAddTicketType} className="flex items-center gap-2">
                                                        <Plus size={16} /> {t('organizer.tickets.add')}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                            {eventData.ticketTypes.length > 0 && (
                                                <Card className="mt-6">
                                                    <CardHeader>
                                                        <CardTitle className="text-md">{t('organizer.tickets.revenuePreview')}</CardTitle>
                                                        <CardDescription>{t('organizer.tickets.revenueDescription')}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            {eventData.ticketTypes.map(ticket => (
                                                                <div key={ticket.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                                                    <div>
                                                                        <p className="font-medium">{ticket.name}</p>
                                                                        <p className="text-sm text-muted-foreground">{ticket.quantity} {t('organizer.tickets.tickets')} × {formatCurrency(ticket.price)}</p>
                                                                    </div>
                                                                    <p className="font-semibold">{formatCurrency(ticket.quantity * ticket.price)}</p>
                                                                </div>
                                                            ))}
                                                            <div className="flex justify-between items-center pt-4 border-t">
                                                                <p className="font-medium">{t('organizer.tickets.potentialTotalRevenue')}</p>
                                                                <p className="font-bold text-lg">{formatCurrency(eventData.ticketTypes.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0))}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </>
                                    )}
                                    <div className="flex justify-end pt-4 gap-2">
                                        <Button variant="outline" type="button" onClick={() => navigate('/organizer/dashboard')}>{t('organizer.cancel')}</Button>
                                        <Button type="submit">{t('organizer.editEvent.updateEvent')}</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </TabsContent>
                        <TabsContent value="speakers">
                            <CardContent className="pt-6">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium mb-4">{t('organizer.speakers.title')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        {eventData.speakers.map(speaker => (
                                            <Card key={speaker.id} className="relative">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-6 w-6 text-destructive"
                                                    onClick={() => handleRemoveSpeaker(speaker.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <CardContent className="pt-6 flex items-start gap-4">
                                                    <Avatar className="h-14 w-14">
                                                        <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                                                        <AvatarFallback>{speaker.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{speaker.name}</p>
                                                        <p className="text-sm text-muted-foreground">{speaker.title}</p>
                                                        {speaker.bio && <p className="text-sm mt-2">{speaker.bio}</p>}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    <Card className="mb-6">
                                        <CardHeader>
                                            <CardTitle className="text-md">{t('organizer.speakers.addSpeaker')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Avatar className="h-20 w-20">
                                                        {newSpeaker.avatarUrl ? (
                                                            <AvatarImage src={newSpeaker.avatarUrl} alt="Speaker avatar" />
                                                        ) : (
                                                            <AvatarFallback>
                                                                <Users className="h-8 w-8" />
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => handleImageUpload('speaker', 'avatarUrl', 'some-url')}
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {t('organizer.speakers.uploadPhoto')}
                                                    </Button>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="speakerName">{t('organizer.speakers.name')}</Label>
                                                            <Input
                                                                id="speakerName"
                                                                value={newSpeaker.name}
                                                                onChange={e => setNewSpeaker(prev => ({ ...prev, name: e.target.value }))}
                                                                placeholder={t('organizer.speakers.name.placeholder')}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="speakerTitle">{t('organizer.speakers.title')}</Label>
                                                            <Input
                                                                id="speakerTitle"
                                                                value={newSpeaker.title}
                                                                onChange={e => setNewSpeaker(prev => ({ ...prev, title: e.target.value }))}
                                                                placeholder={t('organizer.speakers.title.placeholder')}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="speakerBio">{t('organizer.speakers.bio')}</Label>
                                                        <Textarea
                                                            id="speakerBio"
                                                            value={newSpeaker.bio}
                                                            onChange={e => setNewSpeaker(prev => ({ ...prev, bio: e.target.value }))}
                                                            placeholder={t('organizer.speakers.bio.placeholder')}
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between border-t pt-4">
                                            <Button variant="outline" onClick={() => navigateToTab("tickets")}>{t('organizer.cancel')}</Button>
                                            <Button onClick={handleAddSpeaker} className="flex items-center gap-2">
                                                <Plus size={16} /> {t('organizer.speakers.add')}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                    <div className="flex justify-end pt-4 gap-2">
                                        <Button variant="outline" type="button" onClick={() => navigate('/organizer/dashboard')}>{t('organizer.cancel')}</Button>
                                        <Button type="submit">{t('organizer.editEvent.updateEvent')}</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </TabsContent>
                        {/* Schedule Tab */}
                        <TabsContent value="schedule">
                            <CardContent className="py-6">
                                {eventData.days.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-medium">{t('organizer.schedule.setUpTitle')}</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">{t('organizer.schedule.dateInfo')}</p>
                                        <Button className="mt-4" onClick={() => navigateToTab("basic")}>{t('organizer.schedule.backToBasic')}</Button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-medium mb-4">{t('organizer.schedule.eventSchedule')}</h3>
                                            <Tabs value={selectedDayId || undefined} onValueChange={value => setSelectedDayId(value)} className="mb-6">
                                                <TabsList className="mb-4 flex flex-nowrap overflow-x-auto">
                                                    {eventData.days.map(day => (
                                                        <TabsTrigger key={day.id} value={day.id} className="whitespace-nowrap">
                                                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                                                        </TabsTrigger>
                                                    ))}
                                                </TabsList>
                                                {eventData.days.map(day => (
                                                    <TabsContent key={day.id} value={day.id}>
                                                        {day.activities.length > 0 ? (
                                                            <div className="space-y-4">
                                                                {sortActivitiesByTime(day.activities).map(activity => (
                                                                    <Card key={activity.id} className="relative group">
                                                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100" onClick={() => handleRemoveActivity(day.id, activity.id)}>
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                        <CardContent className="pt-6 pb-4">
                                                                            <div className="flex items-start gap-4">
                                                                                <div className="bg-slate-100 text-slate-700 p-2 rounded text-center min-w-[80px]">
                                                                                    <p className="text-sm font-medium">{formatTime(activity.startTime)}</p>
                                                                                    <p className="text-xs text-muted-foreground">to</p>
                                                                                    <p className="text-sm font-medium">{formatTime(activity.endTime)}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <h4 className="font-medium">{activity.title}</h4>
                                                                                        <Badge variant="outline" className="capitalize">{activity.type}</Badge>
                                                                                    </div>
                                                                                    {activity.location && (<p className="text-sm text-muted-foreground mt-1">{t('organizer.schedule.location')}: {activity.location}</p>)}
                                                                                    {activity.description && (<p className="text-sm mt-2">{activity.description}</p>)}
                                                                                    {/* ...speakers in activity... */}
                                                                                </div>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed">
                                                                <List className="mx-auto h-8 w-8 text-muted-foreground" />
                                                                <p className="mt-2 text-sm text-muted-foreground">{t('organizer.schedule.noActivities')}</p>
                                                            </div>
                                                        )}
                                                        {/* Add new activity form... */}
                                                    </TabsContent>
                                                ))}
                                            </Tabs>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </TabsContent>
                        {/* Sponsors Tab */}
                        <TabsContent value="sponsors">
                            <CardContent className="py-6">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium mb-4">{t('organizer.sponsors.title')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        {eventData.sponsors.map(sponsor => (
                                            <Card key={sponsor.id} className="relative">
                                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => handleRemoveSponsor(sponsor.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <CardContent className="pt-6 flex items-start gap-4">
                                                    <Award className={getSponsorLevelColor(sponsor.level) + ' h-10 w-10 mr-2'} />
                                                    <div>
                                                        <p className="font-semibold">{sponsor.name}</p>
                                                        <p className="text-sm text-muted-foreground capitalize">{sponsor.level}</p>
                                                        {sponsor.website && <a href={sponsor.website} className="text-blue-600 underline text-xs" target="_blank" rel="noopener noreferrer">{sponsor.website}</a>}
                                                        {sponsor.description && <p className="text-sm mt-2">{sponsor.description}</p>}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    <Card className="mb-6">
                                        <CardHeader>
                                            <CardTitle className="text-md">{t('organizer.sponsors.addSponsor')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    {/* Logo upload */}
                                                    <Avatar className="h-20 w-20">
                                                        {newSponsor.logoUrl ? (
                                                            <AvatarImage src={newSponsor.logoUrl} alt="Sponsor logo" />
                                                        ) : (
                                                            <AvatarFallback>
                                                                <Award className="h-8 w-8" />
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleImageUpload('sponsor', 'logoUrl', 'some-url')}>
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {t('organizer.sponsors.uploadLogo')}
                                                    </Button>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="sponsorName">{t('organizer.sponsors.organizationName')}</Label>
                                                            <Input id="sponsorName" value={newSponsor.name} onChange={e => setNewSponsor(prev => ({ ...prev, name: e.target.value }))} placeholder={t('organizer.sponsors.organizationName.placeholder')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="sponsorLevel">{t('organizer.sponsors.sponsorshipLevel')}</Label>
                                                            <select id="sponsorLevel" value={newSponsor.level} onChange={e => setNewSponsor(prev => ({ ...prev, level: e.target.value as Sponsor['level'] }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                                                                <option value="platinum">Platinum</option>
                                                                <option value="gold">Gold</option>
                                                                <option value="silver">Silver</option>
                                                                <option value="bronze">Bronze</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sponsorWebsite">{t('organizer.sponsors.website')}</Label>
                                                        <Input id="sponsorWebsite" value={newSponsor.website} onChange={e => setNewSponsor(prev => ({ ...prev, website: e.target.value }))} placeholder="https://example.com" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sponsorDescription">{t('organizer.sponsors.description')}</Label>
                                                        <Textarea id="sponsorDescription" value={newSponsor.description} onChange={e => setNewSponsor(prev => ({ ...prev, description: e.target.value }))} placeholder={t('organizer.sponsors.description.placeholder')} rows={2} />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between border-t pt-4">
                                            <Button variant="outline" onClick={() => navigateToTab("booths")}>{t('organizer.cancel')}</Button>
                                            <Button onClick={handleAddSponsor} className="flex items-center gap-2">
                                                <Plus size={16} /> {t('organizer.sponsors.add')}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                    <div className="flex justify-end pt-4 gap-2">
                                        <Button variant="outline" type="button" onClick={() => navigate('/organizer/dashboard')}>{t('organizer.cancel')}</Button>
                                        <Button type="submit">{t('organizer.editEvent.updateEvent')}</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </TabsContent>
                        {/* Booths Tab */}
                        <TabsContent value="booths">
                            <CardContent className="py-6">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium mb-4">{t('organizer.booths.title')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        {eventData.booths.map(booth => (
                                            <Card key={booth.id} className="relative">
                                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-destructive" onClick={() => handleRemoveBooth(booth.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <CardContent className="pt-6 flex items-start gap-4">
                                                    <Building className="h-10 w-10 mr-2 text-slate-400" />
                                                    <div>
                                                        <p className="font-semibold">{booth.name}</p>
                                                        <p className="text-sm text-muted-foreground">{booth.company}</p>
                                                        {booth.location && <p className="text-xs text-muted-foreground">{t('organizer.booths.location')}: {booth.location}</p>}
                                                        {booth.description && <p className="text-sm mt-2">{booth.description}</p>}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    <Card className="mb-6">
                                        <CardHeader>
                                            <CardTitle className="text-md">{t('organizer.booths.addBooth')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    {/* Booth image upload */}
                                                    <Avatar className="h-20 w-20">
                                                        {newBooth.coverImageUrl ? (
                                                            <AvatarImage src={newBooth.coverImageUrl} alt="Booth cover" />
                                                        ) : (
                                                            <AvatarFallback>
                                                                <Building className="h-8 w-8" />
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleImageUpload('booth', 'coverImageUrl', 'some-url')}>
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {t('organizer.booths.uploadImage')}
                                                    </Button>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="boothName">{t('organizer.booths.boothName')}</Label>
                                                            <Input id="boothName" value={newBooth.name} onChange={e => setNewBooth(prev => ({ ...prev, name: e.target.value }))} placeholder={t('organizer.booths.boothName.placeholder')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="boothCompany">{t('organizer.booths.company')}</Label>
                                                            <Input id="boothCompany" value={newBooth.company} onChange={e => setNewBooth(prev => ({ ...prev, company: e.target.value }))} placeholder={t('organizer.booths.company.placeholder')} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="boothLocation">{t('organizer.booths.location')}</Label>
                                                        <Input id="boothLocation" value={newBooth.location} onChange={e => setNewBooth(prev => ({ ...prev, location: e.target.value }))} placeholder={t('organizer.booths.location.placeholder')} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="boothDescription">{t('organizer.booths.description')}</Label>
                                                        <Textarea id="boothDescription" value={newBooth.description} onChange={e => setNewBooth(prev => ({ ...prev, description: e.target.value }))} placeholder={t('organizer.booths.description.placeholder')} rows={2} />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between border-t pt-4">
                                            <Button variant="outline" onClick={() => navigateToTab("media")}>{t('organizer.cancel')}</Button>
                                            <Button onClick={handleAddBooth} className="flex items-center gap-2">
                                                <Plus size={16} /> {t('organizer.booths.add')}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                    <div className="flex justify-end pt-4 gap-2">
                                        <Button variant="outline" type="button" onClick={() => navigate('/organizer/dashboard')}>{t('organizer.cancel')}</Button>
                                        <Button type="submit">{t('organizer.editEvent.updateEvent')}</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </TabsContent>
                        {/* Media Tab */}
                        <TabsContent value="media">
                            <CardContent className="py-6">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium mb-4">{t('organizer.media.title')}</h3>
                                    <p className="text-muted-foreground mb-4">{t('organizer.media.uploadInstructions')}</p>
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        {(eventData.media || []).length > 0 ? (
                                            eventData.media.map((url, idx) => (
                                                <div key={idx} className="relative w-40 h-32 rounded overflow-hidden border">
                                                    <img src={url} alt="media" className="object-cover w-full h-full" />
                                                    <Button size="icon" variant="ghost" className="absolute top-1 right-1 text-destructive bg-white/80 hover:bg-white" onClick={() => handleRemoveMedia(url)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full py-8">
                                                <Image className="h-10 w-10 text-muted-foreground mb-2" />
                                                <p className="text-sm text-muted-foreground">{t('organizer.media.uploadImages')}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full max-w-xs"
                                            placeholder="Paste image URL and press Enter"
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                    handleAddMedia(e.currentTarget.value.trim());
                                                    e.currentTarget.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </MainLayout>
    );
};

export default EditEvent;
