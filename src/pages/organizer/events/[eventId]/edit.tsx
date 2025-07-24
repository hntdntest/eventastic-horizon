import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Update the path below to the correct relative path where MainLayout.tsx exists, for example:
import MainLayout from '@/components/layout/MainLayout';
// Or, if it is in a different location, adjust accordingly, e.g.:
// import MainLayout from '../../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EventSettingsTab from '@/components/event/EventSettingsTab';
import EventBasicInfoForm from '@/components/event/EventBasicInfoForm';
import EventTicketsTab from '@/components/event/EventTicketsTab';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Settings, Image, Plus, Trash2, Clock, List, Building, Award, Upload, Ticket, CircleDollarSign, BadgeCheck, FileText, Camera, Mic, Store } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from '@/contexts/useLanguage';
import MediaUpload from '@/components/organizer/MediaUpload';
import * as LucideIcons from 'lucide-react';
import LanguageSelector from '@/components/organizer/LanguageSelector';
import EventSpeakersTab from '@/components/event/EventSpeakersTab';
import EventScheduleTab from '@/components/event/EventScheduleTab';
import EventSponsorsTab from '@/components/event/EventSponsorsTab';
import EventBoothsTab from '@/components/event/EventBoothsTab';
import EventMediaTab from '@/components/event/EventMediaTab';
// Ticket Category type
interface TicketCategory { id: string; name: string; }
interface Speaker {
  id: string;
  name: Record<string, string>;
  title: Record<string, string>;
  bio: Record<string, string>;
  avatarUrl: string;
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
  name: Record<string, string>;
  company: Record<string, string>;
  description: Record<string, string>;
  location: Record<string, string>;
  coverImageUrl: string;
}

interface Activity {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  startTime: string;
  endTime: string;
  type: string;
  location: Record<string, string>;
  speakerIds: string[];
}

interface EventDay {
  id: string;
  date: string;
  activities: Activity[];
}

interface TicketType {
  id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  price: number;
  quantity: number;
  saleStartDate?: string;
  saleEndDate?: string;
  isEarlyBird: boolean;
  earlyBirdDiscount?: number;
  isVIP: boolean;
  category?: string; // e.g., "General", "Student", "Section A", "VIP Area", etc.
}

interface EventData {
  id?: string;
  title: Record<string, string>;
  description: Record<string, string>;
  category: string;
  location: Record<string, string>;
  startDate: string;
  endDate: string;
  days: EventDay[];
  speakers: Speaker[];
  sponsors: Sponsor[];
  booths: ExhibitionBooth[];
  isFreeEvent: boolean;
  ticketTypes: TicketType[];
  media?: string[];
  tabConfig?: Record<string, boolean>;
  ticketCategories?: string[];
}

interface TabSettings {
  showDetails: boolean;
  showMedia: boolean;
  showTickets: boolean;
  showSpeakers: boolean;
  showSchedule: boolean;
  showSponsors: boolean;
}

const eventTypeDefaults: Record<string, Partial<TabSettings>> = {
  music: {
    showTickets: true,
    showSponsors: true,
    showSpeakers: false,
    showSchedule: false,
    showMedia: true,
    showDetails: true
  },
  conference: {
    showTickets: true,
    showSpeakers: true,
    showSchedule: true,
    showSponsors: true,
    showMedia: true,
    showDetails: true
  },
  workshop: {
    showTickets: true,
    showSpeakers: true,
    showSchedule: true,
    showSponsors: false,
    showMedia: true,
    showDetails: true
  },
  exhibition: {
    showTickets: true,
    showSponsors: true,
    showSpeakers: false,
    showSchedule: true,
    showMedia: true,
    showDetails: true
  },
  networking: {
    showTickets: true,
    showSponsors: true,
    showSpeakers: false,
    showSchedule: false,
    showMedia: true,
    showDetails: true
  },
  seminar: {
    showTickets: true,
    showSpeakers: true,
    showSchedule: true,
    showSponsors: false,
    showMedia: true,
    showDetails: true
  }
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

const EditEvent: React.FC = () => {
  // Multi-language state for editing
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  // Handler for language selection
  const handleLanguageChange = (languages: string[]) => {
    setSelectedLanguages(languages);
    // Optionally, update eventData multilingual fields here if needed
    if (!languages.includes(currentLanguage)) {
      setCurrentLanguage(languages[0] || 'en');
    }
  };

  // Ticket categories state (init from eventData.ticketCategories)
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [showAddTicketCategory, setShowAddTicketCategory] = useState(false);
  const [newTicketCategoryName, setNewTicketCategoryName] = useState('');

  // ...eventData state and other hooks...

  // (Moved below eventData declaration)
  // Category API fetch hooks (must be at the top of the component, before return)
  interface Category { id: string; name: string; }
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);

  useEffect(() => {
    setCategoryLoading(true);
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then((data) => {
        // Defensive: ensure data is array and has id/name
        if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].name) {
          setCategories(data);
          // Nếu eventData.category không nằm trong danh sách, set về mặc định
          if (!eventData.category || !data.some((cat: Category) => cat.id === eventData.category)) {
            setEventData(prev => ({ ...prev, category: data[0].id }));
          }
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]))
      .finally(() => setCategoryLoading(false));
    // eslint-disable-next-line
  }, []); // only run once on mount
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [eventType, setEventType] = useState<string>('');
  const { t } = useLanguage();

