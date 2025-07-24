import { RichTextEditor } from '@/components/ui/rich-text-editor';
// Ticket Category type
interface TicketCategory {
  id: string;
  name: string;
}

// Multilingual text type
interface MultilingualText {
  [languageCode: string]: string;
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { randomEventTestData } from '../../data/eventTestData';

const showFillTestData = import.meta.env.VITE_ENV === 'dev';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// (Replaced by patched RichTextEditor below)
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabNavigation from '@/components/event/TabNavigation';
import EventSpeakersTab from "@/components/event/EventSpeakersTab";
import EventScheduleTab from "@/components/event/EventScheduleTab";
import EventTicketsTab from "@/components/event/EventTicketsTab";
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
import EventBasicInfoForm from '@/components/event/EventBasicInfoForm';
import EventBoothsTab from '@/components/event/EventBoothsTab';
import EventSettingsTab from '@/components/event/EventSettingsTab';
import EventMediaTab from '@/components/event/EventMediaTab';
import * as LucideIcons from 'lucide-react';
import LanguageSelector from '@/components/organizer/LanguageSelector';

// Define types
interface Speaker {
  id: string;
  name: MultilingualText;
  title: MultilingualText;
  bio?: MultilingualText;
  avatarUrl?: string;
}

interface Sponsor {
  id: string;
  name: MultilingualText;
  level: string; // changed from union to string for dynamic tiers
  website?: string;
  description?: MultilingualText;
  logoUrl?: string;
}

interface ExhibitionBooth {
  id: string;
  name: MultilingualText;
  company: MultilingualText;
  description?: MultilingualText;
  location?: MultilingualText;
  coverImageUrl?: string;
}

interface Activity {
  id: string;
  title: MultilingualText;
  description?: MultilingualText;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'workshop' | 'exhibit' | 'networking' | 'other';
  location?: MultilingualText;
  speakerIds?: string[];
}

interface EventDay {
  id: string;
  date: string;
  activities: Activity[];
}

interface TicketType {
  id: string;
  name: MultilingualText;
  description?: MultilingualText;
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
  title: MultilingualText;
  description: MultilingualText;
  category: string;
  location: MultilingualText;
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
  // Multilingual content for other tabs (optional, for future use)
  ticketDescriptions?: MultilingualText;
  speakerBios?: MultilingualText;
  scheduleNotes?: MultilingualText;
  sponsorInfo?: MultilingualText;
  exhibitionInfo?: MultilingualText;
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


// --- Fix: RichTextEditor not displaying on initial load ---
import EventSponsorsTab from '@/components/event/EventSponsorsTab';


const CreateEvent: React.FC = () => {
  // Ref for sponsor description editor
  const sponsorDescEditorRef = useRef<HTMLDivElement | null>(null);

  // Place this effect after tiers is declared
  // Track the active tab
  const [activeTab, setActiveTab] = useState('settings');
  // Ref to know if first render
  const firstRender = useRef(true);

  // Whenever activeTab changes, trigger a resize event (for ReactQuill/Editor)
  useEffect(() => {
    if (!firstRender.current) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    } else {
      firstRender.current = false;
    }
  }, [activeTab]);




