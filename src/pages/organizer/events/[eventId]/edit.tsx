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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import MediaUpload from '@/components/organizer/MediaUpload';
import type { MediaFile } from '@/types/media';

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
    level: string; // changed from union to string for dynamic tiers
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
    coverImage?: string; // Thêm trường coverImage
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
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [tiers, setTiers] = useState<{id: string, name: string}[]>([]);
    const [newTier, setNewTier] = useState('');
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
                setEventData(prev => ({ ...prev, ...data }));
                setMediaFiles(urlsToMediaFiles(data.media || []));
                if (data.days && data.days.length > 0) setSelectedDayId(data.days[0].id);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [eventId]);

    // Fetch tiers for this event
    useEffect(() => {
      if (eventId) {
        fetch(`${API_URL}/events/${eventId}/sponsorship-levels`)
          .then(res => res.json())
          .then(data => setTiers(data));
      }
    }, [eventId]);

    // When tiers change, if newSponsor.level is empty, set it to the first tier
    useEffect(() => {
      if (tiers.length > 0 && !newSponsor.level) {
        setNewSponsor(prev => ({ ...prev, level: tiers[0].name }));
      }
    }, [tiers]);

    // Utility: Deep clean and build event data to match backend schema
    function buildEventPayload(data: EventData): any {
        return {
            ...data,
            media: Array.isArray(data.media) ? data.media : [],
            days: (data.days || []).map((d, i) => ({
                date: d.date || data.startDate,
                activities: Array.isArray(d.activities) ? d.activities.map(a => ({
                    title: a.title || `Activity ${i+1}`,
                    description: a.description || '',
                    startTime: a.startTime || '09:00',
                    endTime: a.endTime || '10:00',
                    type: a.type || 'workshop',
                    location: a.location || '',
                    speakerIds: Array.isArray(a.speakerIds) ? a.speakerIds : []
                })) : []
            })),
            speakers: (data.speakers || []).map((s, i) => ({
                name: s.name || `Speaker ${i+1}`,
                title: s.title || `Title ${i+1}`,
                bio: s.bio || '',
                avatarUrl: s.avatarUrl || ''
            })),
            sponsors: (data.sponsors || []).map((s, i) => ({
                name: s.name || `Sponsor ${i+1}`,
                level: s.level || ['gold','silver','bronze','platinum'][i%4],
                website: s.website || '',
                description: s.description || '',
                logoUrl: s.logoUrl || ''
            })),
            booths: (data.booths || []).map((b, i) => ({
                name: b.name || `Booth ${i+1}`,
                company: b.company || `Company ${i+1}`,
                description: b.description || '',
                location: b.location || '',
                coverImageUrl: b.coverImageUrl || ''
            })),
            ticketTypes: (data.ticketTypes || []).map((t, i) => ({
                name: t.name || `Vé ${i+1}`,
                price: typeof t.price === 'number' ? t.price : 100000,
                quantity: typeof t.quantity === 'number' ? t.quantity : 100,
                description: t.description || '',
                saleStartDate: t.saleStartDate || data.startDate,
                saleEndDate: t.saleEndDate || data.endDate,
                isEarlyBird: typeof t.isEarlyBird === 'boolean' ? t.isEarlyBird : false,
                earlyBirdDiscount: typeof t.earlyBirdDiscount === 'number' ? t.earlyBirdDiscount : 0,
                isVIP: typeof t.isVIP === 'boolean' ? t.isVIP : false,
                category: t.category || 'General'
            }))
        };
    }

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setToastMsg(null);
        try {
            let coverImageUrl = eventData.coverImage;
            if (coverImageFile) {
                // TODO: Thay thế đoạn này bằng upload thực tế lên server nếu có
                // Ví dụ: const uploadRes = await uploadFileToServer(coverImageFile);
                // coverImageUrl = uploadRes.url;
                coverImageUrl = URL.createObjectURL(coverImageFile); // Demo local preview
            }
            const payload = { ...buildEventPayload(eventData), coverImage: coverImageUrl };
            const res = await fetch(`${API_URL}/events/${eventId}` , {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update event');
            }
            setToastType('success');
            setToastMsg(t('organizer.editEvent.updateSuccess'));
            // Optionally: navigate('/organizer/my-events');
        } catch (err: any) {
            setToastType('error');
            setToastMsg(err.message || t('organizer.editEvent.updateFailed'));
            setError(err.message || 'Update failed');
        } finally {
            setLoading(false);
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
        setNewSponsor({ name: '', level: tiers[0]?.name || '', website: '', description: '', logoUrl: '' });
    };
    const handleRemoveSponsor = (sponsorId: string) => {
        setEventData(prev => ({
            ...prev,
            sponsors: prev.sponsors.filter(sponsor => sponsor.id !== sponsorId)
        }));
    };
    const getSponsorLevelColor = (level: string) => {
        // Optionally, you can style some common levels
        switch (level.toLowerCase()) {
            case 'platinum': return 'bg-slate-300 hover:bg-slate-300';
            case 'gold': return 'bg-yellow-300 hover:bg-yellow-400 text-yellow-900';
            case 'silver': return 'bg-gray-300 hover:bg-gray-400 text-gray-900';
            case 'bronze': return 'bg-amber-700 hover:bg-amber-800 text-white';
            default: return 'bg-gray-200 text-gray-800';
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

    // Thêm hàm chuyển đổi giữa MediaFile[] và string[]
    function mediaFilesToUrls(files: MediaFile[]): string[] {
      return files.map(f => f.url || '').filter(Boolean);
    }
    function urlsToMediaFiles(urls: string[]): MediaFile[] {
      return urls.map((url, idx) => ({
        id: `media-${idx}-${Date.now()}`,
        name: url.split('/').pop() || `media-${idx}`,
        type: 'image', // Giả định là image, có thể mở rộng nếu lưu type
        size: 0,
        url
      }));
    }

    const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewActivity(prev => ({ ...prev, [name]: value }));
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImageFile(e.target.files[0]);
            // Nếu muốn preview ngay, có thể setEventData({ ...eventData, coverImage: URL.createObjectURL(e.target.files[0]) })
        }
    };

    // Khi mediaFiles thay đổi, cập nhật eventData.media
    useEffect(() => {
        setEventData(prev => ({ ...prev, media: mediaFilesToUrls(mediaFiles) }));
    }, [mediaFiles]);

    // Handler cho MediaUpload
    const handleMediaFilesChange = (files: MediaFile[]) => {
        setMediaFiles(files);
    };

    const handleAddTier = async () => {
      if (!newTier.trim() || tiers.some(t => t.name === newTier.trim())) return;
      if (!eventId) {
        setTiers([...tiers, { id: `temp-${Date.now()}`, name: newTier.trim() }]);
        setNewTier('');
      } else {
        const res = await fetch(`${API_URL}/events/${eventId}/sponsorship-levels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newTier.trim() })
        });
        if (res.ok) {
          const created = await res.json();
          setTiers([...tiers, created]);
          setNewTier('');
        }
      }
    };

    const handleDeleteTier = async (tierId: string) => {
      if (!eventId) {
        setTiers(tiers.filter(t => t.id !== tierId));
      } else {
        const res = await fetch(`${API_URL}/events/${eventId}/sponsorship-levels/${tierId}`, { method: 'DELETE' });
        if (res.ok) setTiers(tiers.filter(t => t.id !== tierId));
      }
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
                        <Button type="submit" form="edit-event-form">{t('organizer.editEvent.updateEvent')}</Button>
                    </div>
                </div>
                <form id="edit-event-form" onSubmit={handleUpdateEvent}>
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
                                <div className="space-y-6">
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
                                    <div className="space-y-2">
                                      <Label htmlFor="cover-image">Cover Image</Label>
                                      <div className="mt-2">
                                        <div className="flex items-center justify-center w-full">
                                          <label htmlFor="cover-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            {coverImageFile ? (
                                              <div className="flex items-center space-x-2">
                                                <Image className="h-5 w-5 text-purple-600" />
                                                <span className="text-sm text-gray-700">{coverImageFile.name}</span>
                                              </div>
                                            ) : eventData.coverImage ? (
                                              <img src={eventData.coverImage} alt="Cover" className="h-24 object-cover rounded" />
                                            ) : (
                                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                  <span className="font-semibold">Click to upload</span> event cover image
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                                              </div>
                                            )}
                                            <input
                                              id="cover-image"
                                              type="file"
                                              accept="image/*"
                                              onChange={handleCoverImageChange}
                                              className="hidden"
                                            />
                                          </label>
                                        </div>
                                        {coverImageFile && (
                                          <div className="mt-2">
                                            <img
                                              src={URL.createObjectURL(coverImageFile)}
                                              alt="Cover preview"
                                              className="w-full h-48 object-cover rounded-lg"
                                            />
                                          </div>
                                        )}
                                      </div>
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
                                </div>
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
                                                    <Button onClick={handleAddTicketType} type="button" className="flex items-center gap-2">
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
                                                        onClick={() => handleImageUpload('speaker', 'avatarUrl', 'some-url')} type="button"
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
                                            <Button onClick={handleAddSpeaker} type="button" className="flex items-center gap-2">
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
                                        {/* Add Activity and Overall Agenda Section */}
                                        {eventData.days.length > 0 && selectedDayId && (
                                            <Card className="mt-6">
                                                <CardHeader>
                                                    <CardTitle className="text-md">{t('organizer.schedule.addActivity')}</CardTitle>
                                                    <CardDescription>{t('organizer.schedule.addActivityInfo')}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="activityTitle">{t('organizer.schedule.activityName')}</Label>
                                                            <Input id="activityTitle" name="title" value={newActivity.title} onChange={handleActivityChange} placeholder={t('organizer.schedule.activityName.placeholder')} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="activityType">{t('organizer.schedule.type')}</Label>
                                                            <select id="activityType" name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={newActivity.type} onChange={handleActivityChange}>
                                                                <option value="workshop">{t('organizer.schedule.workshop')}</option>
                                                                <option value="meeting">{t('organizer.schedule.meeting')}</option>
                                                                <option value="exhibit">{t('organizer.schedule.exhibit')}</option>
                                                                <option value="networking">{t('organizer.schedule.networking')}</option>
                                                                <option value="other">{t('organizer.schedule.other')}</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="activityStartTime">{t('organizer.schedule.startTime')}</Label>
                                                            <Input id="activityStartTime" name="startTime" type="time" value={newActivity.startTime} onChange={handleActivityChange} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="activityEndTime">{t('organizer.schedule.endTime')}</Label>
                                                            <Input id="activityEndTime" name="endTime" type="time" value={newActivity.endTime} onChange={handleActivityChange} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        <Label htmlFor="activityLocation">{t('organizer.schedule.location')}</Label>
                                                        <Input id="activityLocation" name="location" value={newActivity.location} onChange={handleActivityChange} placeholder={t('organizer.schedule.location.placeholder')} />
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        <Label htmlFor="activityDescription">{t('organizer.schedule.description')}</Label>
                                                        <Textarea id="activityDescription" name="description" value={newActivity.description} onChange={handleActivityChange} placeholder={t('organizer.schedule.description.placeholder')} rows={3} />
                                                    </div>
                                                    {eventData.speakers.length > 0 && (
                                                        <div className="space-y-2">
                                                            <Label>{t('organizer.schedule.speakers')}</Label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {eventData.speakers.map(speaker => (
                                                                    <Badge 
                                                                        variant={newActivity.speakerIds?.includes(speaker.id) ? "default" : "outline"} 
                                                                        key={speaker.id} 
                                                                        className="cursor-pointer flex items-center gap-1"
                                                                        onClick={() => {
                                                                            const isSelected = newActivity.speakerIds?.includes(speaker.id);
                                                                            setNewActivity(prev => ({
                                                                                ...prev,
                                                                                speakerIds: isSelected
                                                                                    ? prev.speakerIds?.filter(id => id !== speaker.id)
                                                                                    : [...(prev.speakerIds || []), speaker.id],
                                                                            }));
                                                                        }}
                                                                    >
                                                                        {speaker.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                                <CardFooter className="flex justify-end border-t pt-4">
                                                  <Button onClick={handleAddActivity} type="button" className="flex items-center gap-2">
                                                      <Plus size={16} /> {t('organizer.schedule.addActivity')}
                                                  </Button>
                                                </CardFooter>
                                            </Card>
                                        )}
                                        <Separator className="my-8" />
                                        <div>
                                            <h3 className="text-lg font-medium mb-4">{t('organizer.schedule.overallAgenda')}</h3>
                                            {eventData.days.map(day => (
                                                <div key={day.id} className="mb-8">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="bg-purple-100 rounded-full p-2">
                                                            <Calendar className="h-5 w-5 text-purple-700" />
                                                        </div>
                                                        <h4 className="font-medium">
                                                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </h4>
                                                    </div>
                                                    {day.activities.length > 0 ? (
                                                        <div className="pl-12 border-l border-gray-200 ml-5 space-y-4">
                                                            {sortActivitiesByTime(day.activities).map(activity => (
                                                                <div key={activity.id} className="relative">
                                                                    <div className="absolute -left-[42px] bg-white p-1 rounded border border-gray-200">
                                                                        <List className="h-4 w-4 text-purple-600" />
                                                                    </div>
                                                                    <div className="flex gap-3 items-start">
                                                                        <div className="bg-slate-50 py-1 px-2 rounded text-xs font-medium text-slate-600 whitespace-nowrap">
                                                                            {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                                <p className="font-medium">{activity.title}</p>
                                                                                <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                                                                            </div>
                                                                            {activity.location && (
                                                                                <p className="text-xs text-muted-foreground">{activity.location}</p>
                                                                            )}
                                                                            {activity.speakerIds && activity.speakerIds.length > 0 && (
                                                                                <div className="mt-1 flex flex-wrap gap-1">
                                                                                    {activity.speakerIds.map(speakerId => {
                                                                                        const speaker = eventData.speakers.find(s => s.id === speakerId);
                                                                                        return speaker ? (
                                                                                            <div key={speakerId} className="flex items-center">
                                                                                                <Avatar className="h-4 w-4 mr-1">
                                                                                                    <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                                                                                                    <AvatarFallback>{speaker.name[0]}</AvatarFallback>
                                                                                                </Avatar>
                                                                                                <Badge key={speakerId} variant="secondary" className="text-xs">
                                                                                                    {speaker.name}
                                                                                                </Badge>
                                                                                            </div>
                                                                                        ) : null;
                                                                                    })}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground ml-12">{t('organizer.schedule.noActivities')}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </TabsContent>
                        {/* Sponsors Tab */}
                        <TabsContent value="sponsors">
                          <CardContent className="py-6">
                            <div className="space-y-8">
                              <h3 className="text-lg font-medium mb-4">{t('organizer.sponsors.title')}</h3>
                              {/* Sponsorship Levels management UI */}
                              <Card className="mb-6">
                                <CardHeader>
                                  <CardTitle>{t('organizer.sponsors.levelsTitle') || 'Sponsorship Levels'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex gap-2 mb-2">
                                    <Input
                                      value={newTier}
                                      onChange={e => setNewTier(e.target.value)}
                                      placeholder={t('organizer.sponsors.levelsInputPlaceholder') || 'Enter new sponsorship level'}
                                      className="w-48"
                                    />
                                    <Button onClick={handleAddTier} variant="default">{t('organizer.sponsors.addLevel') || 'Add'}</Button>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {tiers.map((tier) => (
                                      <div key={tier.id} className="flex items-center bg-gray-100 rounded px-3 py-1">
                                        <span>{tier.name}</span>
                                        <Button size="icon" variant="ghost" className="ml-1" onClick={() => handleDeleteTier(tier.id)}>
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
                                    ))}
                                    {tiers.length === 0 && <span className="text-gray-400">{t('organizer.sponsors.noLevels') || 'No sponsorship levels yet.'}</span>}
                                  </div>
                                </CardContent>
                              </Card>
                              {/* Add new sponsor form */}
                              <Card className="mb-6">
                                <CardHeader>
                                  <CardTitle className="text-md">{t('organizer.sponsors.addSponsor')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <div className="w-full h-32 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden">
                                        {newSponsor.logoUrl ? (
                                          <img 
                                            src={newSponsor.logoUrl} 
                                            alt="Sponsor logo preview" 
                                            className="object-contain w-full h-full"
                                          />
                                        ) : (
                                          <Image className="h-8 w-8 text-slate-400" />
                                        )}
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-2"
                                        onClick={() => handleImageUpload('sponsor', 'logoUrl', 'some-url')}
                                      >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {t('organizer.sponsors.uploadLogo')}
                                      </Button>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="sponsorName">{t('organizer.sponsors.name')}</Label>
                                          <Input
                                            id="sponsorName"
                                            value={newSponsor.name}
                                            onChange={e => setNewSponsor(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder={t('organizer.sponsors.name.placeholder')}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="sponsorLevel">{t('organizer.sponsors.level')}</Label>
                                          <select
                                            id="sponsorLevel"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            value={newSponsor.level}
                                            onChange={e => setNewSponsor(prev => ({ ...prev, level: e.target.value }))}
                                            disabled={tiers.length === 0}
                                          >
                                            {tiers.map(tier => (
                                              <option key={tier.id} value={tier.name}>{tier.name}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="space-y-2 mb-4">
                                        <Label htmlFor="sponsorWebsite">{t('organizer.sponsors.website')}</Label>
                                        <Input 
                                          id="sponsorWebsite" 
                                          value={newSponsor.website} 
                                          onChange={e => setNewSponsor(prev => ({ ...prev, website: e.target.value }))} 
                                          placeholder="https://example.com"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="sponsorDescription">{t('organizer.sponsors.description')}</Label>
                                        <Textarea 
                                          id="sponsorDescription" 
                                          value={newSponsor.description} 
                                          onChange={e => setNewSponsor(prev => ({ ...prev, description: e.target.value }))}
                                          placeholder={t('organizer.sponsors.description.placeholder')}
                                          rows={3}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-4">
                                  <Button variant="outline" onClick={() => navigateToTab("tickets")}>{t('organizer.cancel')}</Button>
                                  <Button onClick={handleAddSponsor} className="flex items-center gap-2" disabled={tiers.length === 0 || !newSponsor.level}>
                                    <Plus size={16} /> {t('organizer.sponsors.add')}
                                  </Button>
                                </CardFooter>
                              </Card>
                              {/* List sponsors below the add form, in a group card */}
                              <Card className="mb-6">
                                <CardHeader>
                                  <CardTitle>{t('organizer.sponsors.listTitle') || t('organizer.sponsors.title') || 'Sponsors'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {eventData.sponsors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {eventData.sponsors.map(sponsor => (
                                        <Card key={sponsor.id} className="relative group">
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="absolute top-2 right-2 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100" 
                                            onClick={() => handleRemoveSponsor(sponsor.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                          <CardContent className="pt-6 flex items-start gap-4">
                                            <div className="w-20 h-20 flex items-center justify-center bg-slate-100 rounded-md overflow-hidden">
                                              {sponsor.logoUrl ? (
                                                <img src={sponsor.logoUrl} alt={sponsor.name} className="object-contain w-full h-full" />
                                              ) : (
                                                <Image className="h-8 w-8 text-slate-400" />
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <span className="font-semibold text-base">{sponsor.name}</span>
                                                {sponsor.level && (
                                                  <Badge variant="outline" className={getSponsorLevelColor(sponsor.level) + " text-xs"}>{sponsor.level}</Badge>
                                                )}
                                              </div>
                                              {sponsor.website && (
                                                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline block truncate max-w-xs">{sponsor.website}</a>
                                              )}
                                              {sponsor.description && (
                                                <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{sponsor.description}</p>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed mt-4">
                                      <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                                      <p className="mt-2 text-sm text-muted-foreground">{t('organizer.sponsors.noSponsors') || 'No sponsors yet.'}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
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
                                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleImageUpload('booth', 'coverImageUrl', 'some-url')} type="button">
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {t('organizer.booths.uploadCover')}
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
                                            <Button onClick={handleAddBooth} type="button" className="flex items-center gap-2">
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
                              <MediaUpload onFilesChange={handleMediaFilesChange} />
                            </div>
                          </CardContent>
                        </TabsContent>
                    </Tabs>
                  </Card>
                </form>
                {toastMsg && (
                  <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toastMsg}
                  </div>
                )}
            </div>
        </MainLayout>
    );
};

export default EditEvent;
