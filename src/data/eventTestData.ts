// Duplicate types from CreateEvent.tsx for type safety
export interface MultilingualText {
  [languageCode: string]: string;
}
export interface Speaker {
  id: string;
  name: MultilingualText;
  title: MultilingualText;
  bio?: MultilingualText;
  avatarUrl?: string;
}
export interface Sponsor {
  id: string;
  name: MultilingualText;
  level: string;
  website?: string;
  description?: MultilingualText;
  logoUrl?: string;
}
export interface ExhibitionBooth {
  id: string;
  name: MultilingualText;
  company: MultilingualText;
  description?: MultilingualText;
  location?: MultilingualText;
  coverImageUrl?: string;
}
export interface Activity {
  id: string;
  title: MultilingualText;
  description?: MultilingualText;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'workshop' | 'exhibit' | 'networking' | 'other';
  location?: MultilingualText;
  speakerIds?: string[];
}
export interface EventDay {
  id: string;
  date: string;
  activities: Activity[];
}
export interface TicketType {
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
  category?: string;
}
export interface EventData {
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
  ticketDescriptions?: MultilingualText;
  speakerBios?: MultilingualText;
  scheduleNotes?: MultilingualText;
  sponsorInfo?: MultilingualText;
  exhibitionInfo?: MultilingualText;
}


const eventTestDataList: EventData[] = [
  {
    title: { en: 'Test Event EN', vi: 'Sự kiện thử nghiệm VI' },
    description: { en: 'A test event in English', vi: 'Sự kiện thử nghiệm bằng tiếng Việt' },
    category: 'Technology',
    location: { en: 'Hanoi', vi: 'Hà Nội' },
    startDate: '2025-08-01',
    endDate: '2025-08-03',
    days: [
      {
        id: 'day-0',
        date: '2025-08-01',
        activities: [
          {
            id: 'activity-1',
            title: { en: 'Opening Ceremony', vi: 'Khai mạc' },
            description: { en: 'Welcome to the event', vi: 'Chào mừng đến với sự kiện' },
            startTime: '09:00',
            endTime: '10:00',
            type: 'meeting',
            location: { en: 'Main Hall', vi: 'Hội trường chính' },
            speakerIds: ['speaker-1']
          }
        ]
      }
    ],
    speakers: [
      {
        id: 'speaker-1',
        name: { en: 'John Doe', vi: 'Nguyễn Văn A' },
        title: { en: 'CEO', vi: 'Giám đốc' },
        bio: { en: 'Expert in tech', vi: 'Chuyên gia công nghệ' },
        avatarUrl: '/placeholder.svg'
      }
    ],
    sponsors: [
      {
        id: 'sponsor-1',
        name: { en: 'Tech Corp', vi: 'Công ty Công nghệ' },
        level: 'gold',
        website: 'https://techcorp.com',
        description: { en: 'Leading tech sponsor', vi: 'Nhà tài trợ công nghệ hàng đầu' },
        logoUrl: '/placeholder.svg'
      }
    ],
    booths: [
      {
        id: 'booth-1',
        name: { en: 'Startup Booth', vi: 'Gian hàng Khởi nghiệp' },
        company: { en: 'Startup Inc', vi: 'Công ty Khởi nghiệp' },
        description: { en: 'Showcasing startups', vi: 'Trưng bày các startup' },
        location: { en: 'Zone A', vi: 'Khu A' },
        coverImageUrl: '/placeholder.svg'
      }
    ],
    isFreeEvent: false,
    ticketTypes: [
      {
        id: 'ticket-1',
        name: { en: 'Standard', vi: 'Vé thường' },
        description: { en: 'Standard ticket', vi: 'Vé phổ thông' },
        price: 100,
        quantity: 200,
        saleStartDate: '2025-07-01',
        saleEndDate: '2025-08-01',
        isEarlyBird: true,
        earlyBirdDiscount: 20,
        isVIP: false,
        category: 'General'
      }
    ],
    media: ['/placeholder.svg'],
    tabConfig: {
      showDetails: true,
      showMedia: true,
      showTickets: true,
      showSpeakers: true,
      showSchedule: true,
      showSponsors: true
    },
    ticketDescriptions: { en: 'All ticket info', vi: 'Thông tin vé' },
    speakerBios: { en: 'All speakers', vi: 'Tất cả diễn giả' },
    scheduleNotes: { en: 'Schedule notes', vi: 'Ghi chú lịch trình' },
    sponsorInfo: { en: 'Sponsor info', vi: 'Thông tin nhà tài trợ' },
    exhibitionInfo: { en: 'Exhibition info', vi: 'Thông tin triển lãm' }
  },
  // Event 2
  {
    title: { en: 'Workshop 2025', vi: 'Hội thảo 2025' },
    description: { en: 'A hands-on workshop', vi: 'Hội thảo thực hành' },
    category: 'Workshop',
    location: { en: 'Da Nang', vi: 'Đà Nẵng' },
    startDate: '2025-09-10',
    endDate: '2025-09-12',
    days: [
      {
        id: 'day-0',
        date: '2025-09-10',
        activities: [
          {
            id: 'activity-1',
            title: { en: 'Keynote', vi: 'Bài phát biểu chính' },
            description: { en: 'Opening keynote', vi: 'Phát biểu khai mạc' },
            startTime: '08:00',
            endTime: '09:00',
            type: 'workshop',
            location: { en: 'Room 1', vi: 'Phòng 1' },
            speakerIds: ['speaker-2']
          }
        ]
      }
    ],
    speakers: [
      {
        id: 'speaker-2',
        name: { en: 'Jane Smith', vi: 'Trần Thị B' },
        title: { en: 'Trainer', vi: 'Giảng viên' },
        bio: { en: 'Workshop expert', vi: 'Chuyên gia hội thảo' },
        avatarUrl: '/placeholder.svg'
      }
    ],
    sponsors: [
      {
        id: 'sponsor-2',
        name: { en: 'Edu Sponsor', vi: 'Nhà tài trợ Giáo dục' },
        level: 'silver',
        website: 'https://edusponsor.com',
        description: { en: 'Education sponsor', vi: 'Nhà tài trợ giáo dục' },
        logoUrl: '/placeholder.svg'
      }
    ],
    booths: [
      {
        id: 'booth-2',
        name: { en: 'Education Booth', vi: 'Gian hàng Giáo dục' },
        company: { en: 'Edu Inc', vi: 'Công ty Giáo dục' },
        description: { en: 'Education products', vi: 'Sản phẩm giáo dục' },
        location: { en: 'Zone B', vi: 'Khu B' },
        coverImageUrl: '/placeholder.svg'
      }
    ],
    isFreeEvent: true,
    ticketTypes: [
      {
        id: 'ticket-2',
        name: { en: 'Free Pass', vi: 'Vé miễn phí' },
        description: { en: 'Free entry', vi: 'Vào cửa miễn phí' },
        price: 0,
        quantity: 100,
        saleStartDate: '2025-08-01',
        saleEndDate: '2025-09-10',
        isEarlyBird: false,
        earlyBirdDiscount: 0,
        isVIP: false,
        category: 'Student'
      }
    ],
    media: ['/placeholder.svg'],
    tabConfig: {
      showDetails: true,
      showMedia: true,
      showTickets: true,
      showSpeakers: true,
      showSchedule: true,
      showSponsors: true
    },
    ticketDescriptions: { en: 'Free for all', vi: 'Miễn phí cho mọi người' },
    speakerBios: { en: 'Workshop speakers', vi: 'Diễn giả hội thảo' },
    scheduleNotes: { en: 'Workshop schedule', vi: 'Lịch trình hội thảo' },
    sponsorInfo: { en: 'Education sponsor', vi: 'Nhà tài trợ giáo dục' },
    exhibitionInfo: { en: 'Education exhibition', vi: 'Triển lãm giáo dục' }
  }
];