  const navigate = useNavigate();
  const [eventType, setEventType] = useState<string>('');
  const { t } = useLanguage();

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
          if (!eventData.category || !data.some(cat => cat.id === eventData.category)) {
            setEventData(prev => ({ ...prev, category: data[0].id }));
          }
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]))
      .finally(() => setCategoryLoading(false));
    // eslint-disable-next-line
  }, []); // do NOT depend on eventData.category to avoid infinite loop

  // Initialize event data state

  // Language state

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

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
  });

  // Debug: Log multilingual fields when language changes
  useEffect(() => {
    //console.log("eventData:", eventData.title);
    //console.log("eventData.description:", eventData.description);
  }, [currentLanguage, eventData.title, eventData.description]);

  const [tabSettings, setTabSettings] = useState<Record<string, boolean>>({
    showDetails: false,
    showMedia: false,
    showTickets: false,
    showSpeakers: false,
    showSchedule: false,
    showSponsors: false,
  });

  // Sponsorship Levels state for dynamic tier management
  interface MultilingualText {
    [languageCode: string]: string;
  }
  interface Tier {
    id: string;
    name: MultilingualText;
  }
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [newTier, setNewTier] = useState<MultilingualText>({ [currentLanguage]: '' });

  // Add Tier handler for multilingual
  const handleAddTier = async () => {
    if (!newTier[currentLanguage] || !newTier[currentLanguage].trim()) return;
    if (!eventData.id) {
      setTiers(prev => ([
        ...prev,
        { id: `temp-${Date.now()}`, name: { ...newTier } }
      ]));
      setNewTier({ [currentLanguage]: '' });
    } else {
      // Event exists, call API
      const res = await fetch(`${API_URL}/events/${eventData.id}/sponsorship-levels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTier })
      });
      if (res.ok) {
        const created = await res.json();
        setTiers(prev => ([...prev, created]));
        setNewTier({ [currentLanguage]: '' });
      }
    }
  };

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

  interface EventType {
    key: string;
    name: string;
    tabs: string[];
  }
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventTypeTabs, setEventTypeTabs] = useState<string[]>([]);

  // Fetch tab config from backend
  useEffect(() => {
    setTabConfigLoading(true);
    fetch(`${API_URL}/tab-configs`)
      .then(res => res.json())
      .then(data => {
        // Only show enabled tabs, sort by order
        setTabConfigItems((data as TabConfigItem[]).filter((item) => item.isEnabled).sort((a, b) => a.order - b.order));
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
      const found = eventTypes.find((et) => et.key === eventType);
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
  useEffect(() => {
    if (tabConfigItems.length > 0 && !eventType) {
      const initialSettings: Record<string, boolean> = {};
      tabConfigItems.forEach(item => {
        if (item.key === 'basic') {
          initialSettings[item.key] = true;
        } else {
          initialSettings[item.key] = false;
        }
      });
      setTabSettings(initialSettings);
    }
  }, [tabConfigItems, eventType]);

  // When tabConfigItems or tabSettings change, sync tabSettings keys with tabConfigItems
  useEffect(() => {
    if (tabConfigItems.length > 0) {
      // Khởi tạo mặc định: tất cả tab động đều ẩn, chỉ tab 'basic' hiển thị
      const initialSettings: Record<string, boolean> = {};
      tabConfigItems.forEach(item => {
        if (item.key === 'basic') {
          initialSettings[item.key] = true; // Tab Basic Info luôn hiển thị
        } else {
          initialSettings[item.key] = false; // Các tab động mặc định ẩn
        }
      });
      setTabSettings(initialSettings);
    }
  }, [tabConfigItems]);

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
    setTabSettings(prev => ({
      ...prev,
      [tab]: enabled
    }));
  };

  // State for new speaker form
  const [newSpeaker, setNewSpeaker] = useState<Omit<Speaker, 'id'>>({
    name: { [currentLanguage]: '' },
    title: { [currentLanguage]: '' },
    bio: { [currentLanguage]: '' },
    avatarUrl: ''
  });

  // Initial state for newSponsor uses first tier if available
  const [newSponsor, setNewSponsor] = useState<Omit<Sponsor, 'id'>>({
    name: { [currentLanguage]: '' },
    level: tiers[0]?.name?.[currentLanguage] || '',
    website: '',
    description: { [currentLanguage]: '' },
    logoUrl: ''
  });

  // State for new booth form
  const [newBooth, setNewBooth] = useState<Omit<ExhibitionBooth, 'id'>>({
    name: { [currentLanguage]: '' },
    company: { [currentLanguage]: '' },
    description: { [currentLanguage]: '' },
    location: { [currentLanguage]: '' },
    coverImageUrl: ''
  });

  // State for selected day when adding activities
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // State for new activity form
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    title: { [currentLanguage]: '' },
    description: { [currentLanguage]: '' },
    startTime: '09:00',
    endTime: '10:00',
    type: 'workshop',
    location: { [currentLanguage]: '' },
    speakerIds: [],
  });

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

  // State for ticket categories (for dropdown)
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([
  ]);
  const [showAddTicketCategory, setShowAddTicketCategory] = useState(false);
  const [newTicketCategoryName, setNewTicketCategoryName] = useState('');

  // Thêm state cho cover image
  const [coverImage, setCoverImage] = useState<File | null>(null);


  // Handler for basic info fields (multilingual for title, description, location)
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (["title", "description", "location"].includes(id)) {
      setEventData(prev => {
        // Always preserve all multilingual fields as objects
        const newTitle = typeof prev.title === 'object' && prev.title !== null ? { ...prev.title } : { [currentLanguage]: '' };
        const newDescription = typeof prev.description === 'object' && prev.description !== null ? { ...prev.description } : { [currentLanguage]: '' };
        const newLocation = typeof prev.location === 'object' && prev.location !== null ? { ...prev.location } : { [currentLanguage]: '' };
        if (id === 'title') newTitle[currentLanguage] = value;
        if (id === 'description') newDescription[currentLanguage] = value;
        if (id === 'location') newLocation[currentLanguage] = value;
        return {
          ...prev,
          title: newTitle,
          description: newDescription,
          location: newLocation
        };
      });
    } else {
      setEventData(prev => ({ ...prev, [id]: value }));
    }
  };

  // Handler for multilingual rich text fields (for future use)
  const handleMultilingualInputChange = (field: keyof EventData, value: string, language: string = currentLanguage) => {
    setEventData(prev => {
      const newField = {
        ...((typeof prev[field] === 'object' && prev[field] !== null) ? prev[field] : {}),
        [language]: value
      };
      return {
        ...prev,
        [field]: newField
      };
    });
  };

  // Handler for language selection
  const handleLanguageChange = (languages: string[]) => {
    setSelectedLanguages(languages);
    setEventData(prev => {
      // Only add missing language keys, never replace the whole object
      const newTitle = { ...prev.title };
      const newDescription = { ...prev.description };
      const newLocation = { ...prev.location };
      languages.forEach(lang => {
        if (!newTitle[lang]) newTitle[lang] = '';
        if (!newDescription[lang]) newDescription[lang] = '';
        if (!newLocation[lang]) newLocation[lang] = '';
      });
      const result = {
        ...prev,
        title: newTitle,
        description: newDescription,
        location: newLocation,
      };
      console.log('[handleLanguageChange]', { prev, result });
      return result;
    });
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

  // MediaFile type for MediaUpload
  // Use MediaFile type from MediaUpload
  // Duplicate MediaFile type for compatibility with MediaUpload
  type MediaFile = {
    id: string;
    name: string;
    type: 'image' | 'video' | 'document' | 'presentation';
    size: number;
    url?: string;
    file?: File;
  };
  const handleMediaFilesChange = (files: MediaFile[]) => {
    setEventData(prev => ({
      ...prev,
      media: files.map(f => f.url || '')
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
    if (!newSpeaker.name?.[currentLanguage] || !newSpeaker.name[currentLanguage].trim() ||
        !newSpeaker.title?.[currentLanguage] || !newSpeaker.title[currentLanguage].trim()) {
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
    // Check for empty name in the current language
    if (!newSponsor.name?.[currentLanguage] || !newSponsor.name[currentLanguage].trim()) {
      return;
    }
    const newSponsorWithId: Sponsor = {
      ...newSponsor,
      id: `sponsor-${Date.now()}`,
      name: { ...newSponsor.name },
      description: { ...newSponsor.description },
      logoUrl: newSponsor.logoUrl || "/placeholder.svg"
    };
    setEventData(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, newSponsorWithId],
    }));
    // Reset form: set level to first available tier or ''
    setNewSponsor({
      name: { [currentLanguage]: '' },
      level: tiers[0]?.name?.[currentLanguage] || '',
      website: '',
      description: { [currentLanguage]: '' },
      logoUrl: ''
    });
  };

  // Handler to add booth
  const handleAddBooth = () => {
    if (!newBooth.name?.[currentLanguage] || !newBooth.name[currentLanguage].trim() ||
        !newBooth.company?.[currentLanguage] || !newBooth.company[currentLanguage].trim()) {
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
    if (!selectedDayId || !newActivity.title[currentLanguage] || !newActivity.title[currentLanguage].trim() || !newActivity.startTime || !newActivity.endTime) {
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
    // Log the ticket category value for debugging


    if (!newTicketType.name?.[currentLanguage] || !newTicketType.name[currentLanguage].trim()) {
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
      // Store the ticket category as the selected value (name, for both default and user-added)
      category: newTicketType.category || '',
    };

    setEventData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTicketWithId],
    }));

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
      category: ''
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

    setNewTicketType(prev => ({
      ...prev,
      [name]: numValue,
    }));
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
    setNewActivity(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for required fields
    if (!eventData.title || !eventData.startDate || !eventData.endDate) {
      alert(t('organizer.createEvent.fillRequired'));
      return;
    }

    // Check if there's at least one ticket type for paid events
    if (!eventData.isFreeEvent && eventData.ticketTypes.length === 0) {
      alert(t('organizer.createEvent.ticketRequired'));
      return;
    }

    // Utility: Clean event data before sending to API
    function cleanEventData(data: EventData): EventData {
      return {
        ...data,
        // Giữ nguyên các trường đa ngôn ngữ chính là object
        title: data.title,
        description: data.description,
        location: data.location,
        speakers: Array.isArray(data.speakers)
          ? data.speakers.map(s => ({
              ...s,
              name: s.name,
              title: s.title,
              bio: s.bio,
            }))
          : [],
        sponsors: Array.isArray(data.sponsors)
          ? data.sponsors.map(s => ({
              ...s,
              name: s.name,
              description: s.description,
            }))
          : [],
        booths: Array.isArray(data.booths)
          ? data.booths.map(b => ({
              ...b,
              name: b.name,
              company: b.company,
              description: b.description,
              location: b.location,
            }))
          : [],
        ticketTypes: Array.isArray(data.ticketTypes)
          ? data.ticketTypes.map(t => ({
              ...t,
              name: t.name,
              description: t.description,
            }))
          : [],
        days: Array.isArray(data.days)
          ? data.days.map(day => ({
              ...day,
              activities: Array.isArray(day.activities)
                ? day.activities.map(act => ({
                    ...act,
                    title: act.title,
                    description: act.description,
                    location: act.location,
                  }))
                : [],
            }))
          : [],
        media: Array.isArray(data.media) ? data.media : [],
      };
    }

    try {
      const cleanedData = cleanEventData(eventData);
      // Add eventType to payload
      const eventPayload = {
        ...cleanedData,
        tabConfig: tabSettings, // lưu trạng thái tab hiện tại
        eventType: eventType, // NEW: include selected event type
        ticketCategories: ticketCategories.map(cat => cat.name)
      };
      // Debug: log payload gửi lên backend
      console.log('[CreateEvent] Payload gửi lên backend:', eventPayload);
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
      });
      // Debug: log response trả về
      console.log('[CreateEvent] Response status:', response.status);
      let createdEvent = null;
      try {
        createdEvent = await response.json();
        console.log('[CreateEvent] Response body:', createdEvent);
      } catch (jsonErr) {
        console.error('[CreateEvent] Lỗi parse response:', jsonErr);
      }
      if (!response.ok) throw new Error('Create failed');

      // Ticket categories are now saved directly in the event object. No need to call ticket-categories API.

      // 2. If there are tiers in state, create them in backend
      if (tiers.length > 0 && createdEvent && createdEvent.id) {
        const createdTiers: Tier[] = [];
        for (const tier of tiers) {
          // Only send tiers that are not already in backend (id starts with temp-)
          if (tier.id.startsWith('temp-')) {
            // Convert name to string for backend
            const res = await fetch(`${API_URL}/events/${createdEvent.id}/sponsorship-levels`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: tier.name[currentLanguage] || Object.values(tier.name)[0] || '' })
            });
            if (res.ok) {
              const created = await res.json();
              // Convert back to MultilingualText for state
              createdTiers.push({ id: created.id, name: { [currentLanguage]: created.name } });
            }
          } else {
            createdTiers.push(tier);
          }
        }
        setTiers(createdTiers);
      }
      alert(t('organizer.createEvent.success'));
      navigate('/organizer/dashboard');
    } catch (err) {
      console.error('[CreateEvent] Lỗi tạo event:', err);
      alert(t('organizer.createEvent.error'));
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
      setNewSponsor(prev => ({ ...prev, level: tiers[0].name?.[currentLanguage] || '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiers, currentLanguage]);



  const handleDeleteTier = async (tierId: string) => {
    let deletedTierName = '';
    const tierObj = tiers.find(t => t.id === tierId);
    if (tierObj) deletedTierName = tierObj.name?.[currentLanguage] || '';
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

  // Đồng bộ selectedDayId với eventData.days mỗi khi days thay đổi
  useEffect(() => {
    if (eventData.days && eventData.days.length > 0) {
      const found = eventData.days.find(day => day.id === selectedDayId);
      if (!found) {
        setSelectedDayId(eventData.days[0].id);
      }
    } else {
      setSelectedDayId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData.days]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('organizer.createEventTitle')}</h1>
          <div className="flex gap-2">
            {showFillTestData && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEventData(randomEventTestData());
                  setSelectedLanguages(['en', 'vi']);
                  setCurrentLanguage('en');
                }}
              >
                Fill Test Data
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/organizer/dashboard')}>
              {t('organizer.cancel')}
            </Button>
          </div>
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
          <Tabs defaultValue="settings" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabNavigation
              tabConfigItems={tabConfigItems}
              tabSettings={tabSettings}
              t={t}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

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
              <EventBasicInfoForm
                eventData={eventData}
                currentLanguage={currentLanguage}
                selectedLanguages={selectedLanguages}
                onLanguageChange={handleLanguageChange}
                onCurrentLanguageChange={setCurrentLanguage}
                handleBasicInfoChange={handleBasicInfoChange}
                handleMultilingualInputChange={handleMultilingualInputChange}
                handleCoverImageChange={handleCoverImageChange}
                coverImage={coverImage}
                categoryLoading={categoryLoading}
                categories={categories}
                handleDateChange={handleDateChange}
                handleToggleFreeEvent={handleToggleFreeEvent}
              />
            </TabsContent>

            {/* New Tickets Tab */}
            <TabsContent value="tickets">
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
                handleFreeEventToggle={handleToggleFreeEvent}
                handleAddTicketType={handleAddTicketType}
                handleRemoveTicketType={handleRemoveTicketType}
                currentLanguage={currentLanguage}
                t={t}
                formatCurrency={formatCurrency}
                getTicketCategoryColor={getTicketCategoryColor}
                navigateToTab={navigateToTab}
              />
            </TabsContent>

            {/* Speakers Tab */}
            <TabsContent value="speakers">
              <EventSpeakersTab
                eventData={eventData}
                newSpeaker={newSpeaker}
                setNewSpeaker={setNewSpeaker}
                handleRemoveSpeaker={handleRemoveSpeaker}
                handleImageUpload={handleImageUpload}
                handleAddSpeaker={handleAddSpeaker}
                currentLanguage={currentLanguage}
                t={t}
                navigateToTab={navigateToTab}
              />
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <EventScheduleTab
                eventData={eventData}
                currentLanguage={currentLanguage}
                newActivity={newActivity}
                setNewActivity={setNewActivity}
                selectedDayId={selectedDayId}
                setSelectedDayId={setSelectedDayId}
                handleActivityChange={handleActivityChange}
                handleAddActivity={handleAddActivity}
                handleRemoveActivity={handleRemoveActivity}
                handleActivitySpeakerChange={handleActivitySpeakerChange}
                sortActivitiesByTime={sortActivitiesByTime}
                formatTime={formatTime}
                t={t}
                navigateToTab={navigateToTab}
              />
            </TabsContent>

            <TabsContent value="sponsors">
              <EventSponsorsTab
                eventData={eventData}
                tiers={tiers}
                setTiers={setTiers}
                newTier={newTier}
                setNewTier={setNewTier}
                handleAddTier={handleAddTier}
                handleDeleteTier={handleDeleteTier}
                newSponsor={newSponsor}
                setNewSponsor={setNewSponsor}
                handleAddSponsor={handleAddSponsor}
                handleRemoveSponsor={handleRemoveSponsor}
                handleImageUpload={handleImageUpload}
                currentLanguage={currentLanguage}
                t={t}
                navigateToTab={navigateToTab}
              />
            </TabsContent>

            <TabsContent value="booths">
              <EventBoothsTab
                eventData={eventData}
                newBooth={newBooth}
                setNewBooth={setNewBooth}
                handleAddBooth={handleAddBooth}
                handleRemoveBooth={handleRemoveBooth}
                handleImageUpload={handleImageUpload}
                currentLanguage={currentLanguage}
                t={t}
              />
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <EventMediaTab
                eventData={eventData}
                handleMediaFilesChange={handleMediaFilesChange}
                t={t}
              />
            </TabsContent>

          </Tabs>
          <CardFooter className="border-t p-6 flex justify-between">
            <Button variant="outline" onClick={() => navigate('/organizer/dashboard')}>
              {t('organizer.cancel')}
            </Button>
            <Button onClick={handleSubmit}>
              {t('organizer.createEvent.createEvent')}
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

export default CreateEvent;