interface TabConfigItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  order: number;
}
  const [tabConfigItems, setTabConfigItems] = useState<TabConfigItem[]>([]);
  const [tabConfigLoading, setTabConfigLoading] = useState(true);

  // Initialize event data state
  const [eventData, setEventData] = useState<EventData>({
    title: { en: '' },
    description: { en: '' },
    category: 'Technology',
    location: { en: '' },
    startDate: '',
    endDate: '',
    days: [],
    speakers: [],
    sponsors: [],
    booths: [],
    isFreeEvent: true,
    ticketTypes: [],
    media: []
    , ticketCategories: []
  });

  // When eventData loads, initialize ticketCategories from eventData.ticketCategories
  useEffect(() => {
    if (Array.isArray(eventData.ticketCategories)) {
      setTicketCategories(eventData.ticketCategories.map((name: string, idx: number) => ({ id: name, name })));
    } else {
      setTicketCategories([
        { id: 'General', name: 'General' },
        { id: 'Student', name: 'Student' },
        { id: 'Section A', name: 'Section A' },
        { id: 'Section B', name: 'Section B' },
        { id: 'Premium', name: 'Premium' },
      ]);
    }

    // Auto-detect all languages used in eventData fields
    const langs = new Set<string>();
    ['title', 'description', 'location'].forEach(field => {
      const val = (eventData as any)[field];
      if (val && typeof val === 'object') {
        Object.keys(val).forEach(lang => langs.add(lang));
      }
    });
    // If no language found, fallback to ['en']
    const detected = langs.size > 0 ? Array.from(langs) : ['en'];
    setSelectedLanguages(detected);
    // If currentLanguage not in detected, set to first
    if (!detected.includes(currentLanguage)) {
      setCurrentLanguage(detected[0]);
    }
  }, [eventData.ticketCategories, eventData.title, eventData.description, eventData.location]);

  // Fetch event data by eventId on mount
  // Helper to normalize multilingual fields
  function normalizeMultilingualField(val: any, fallback: string = ''): Record<string, string> {
    if (val && typeof val === 'object' && !Array.isArray(val)) return val;
    if (typeof val === 'string') return { en: val };
    return { en: fallback };
  }

  // Normalize ticket type
  function normalizeTicketType(ticket: any): any {
    // Always ensure name/description are multilingual and have all selectedLanguages
    let name = normalizeMultilingualField(ticket.name);
    let description = normalizeMultilingualField(ticket.description);
    // Fill missing languages with empty string
    if (Array.isArray(selectedLanguages)) {
      selectedLanguages.forEach(lang => {
        if (!name[lang]) name[lang] = '';
        if (!description[lang]) description[lang] = '';
      });
    }
    return {
      ...ticket,
      name,
      description,
    };
  }

  // Normalize speaker
  function normalizeSpeaker(speaker: any): any {
    return {
      ...speaker,
      name: normalizeMultilingualField(speaker.name),
      title: normalizeMultilingualField(speaker.title),
      bio: normalizeMultilingualField(speaker.bio),
    };
  }

  // Normalize booth
  function normalizeBooth(booth: any): any {
    return {
      ...booth,
      name: normalizeMultilingualField(booth.name),
      company: normalizeMultilingualField(booth.company),
      description: normalizeMultilingualField(booth.description),
      location: normalizeMultilingualField(booth.location),
    };
  }

  // Normalize activity
  function normalizeActivity(activity: any): any {
    return {
      ...activity,
      title: normalizeMultilingualField(activity.title),
      description: normalizeMultilingualField(activity.description),
      location: normalizeMultilingualField(activity.location),
    };
  }

  // Normalize day
  function normalizeDay(day: any): any {
    return {
      ...day,
      activities: Array.isArray(day.activities) ? day.activities.map(normalizeActivity) : [],
    };
  }

  useEffect(() => {
    if (!eventId) return;
    fetch(`${API_URL}/events/${eventId}`)
      .then(res => res.json())
      .then(data => {
        console.log('[EditEvent] eventData from backend:', data);
        // Normalize multilingual fields for eventData
        const normalized = {
          ...data,
          title: normalizeMultilingualField(data.title),
          description: normalizeMultilingualField(data.description),
          location: normalizeMultilingualField(data.location),
          days: Array.isArray(data.days) ? data.days.map(normalizeDay) : [],
          speakers: Array.isArray(data.speakers) ? data.speakers.map(normalizeSpeaker) : [],
          sponsors: Array.isArray(data.sponsors) ? data.sponsors : [],
          booths: Array.isArray(data.booths) ? data.booths.map(normalizeBooth) : [],
          ticketTypes: Array.isArray(data.ticketTypes) ? data.ticketTypes.map(normalizeTicketType) : [],
          media: Array.isArray(data.media) ? data.media : [],
        };
        setEventData(normalized);
        setEventType(data.eventType || '');
        // Nếu có tabConfig thì map sang tabSettings đúng structure UI mong đợi
        if (data.tabConfig && tabConfigItems.length > 0) {
          const mappedTabSettings: Record<string, boolean> = {};
          tabConfigItems.forEach(item => {
            if (item.key === 'basic') {
              mappedTabSettings[item.key] = true;
            } else {
              mappedTabSettings[item.key] =
                Object.prototype.hasOwnProperty.call(data.tabConfig, item.key)
                  ? !!data.tabConfig[item.key]
                  : false;
            }
          });
          setTabSettings(mappedTabSettings);
        }
      });
  }, [eventId, tabConfigItems]);

  const [tabSettings, setTabSettings] = useState<Record<string, boolean>>({
    showDetails: false,
    showMedia: false,
    showTickets: false,
    showSpeakers: false,
    showSchedule: false,
    showSponsors: false,
  });

  // Sponsorship Levels state for dynamic tier management
  const [tiers, setTiers] = useState<{ id: string, name: string }[]>([]);
  const [newTier, setNewTier] = useState('');

  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [eventTypeTabs, setEventTypeTabs] = useState<string[]>([]);

  // Fetch tab config from backend
  useEffect(() => {
    setTabConfigLoading(true);
    fetch(`${API_URL}/tab-configs`)
      .then(res => res.json())
      .then(data => {
        // Only show enabled tabs, sort by order
        setTabConfigItems(data.filter((item: any) => item.isEnabled).sort((a: any, b: any) => a.order - b.order));
        setTabConfigLoading(false);
      })
      .catch(() => setTabConfigLoading(false));
  }, []);

  // Fetch event types from backend
  useEffect(() => {
    fetch(`${API_URL}/event-types`)
      .then(res => res.json())
      .then(data => setEventTypes(data));
  }, []);

  // When eventType changes, update tabSettings to match the tabs configured for that event type
  useEffect(() => {
    if (eventType && eventTypes.length > 0 && tabConfigItems.length > 0) {
      const found = eventTypes.find((et: any) => et.key === eventType);
      if (found && Array.isArray(found.tabs)) {
        setEventTypeTabs(found.tabs);
        // Always show 'basic', hide all others except those in found.tabs
        const newSettings: Record<string, boolean> = {};
        tabConfigItems.forEach(item => {
          if (item.key === 'basic') {
            newSettings[item.key] = true;
          } else {
            newSettings[item.key] = found.tabs.includes(item.key);
          }
        });
        setTabSettings(newSettings);
      }
    }
  }, [eventType, eventTypes, tabConfigItems]);

  // When tabConfigItems change, reset tabSettings to hide all except 'basic' (unless already set by eventType)
  // Only initialize tabSettings from backend tabConfig ONCE after data load
  const [tabSettingsInitialized, setTabSettingsInitialized] = useState(false);
  useEffect(() => {
    if (!tabSettingsInitialized && eventData.tabConfig && tabConfigItems.length > 0) {
      const mappedTabSettings: Record<string, boolean> = {};
      tabConfigItems.forEach(item => {
        if (item.key === 'basic') {
          mappedTabSettings[item.key] = true;
        } else {
          mappedTabSettings[item.key] = !!eventData.tabConfig[item.key];
        }
      });
      setTabSettings(mappedTabSettings);
      setTabSettingsInitialized(true);
    }
  }, [eventData.tabConfig, tabConfigItems, tabSettingsInitialized]);

  // When tabConfigItems or tabSettings change, sync tabSettings keys with tabConfigItems
  // Remove redundant tabSettings reset effect

  const handleEventTypeChange = (type: string) => {
    setEventType(type);
    const defaults = eventTypeDefaults[type];
    if (defaults) {
      setTabSettings(prev => ({
        ...prev,
        ...defaults
      }));
    }
  };

  const handleTabSettingChange = (tab: string, enabled: boolean) => {
    setTabSettings(prev => {
      const updated = {
        ...prev,
        [tab]: enabled
      };
      // Immediately update eventData.tabConfig to match the new tabSettings
      setEventData(event => {
        const newTabConfig = {
          ...event.tabConfig,
          [tab]: enabled
        };
        console.log('[TabConfig] Updated tabConfig after toggle:', newTabConfig);
        return {
          ...event,
          tabConfig: newTabConfig
        };
      });
      return updated;
    });
  };

  // Multilingual interfaces
  interface Speaker {
    id: string;
    name: Record<string, string>;
    title: Record<string, string>;
    bio: Record<string, string>;
    avatarUrl: string;
  }

  interface ExhibitionBooth {
    id: string;
    name: Record<string, string>;
    company: Record<string, string>;
    description: Record<string, string>;
    location: Record<string, string>;
    coverImageUrl: string;
  }

  interface Activity {
    id: string;
    title: Record<string, string>;
    description: Record<string, string>;
    startTime: string;
    endTime: string;
    type: string;
    location: Record<string, string>;
    speakerIds: string[];
  }

  // State for new speaker form
  const [newSpeaker, setNewSpeaker] = useState<Omit<Speaker, 'id'>>({
    name: { en: '' },
    title: { en: '' },
    bio: { en: '' },
    avatarUrl: ''
  });

  // Initial state for newSponsor uses first tier if available
  const [newSponsor, setNewSponsor] = useState<any>({
    name: '',
    level: tiers[0]?.name || '',
    website: '',
    description: '',
    logoUrl: ''
  });

  // State for new booth form
  const [newBooth, setNewBooth] = useState<Omit<ExhibitionBooth, 'id'>>({
    name: { en: '' },
    company: { en: '' },
    description: { en: '' },
    location: { en: '' },
    coverImageUrl: ''
  });

  // State for selected day when adding activities
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // State for new activity form
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    title: { en: '' },
    description: { en: '' },
    startTime: '09:00',
    endTime: '10:00',
    type: 'workshop',
    location: { en: '' },
    speakerIds: [],
  });
  const handleSpeakerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (["name", "title", "bio"].includes(name)) {
      setNewSpeaker(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          [currentLanguage]: value,
        },
      }));
    } else {
      setNewSpeaker(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleBoothChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (["name", "company", "description", "location"].includes(name)) {
      setNewBooth(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          [currentLanguage]: value,
        },
      }));
    } else {
      setNewBooth(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // State for new ticket type form
  const [newTicketType, setNewTicketType] = useState<Omit<TicketType, 'id'>>({
    name: { [currentLanguage]: '' },
    description: { [currentLanguage]: '' },
    price: 0,
    quantity: 100,
    saleStartDate: '',
    saleEndDate: '',
    isEarlyBird: false,
    earlyBirdDiscount: 0,
    isVIP: false,
    category: 'General'
  });

  // Thêm state cho cover image
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Handler for basic info fields
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEventData(prev => ({ ...prev, [id]: value }));
  };

  // Toggle free event status
  const handleToggleFreeEvent = (checked: boolean) => {
    setEventData(prev => ({ ...prev, isFreeEvent: checked }));

    // If switching to free, clear any existing ticket types
    if (checked && eventData.ticketTypes.length > 0) {
      if (window.confirm(t('organizer.basic.convertToFreeConfirm'))) {
        setEventData(prev => ({ ...prev, ticketTypes: [] }));
      } else {
        setEventData(prev => ({ ...prev, isFreeEvent: false }));
      }
    }
  };

  // Handler for date changes - creates event days
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEventData(prev => ({ ...prev, [id]: value }));

    // If both start and end dates are selected
    if ((id === 'startDate' && eventData.endDate) || (id === 'endDate' && eventData.startDate)) {
      const start = id === 'startDate' ? new Date(value) : new Date(eventData.startDate);
      const end = id === 'endDate' ? new Date(value) : new Date(eventData.endDate);

      // Check if start date is after end date
      if (start > end) {
        alert(t('organizer.basic.dateError'));
        return;
      }

      // Create list of days
      const days: EventDay[] = [];
      const currentDate = new Date(start);

      let dayCount = 0;
      while (currentDate <= end) {
        days.push({
          id: `day-${dayCount}`,
          date: currentDate.toISOString().split('T')[0],
          activities: [],
        });
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
      }

      setEventData(prev => ({ ...prev, days }));
      if (days.length > 0 && !selectedDayId) {
        setSelectedDayId(days[0].id);
      }

      // Set ticket sale dates based on event dates if they're empty
      if (!newTicketType.saleStartDate) {
        const today = new Date().toISOString().split('T')[0];
        setNewTicketType(prev => ({
          ...prev,
          saleStartDate: today,
          saleEndDate: id === 'endDate' ? value : eventData.endDate,
        }));
      }
    }
  };

  // Handle image uploads 
  const handleImageUpload = (entityType: 'speaker' | 'sponsor' | 'booth', field: string, value: string) => {
    // In a real app, we would upload the file to a server and get a URL
    // For this example, we'll use placeholder URLs
    const placeholders = [
      "/placeholder.svg",
      "https://images.unsplash.com/photo-1501286353178-1ec881214838",
      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
    ];

    // Select a random placeholder
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

  const handleMediaFilesChange = (files: any[]) => {
    setEventData(prev => ({
      ...prev,
      media: files
    }));
  };

  // Hàm xử lý khi chọn file cover image
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  // Handler to add speaker
  const handleAddSpeaker = () => {
    // Validate multilingual fields for currentLanguage
    if (!newSpeaker.name[currentLanguage]?.trim() || !newSpeaker.title[currentLanguage]?.trim()) {
      return;
    }

    const newSpeakerWithId: Speaker = {
      ...newSpeaker,
      id: `speaker-${Date.now()}`,
      avatarUrl: newSpeaker.avatarUrl || "/placeholder.svg"
    };

    setEventData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeakerWithId],
    }));

    setNewSpeaker({
      name: { [currentLanguage]: '' },
      title: { [currentLanguage]: '' },
      bio: { [currentLanguage]: '' },
      avatarUrl: ''
    });
  };

  // Handler to add sponsor
  const handleAddSponsor = () => {
    if (!newSponsor.name.trim()) {
      return;
    }
    const newSponsorWithId: Sponsor = {
      ...newSponsor,
      id: `sponsor-${Date.now()}`,
      logoUrl: newSponsor.logoUrl || "/placeholder.svg"
    };
    setEventData(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, newSponsorWithId],
    }));
    // Reset form: set level to first available tier or ''
    setNewSponsor({
      name: '',
      level: tiers[0]?.name || '',
      website: '',
      description: '',
      logoUrl: ''
    });
  };

  // Handler to add booth
  const handleAddBooth = () => {
    if (!newBooth.name[currentLanguage]?.trim() || !newBooth.company[currentLanguage]?.trim()) {
      return;
    }

    const newBoothWithId: ExhibitionBooth = {
      ...newBooth,
      id: `booth-${Date.now()}`,
      coverImageUrl: newBooth.coverImageUrl || "/placeholder.svg"
    };

    setEventData(prev => ({
      ...prev,
      booths: [...prev.booths, newBoothWithId],
    }));

    setNewBooth({
      name: { [currentLanguage]: '' },
      company: { [currentLanguage]: '' },
      description: { [currentLanguage]: '' },
      location: { [currentLanguage]: '' },
      coverImageUrl: ''
    });
  };

  // Handler to remove speaker
  const handleRemoveSpeaker = (speakerId: string) => {
    setEventData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(speaker => speaker.id !== speakerId),
      // Also remove speaker from any activities
      days: prev.days.map(day => ({
        ...day,
        activities: day.activities.map(activity => ({
          ...activity,
          speakerIds: activity.speakerIds?.filter(id => id !== speakerId) || [],
        })),
      })),
    }));
  };

  // Handler to remove sponsor
  const handleRemoveSponsor = (sponsorId: string) => {
    setEventData(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter(sponsor => sponsor.id !== sponsorId)
    }));
  };

  // Handler to remove booth
  const handleRemoveBooth = (boothId: string) => {
    setEventData(prev => ({
      ...prev,
      booths: prev.booths.filter(booth => booth.id !== boothId)
    }));
  };

  // Handler to add activity
  const handleAddActivity = () => {
    if (!selectedDayId || !newActivity.title[currentLanguage]?.trim() || !newActivity.startTime || !newActivity.endTime) {
      return;
    }

    const newActivityWithId: Activity = {
      ...newActivity,
      id: `activity-${Date.now()}`,
    };

    setEventData(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === selectedDayId) {
          return {
            ...day,
            activities: [...day.activities, newActivityWithId],
          };
        }
        return day;
      }),
    }));

    setNewActivity({
      title: { [currentLanguage]: '' },
      description: { [currentLanguage]: '' },
      startTime: '09:00',
      endTime: '10:00',
      type: 'workshop',
      location: { [currentLanguage]: '' },
      speakerIds: [],
    });
  };

  // Handler to add ticket type
  const handleAddTicketType = () => {
    if (!newTicketType.name?.[currentLanguage]?.trim()) {
      alert(t('organizer.tickets.nameRequired'));
      return;
    }
    if (!eventData.isFreeEvent && newTicketType.price <= 0) {
      alert(t('organizer.tickets.priceError'));
      return;
    }
    // Validate saleStartDate and saleEndDate
    if (!newTicketType.saleStartDate || !newTicketType.saleEndDate) {
      alert(t('organizer.tickets.saleDateRequired') || 'Please enter both Sale Start Date and Sale End Date for the ticket.');
      return;
    }
    const newTicketWithId: TicketType = {
      ...newTicketType,
      id: `ticket-${Date.now()}`,
      price: eventData.isFreeEvent ? 0 : newTicketType.price,
    };
    setEventData(prev => {
      const cat = newTicketType.category || 'General';
      const updatedCategories = Array.isArray(prev.ticketCategories)
        ? (prev.ticketCategories.includes(cat) ? prev.ticketCategories : [...prev.ticketCategories, cat])
        : [cat];
      const next = {
        ...prev,
        ticketTypes: [...prev.ticketTypes, newTicketWithId],
        ticketCategories: updatedCategories
      };
      console.log('[handleAddTicketType] ticketCategories:', next.ticketCategories);
      return next;
    });
    setNewTicketType({
      name: { [currentLanguage]: '' },
      description: { [currentLanguage]: '' },
      price: 0,
      quantity: 100,
      saleStartDate: newTicketType.saleStartDate,
      saleEndDate: newTicketType.saleEndDate,
      isEarlyBird: false,
      earlyBirdDiscount: 0,
      isVIP: false,
      category: 'General'
    });
  };

  // Handler to remove ticket type
  const handleRemoveTicketType = (ticketId: string) => {
    setEventData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter(ticket => ticket.id !== ticketId)
    }));
  };

  // Handler for ticket type field changes
  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const numValue = type === 'number' ? parseFloat(value) : value;
    if (name === 'name' || name === 'description') {
      setNewTicketType(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          [currentLanguage]: value,
        },
      }));
    } else {
      setNewTicketType(prev => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  // Handler for checkbox/switch controls in ticket form
  const handleTicketToggle = (field: keyof TicketType, value: boolean) => {
    setNewTicketType(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler to remove activity
  const handleRemoveActivity = (dayId: string, activityId: string) => {
    setEventData(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.filter(activity => activity.id !== activityId),
          };
        }
        return day;
      }),
    }));
  };

  // Handler for speaker selection in activity
  const handleActivitySpeakerChange = (selected: string[]) => {
    setNewActivity(prev => ({
      ...prev,
      speakerIds: selected,
    }));
  };

  // Handler for activity field changes
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (["title", "description", "location"].includes(name)) {
      setNewActivity(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          [currentLanguage]: value,
        },
      }));
    } else {
      setNewActivity(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handler for form submission (PATCH for edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for required fields
    if (!eventData.title || !eventData.startDate || !eventData.endDate) {
      alert(t('organizer.editEvent?.fillRequired') || t('organizer.createEvent.fillRequired'));
      return;
    }

    // Check if there's at least one ticket type for paid events
    if (!eventData.isFreeEvent && eventData.ticketTypes.length === 0) {
      alert(t('organizer.editEvent?.ticketRequired') || t('organizer.createEvent.ticketRequired'));
      return;
    }

    // Remove local-only fields and ensure DTO shape for backend
    function stripId(obj: any) {
      // Remove 'id' if it starts with 'temp-' or 'ticket-', 'speaker-', etc.
      if (obj && typeof obj === 'object') {
        const { id, ...rest } = obj;
        // Only remove id if it's a local temp id (string starting with known prefix)
        if (typeof id === 'string' && (/^(temp-|ticket-|speaker-|sponsor-|booth-|activity-)/.test(id))) {
          return rest;
        }
        return obj;
      }
      return obj;
    }

    function cleanEventData(data: EventData): EventData {
      return {
        ...data,
        media: Array.isArray(data.media) ? data.media : [],
        days: Array.isArray(data.days)
          ? data.days.map(day => ({
            ...stripId(day),
            activities: Array.isArray(day.activities)
              ? day.activities.map(act => stripId(act))
              : [],
          }))
          : [],
        speakers: Array.isArray(data.speakers)
          ? data.speakers.map(speaker => stripId(speaker))
          : [],
        sponsors: Array.isArray(data.sponsors)
          ? data.sponsors.map(sponsor => stripId(sponsor))
          : [],
        booths: Array.isArray(data.booths)
          ? data.booths.map(booth => stripId(booth))
          : [],
        ticketTypes: Array.isArray(data.ticketTypes)
          ? data.ticketTypes.map(ticket => {
            const t = stripId(ticket);
            return {
              ...t,
              price: typeof t.price === 'string' ? Number(t.price) : t.price,
            };
          })
          : [],
        ticketCategories: Array.isArray(data.ticketCategories)
          ? data.ticketCategories.filter((cat, idx, arr) => typeof cat === 'string' && cat && arr.indexOf(cat) === idx)
          : [],
      };
    }

    try {
      // Always build tabConfig from tabSettings at submit time for most up-to-date UI state
      const filteredTabConfig: Record<string, boolean> = {};
      tabConfigItems.forEach(item => {
        if (item.key === 'basic') {
          filteredTabConfig[item.key] = true;
        } else {
          filteredTabConfig[item.key] = !!tabSettings[item.key];
        }
      });
      // Use the latest eventData, but always overwrite tabConfig with filteredTabConfig
      const cleanedData = cleanEventData({ ...eventData, tabConfig: filteredTabConfig });
      const eventPayload = {
        ...cleanedData,
        tabConfig: filteredTabConfig,
        eventType: eventType
      };
      // Log the full event payload for debugging
      console.log('[handleSubmit] eventPayload:', eventPayload);
      if (!eventId) throw new Error('Missing eventId');
      const response = await fetch(`${API_URL}/events/${eventId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventPayload),
        }
      );
      if (!response.ok) throw new Error('Update failed');
      // Update tiers if needed (edit mode: only update tiers that are temp)
      if (tiers.length > 0) {
        const createdTiers: { id: string, name: string }[] = [];
        for (const tier of tiers) {
          if (tier.id.startsWith('temp-')) {
            const res = await fetch(`${API_URL}/events/${eventId}/sponsorship-levels`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: tier.name })
            });
            if (res.ok) {
              const created = await res.json();
              createdTiers.push(created);
            }
          } else {
            createdTiers.push(tier);
          }
        }
        setTiers(createdTiers);
      }
      alert(t('organizer.editEvent.success') || t('organizer.createEvent.success'));
      // Không chuyển về dashboard, chỉ thông báo thành công
    } catch (err) {
      alert(t('organizer.editEvent.error') || t('organizer.createEvent.error'));
    }
  };

  // Helper to get selected day
  const getSelectedDay = () => {
    return eventData.days.find(day => day.id === selectedDayId);
  };

  // Helper to format time
  const formatTime = (time: string) => {
    return time;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper to sort activities by start time
  const sortActivitiesByTime = (activities: Activity[]) => {
    return [...activities].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  };

  // Fix for TypeScript errors - safely handle tab clicks
  const navigateToTab = (tabValue: string) => {
    const tabElement = document.querySelector(`[data-value="${tabValue}"]`) as HTMLElement | null;
    if (tabElement && 'click' in tabElement) {
      tabElement.click();
    }
  };

  // Get sponsor level badge color
  const getSponsorLevelColor = (level: Sponsor['level']) => {
    switch (level) {
      case 'platinum': return 'bg-slate-300 hover:bg-slate-300';
      case 'gold': return 'bg-yellow-300 hover:bg-yellow-400 text-yellow-900';
      case 'silver': return 'bg-gray-300 hover:bg-gray-400 text-gray-900';
      case 'bronze': return 'bg-amber-700 hover:bg-amber-800 text-white';
      default: return '';
    }
  };

  // Get ticket category badge color
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

  // Returns the number of visible tabs (excluding settings/basic)
  const getVisibleTabsCount = () => {
    // Only count tabs that are enabled and present in tabConfigItems
    return tabConfigItems.filter(item => tabSettings[item.key]).length + 2; // Settings + Basic
  };

  // Fetch tiers for this event (replace eventId with actual event id from props or context)
  React.useEffect(() => {
    if (eventData.id) {
      fetch(`${API_URL}/events/${eventData.id}/sponsorship-levels`)
        .then(res => res.json())
        .then(data => setTiers(data));
    }
  }, [eventData.id]);

  // When tiers change, if newSponsor.level is empty, set it to the first tier
  React.useEffect(() => {
    if (tiers.length > 0 && !newSponsor.level) {
      setNewSponsor(prev => ({ ...prev, level: tiers[0].name }));
    }
  }, [tiers, newSponsor.level]);

  const handleAddTier = async () => {
    if (!newTier.trim() || tiers.some(t => t.name === newTier.trim())) return;
    if (!eventData.id) {
      // No eventId yet, just update state
      setTiers([...tiers, { id: `temp-${Date.now()}`, name: newTier.trim() }]);
      setNewTier('');
    } else {
      // Event exists, call API
      const res = await fetch(`${API_URL}/events/${eventData.id}/sponsorship-levels`, {
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
    let deletedTierName = '';
    const tierObj = tiers.find(t => t.id === tierId);
    if (tierObj) deletedTierName = tierObj.name;
    if (!eventData.id) {
      // No eventId yet, just update state
      setTiers(tiers.filter(t => t.id !== tierId));
      setEventData(prev => ({
        ...prev,
        sponsors: prev.sponsors.filter(s => s.level !== deletedTierName)
      }));
    } else {
      // Event exists, call API
      const res = await fetch(`${API_URL}/events/${eventData.id}/sponsorship-levels/${tierId}`, { method: 'DELETE' });
      if (res.ok) {
        setTiers(tiers.filter(t => t.id !== tierId));
        setEventData(prev => ({
          ...prev,
          sponsors: prev.sponsors.filter(s => s.level !== deletedTierName)
        }));
      }
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('organizer.editEventTitle') || t('organizer.createEventTitle') || 'Edit Event'}</h1>
          <Button variant="outline" onClick={() => navigate('/organizer/dashboard')}>
            {t('organizer.cancel')}
          </Button>
        </div>

        {/* Language Selector UI */}
        {/* Global Language Selector */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <LanguageSelector
              selectedLanguages={selectedLanguages}
              onLanguageChange={handleLanguageChange}
              currentLanguage={currentLanguage}
              onCurrentLanguageChange={setCurrentLanguage}
            />
            {selectedLanguages.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Currently editing in:</strong> {currentLanguage.toUpperCase()} • All content fields will be saved for the selected language
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className={`flex w-full flex-nowrap overflow-x-auto gap-1 bg-white/90 border-b border-gray-200`}>
              <TabsTrigger value="settings" className="min-w-[64px] px-0.5 md:min-w-[160px] md:px-6 whitespace-nowrap">{t('organizer.tabs.settings') || 'Settings'}</TabsTrigger>
              <TabsTrigger value="basic" className="min-w-[64px] px-0.5 md:min-w-[160px] md:px-6 whitespace-nowrap">{t('organizer.tabs.basic')}</TabsTrigger>
              {/* Render dynamic tabs based on tabConfigItems and tabSettings */}
              {tabConfigItems.map(item => {
                const isEnabled = tabSettings[item.key];
                if (!isEnabled) return null;
                return (
                  <TabsTrigger key={item.key} value={item.key} className="min-w-[64px] px-0.5 md:min-w-[160px] md:px-6 whitespace-nowrap">
                    {t(item.title) || item.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              <EventSettingsTab
                eventType={eventType}
                eventTypes={eventTypes}
                handleEventTypeChange={handleEventTypeChange}
                tabConfigItems={tabConfigItems}
                tabConfigLoading={tabConfigLoading}
                tabSettings={tabSettings}
                handleTabSettingChange={handleTabSettingChange}
                t={t}
                LucideIcons={LucideIcons}
              />
            </TabsContent>

            <TabsContent value="basic">
              <CardContent className="pt-6">
                <EventBasicInfoForm
                  eventData={eventData}
                  currentLanguage={currentLanguage}
                  selectedLanguages={selectedLanguages}
                  onLanguageChange={handleLanguageChange}
                  onCurrentLanguageChange={setCurrentLanguage}
                  handleBasicInfoChange={handleBasicInfoChange}
                  handleMultilingualInputChange={(field, value, lang) => {
                    setEventData(prev => ({
                      ...prev,
                      [field]: {
                        ...prev[field],
                        [lang]: value,
                      },
                    }));
                  }}
                  handleCoverImageChange={handleCoverImageChange}
                  coverImage={coverImage}
                  categoryLoading={categoryLoading}
                  categories={categories}
                  handleDateChange={handleDateChange}
                  handleToggleFreeEvent={handleToggleFreeEvent}
                />
              </CardContent>
            </TabsContent>

            {/* New Tickets Tab */}
            <TabsContent value="tickets">
              <CardContent className="pt-6">
                <EventTicketsTab
                  eventData={eventData}
                  newTicketType={newTicketType}
                  setNewTicketType={setNewTicketType}
                  ticketCategories={ticketCategories}
                  setTicketCategories={setTicketCategories}
                  showAddTicketCategory={showAddTicketCategory}
                  setShowAddTicketCategory={setShowAddTicketCategory}
                  newTicketCategoryName={newTicketCategoryName}
                  setNewTicketCategoryName={setNewTicketCategoryName}
                  handleTicketChange={handleTicketChange}
                  handleTicketToggle={handleTicketToggle}
                  handleAddTicketType={handleAddTicketType}
                  handleRemoveTicketType={handleRemoveTicketType}
                  handleFreeEventToggle={handleToggleFreeEvent}
                  currentLanguage={currentLanguage}
                  t={t}
                  formatCurrency={formatCurrency}
                  getTicketCategoryColor={getTicketCategoryColor}
                  navigateToTab={navigateToTab}
                />
              </CardContent>
            </TabsContent>

            {/* Speakers Tab */}
            <TabsContent value="speakers">
              <CardContent className="pt-6">
                <EventSpeakersTab
                  eventData={eventData}
                  speakers={eventData.speakers}
                  newSpeaker={newSpeaker}
                  setNewSpeaker={setNewSpeaker}
                  handleSpeakerChange={handleSpeakerChange}
                  handleAddSpeaker={handleAddSpeaker}
                  handleRemoveSpeaker={handleRemoveSpeaker}
                  currentLanguage={currentLanguage}
                  t={t}
                  handleImageUpload={(field, value) => handleImageUpload('speaker', field, value)}
                />
              </CardContent>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <CardContent className="pt-6">
                <EventScheduleTab
                  eventData={eventData}
                  selectedDayId={selectedDayId}
                  setSelectedDayId={setSelectedDayId}
                  newActivity={newActivity}
                  setNewActivity={setNewActivity}
                  handleActivityChange={handleActivityChange}
                  handleAddActivity={handleAddActivity}
                  handleRemoveActivity={handleRemoveActivity}
                  handleActivitySpeakerChange={handleActivitySpeakerChange}
                  getSelectedDay={getSelectedDay}
                  formatTime={formatTime}
                  sortActivitiesByTime={sortActivitiesByTime}
                  currentLanguage={currentLanguage}
                  t={t}
                />
              </CardContent>
            </TabsContent>

            <TabsContent value="sponsors">
              <CardContent className="pt-6">
                <EventSponsorsTab
                  eventData={eventData}
                  sponsors={eventData.sponsors}
                  newSponsor={newSponsor}
                  setNewSponsor={setNewSponsor}
                  handleAddSponsor={handleAddSponsor}
                  handleRemoveSponsor={handleRemoveSponsor}
                  tiers={tiers}
                  setTiers={setTiers}
                  newTier={newTier}
                  setNewTier={setNewTier}
                  handleAddTier={handleAddTier}
                  handleDeleteTier={handleDeleteTier}
                  getSponsorLevelColor={getSponsorLevelColor}
                  currentLanguage={currentLanguage}
                  t={t}
                />
              </CardContent>
            </TabsContent>

            <TabsContent value="booths">
              <CardContent className="pt-6">
                <EventBoothsTab
                  eventData={eventData}
                  booths={eventData.booths}
                  newBooth={newBooth}
                  setNewBooth={setNewBooth}
                  handleBoothChange={handleBoothChange}
                  handleAddBooth={handleAddBooth}
                  handleRemoveBooth={handleRemoveBooth}
                  currentLanguage={currentLanguage}
                  t={t}
                  handleImageUpload={(field, value) => handleImageUpload('booth', field, value)}
                />
              </CardContent>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <CardContent className="pt-6">
                <EventMediaTab
                  mediaFiles={eventData.media}
                  handleMediaFilesChange={handleMediaFilesChange}
                  currentLanguage={currentLanguage}
                  t={t}
                />
              </CardContent>
            </TabsContent>

          </Tabs>
          <CardFooter className="border-t p-6 flex justify-between">
            <Button variant="outline" onClick={() => navigate('/organizer/dashboard')}>
              {t('organizer.cancel')}
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {t('organizer.editEvent.saveButton') || t('organizer.editEvent.save') || 'Cập nhật sự kiện'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('organizer.createEvent.tipsTitle')}</CardTitle>
            <CardDescription>
              {t('organizer.createEvent.tipsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('organizer.createEvent.tip1')}</li>
              <li>{t('organizer.createEvent.tip2')}</li>
              <li>{t('organizer.createEvent.tip3')}</li>
              <li>{t('organizer.createEvent.tip4')}</li>
              <li>{t('organizer.createEvent.tip5')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditEvent;