function getTimestampSuffix() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const min = pad(now.getMinutes());
  const sec = pad(now.getSeconds());
  return `${year}${month}${day}:${hour}${min}${sec}`;
}


export function randomEventTestData(): EventData {
  const base = eventTestDataList[Math.floor(Math.random() * eventTestDataList.length)];
  const uniq = getTimestampSuffix();
  // Deep clone and mutate unique fields
  const clone = JSON.parse(JSON.stringify(base));

  // Helper to add unique suffix
  const addSuffix = (obj: Record<string, string>, suffix: string) => {
    const res: Record<string, string> = {};
    for (const k in obj) {
      res[k] = obj[k] + ' #' + suffix;
    }
    return res;
  };

  clone.title = addSuffix(clone.title, uniq);
  clone.description = addSuffix(clone.description, uniq);
  clone.location = addSuffix(clone.location, uniq);
  clone.days = clone.days.map((day: EventDay, i: number) => {
    const dayId = `day-${i}-${uniq}`;
    return {
      ...day,
      id: dayId,
      activities: day.activities.map((act: Activity, j: number) => ({
        ...act,
        id: `activity-${i}-${j}-${uniq}`,
        title: addSuffix(act.title, uniq),
        description: addSuffix(act.description, uniq),
        location: addSuffix(act.location, uniq),
        speakerIds: act.speakerIds?.map((_, idx) => `speaker-${i}-${j}-${idx}-${uniq}`) || []
      }))
    };
  });
  clone.speakers = clone.speakers.map((sp: Speaker, i: number) => ({
    ...sp,
    id: `speaker-${i}-${uniq}`,
    name: addSuffix(sp.name, uniq),
    title: addSuffix(sp.title, uniq),
    bio: addSuffix(sp.bio, uniq)
  }));
  clone.sponsors = clone.sponsors.map((sp: Sponsor, i: number) => ({
    ...sp,
    id: `sponsor-${i}-${uniq}`,
    name: addSuffix(sp.name, uniq),
    description: addSuffix(sp.description, uniq)
  }));
  clone.booths = clone.booths.map((b: ExhibitionBooth, i: number) => ({
    ...b,
    id: `booth-${i}-${uniq}`,
    name: addSuffix(b.name, uniq),
    company: addSuffix(b.company, uniq),
    description: addSuffix(b.description, uniq),
    location: addSuffix(b.location, uniq)
  }));
  clone.ticketTypes = clone.ticketTypes.map((t: TicketType, i: number) => ({
    ...t,
    id: `ticket-${i}-${uniq}`,
    name: addSuffix(t.name, uniq),
    description: addSuffix(t.description, uniq)
  }));
  // Các trường info khác
  if (clone.ticketDescriptions) clone.ticketDescriptions = addSuffix(clone.ticketDescriptions, uniq);
  if (clone.speakerBios) clone.speakerBios = addSuffix(clone.speakerBios, uniq);
  if (clone.scheduleNotes) clone.scheduleNotes = addSuffix(clone.scheduleNotes, uniq);
  if (clone.sponsorInfo) clone.sponsorInfo = addSuffix(clone.sponsorInfo, uniq);
  if (clone.exhibitionInfo) clone.exhibitionInfo = addSuffix(clone.exhibitionInfo, uniq);

  return clone;
}
