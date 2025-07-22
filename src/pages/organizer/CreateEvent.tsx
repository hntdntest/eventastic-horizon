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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// (Replaced by patched RichTextEditor below)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import * as LucideIcons from 'lucide-react';
import LanguageSelector from '@/components/organizer/LanguageSelector';

// Define types
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
title: MultilingualText;
description?: MultilingualText;
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
import { useRef } from 'react';


const CreateEvent: React.FC = () => {
  // ...existing code...






  // Ref for sponsor description editor
  const sponsorDescEditorRef = useRef<HTMLDivElement | null>(null);
  // ...existing code...

  // ...existing code...

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
  const [tiers, setTiers] = useState<{ id: string, name: string }[]>([]);
  const [newTier, setNewTier] = useState('');

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
    name: '',
    title: '',
    bio: '',
    avatarUrl: ''
  });

  // Initial state for newSponsor uses first tier if available
  const [newSponsor, setNewSponsor] = useState<Omit<Sponsor, 'id'>>({
    name: '',
    level: tiers[0]?.name || '',
    website: '',
    description: '',
    logoUrl: ''
  });

  // State for new booth form
  const [newBooth, setNewBooth] = useState<Omit<ExhibitionBooth, 'id'>>({
    name: '',
    company: '',
    description: '',
    location: '',
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
    location: '',
    speakerIds: [],
  });

  // State for new ticket type form
  const [newTicketType, setNewTicketType] = useState<Omit<TicketType, 'id'>>({
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
    if (!newSpeaker.name.trim() || !newSpeaker.title.trim()) {
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
      name: '',
      title: '',
      bio: '',
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
    if (!newBooth.name.trim() || !newBooth.company.trim()) {
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
      name: '',
      company: '',
      description: '',
      location: '',
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
      title: { en: '' },
      description: { en: '' },
      startTime: '09:00',
      endTime: '10:00',
      type: 'workshop',
      location: '',
      speakerIds: [],
    });
  };

  // Handler to add ticket type
  const handleAddTicketType = () => {
    // Log the ticket category value for debugging


    if (!newTicketType.name.trim()) {
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
      name: '',
      description: '',
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
        media: Array.isArray(data.media) ? data.media : [],
        days: Array.isArray(data.days) ? data.days : [],
        speakers: Array.isArray(data.speakers) ? data.speakers : [],
        sponsors: Array.isArray(data.sponsors) ? data.sponsors : [],
        booths: Array.isArray(data.booths) ? data.booths : [],
        ticketTypes: Array.isArray(data.ticketTypes) ? data.ticketTypes : [],
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
        const createdTiers: { id: string, name: string }[] = [];
        for (const tier of tiers) {
          // Only send tiers that are not already in backend (id starts with temp-)
          if (tier.id.startsWith('temp-')) {
            const res = await fetch(`${API_URL}/events/${createdEvent.id}/sponsorship-levels`, {
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
      setNewSponsor(prev => ({ ...prev, level: tiers[0].name }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiers]);

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
          <h1 className="text-2xl font-bold">{t('organizer.createEventTitle')}</h1>
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
          <Tabs defaultValue="settings" className="w-full" value={activeTab} onValueChange={setActiveTab}>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Event Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your event type and choose which tabs to display
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select onValueChange={handleEventTypeChange} value={eventType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(et => (
                          <SelectItem key={et.key} value={et.key}>{et.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Tab Configuration</h3>
                    {tabConfigLoading ? (
                      <div className="text-gray-500">Loading tabs...</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tabConfigItems.map((item) => {
                          // Lấy icon component từ LucideIcons object
                          const IconComponent = LucideIcons[item.icon] || LucideIcons.Settings;
                          const isEnabled = tabSettings[item.key];
                          return (
                            <div
                              key={item.key}
                              onClick={() => handleTabSettingChange(item.key, !isEnabled)}
                              className={`
                                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                ${isEnabled
                                  ? 'border-purple-500 bg-purple-50 shadow-sm'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                                }
                              `}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${item.color} ${isEnabled ? 'opacity-100' : 'opacity-50'}`}>
                                  {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-medium text-sm ${isEnabled ? 'text-purple-900' : 'text-gray-900'}`}>
                                    {t(item.title) || item.title}
                                  </h4>
                                  <p className={`text-xs mt-1 ${isEnabled ? 'text-purple-600' : 'text-gray-500'}`}>
                                    {t(item.description) || item.description}
                                  </p>
                                </div>
                              </div>

                              {/* Toggle indicator */}
                              <div className={`
                                absolute top-2 right-2 w-4 h-4 rounded-full border-2 transition-all duration-200
                                ${isEnabled
                                  ? 'bg-purple-500 border-purple-500'
                                  : 'bg-white border-gray-300'
                                }
                              `}>
                                {isEnabled && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Tip:</strong> Select your event type to automatically configure the most relevant tabs. You can still customize them manually by clicking on the tiles above.
                    </p>
                  </div>
                </CardContent>
              </Card>
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
                      {tiers.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800 text-sm text-center">
                          {t('organizer.sponsors.addTierFirst') || 'Please add a sponsorship level before adding sponsors.'}
                        </div>
                      ) : (
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
                                <Label htmlFor="sponsorName">{t('organizer.sponsors.name')} ({currentLanguage.toUpperCase()})</Label>
                                <Input
                                  id="sponsorName"
                                  value={newSponsor.name}
                                  onChange={e => setNewSponsor(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder={t('organizer.sponsors.name.placeholder')}
                                  disabled={tiers.length === 0}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="sponsorLevel">{t('organizer.sponsors.sponsorLevel') || 'Sponsorship Level'}</Label>
                                <select
                                  id="sponsorLevel"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <Label htmlFor="sponsorWebsite">{t('organizer.sponsors.website')}</Label>
                                <Input
                                  id="sponsorWebsite"
                                  value={newSponsor.website}
                                  onChange={e => setNewSponsor(prev => ({ ...prev, website: e.target.value }))}
                                  placeholder={t('organizer.sponsors.website.placeholder') || 'https://'}
                                  disabled={tiers.length === 0}
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <Label htmlFor="sponsorDescription">{t('organizer.sponsors.description')} ({currentLanguage.toUpperCase()})</Label>
                              <RichTextEditor
                                key={`sponsorDescription-${currentLanguage}`}
                                value={newSponsor.description}
                                onChange={val => setNewSponsor(prev => ({ ...prev, description: val }))}
                                placeholder={t('organizer.sponsors.description.placeholder')}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="outline" onClick={() => navigateToTab("tickets")}>
                        {t('organizer.cancel')}
                      </Button>
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
                                      <Badge variant="outline" className="text-xs">{sponsor.level}</Badge>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Event Media
                  </CardTitle>
                  <CardDescription>
                    Upload images, videos, documents, and presentations for your event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MediaUpload onFilesChange={handleMediaFilesChange} />
                </CardContent>
              </Card>
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
