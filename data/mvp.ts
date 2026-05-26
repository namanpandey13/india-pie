export type EventCategory = 'coffee' | 'culture' | 'founders' | 'sports' | 'music';

export type Attendee = {
  id: string;
  name: string;
  role: string;
  signal: string;
  status: 'confirmed' | 'maybe' | 'host-approved';
  initials: string;
  color: string;
};

export type Organizer = {
  id: string;
  name: string;
  title: string;
  bio: string;
  rating: string;
  repeatRate: string;
  links: string[];
  initials: string;
  color: string;
};

export type Event = {
  id: string;
  title: string;
  locality: string;
  venue: string;
  dateLabel: string;
  timeLabel: string;
  priceLabel: string;
  category: EventCategory;
  image: string;
  posterText: string;
  organizer: Organizer;
  attendees: Attendee[];
  capacity: number;
  tags: string[];
  vibe: string;
  about: string;
  trustSignals: string[];
  prompts: string[];
  confidenceScore: number;
  friendContext: string;
};

export const city = 'Delhi NCR';

export const tags = ['all', 'free', 'today', 'curated', 'creator-led', 'friends going'];

export const events: Event[] = [
  {
    id: 'hk-boardgames',
    title: 'Board Game Baithak',
    locality: 'Hauz Khas',
    venue: 'Third Wave Coffee, HKV',
    dateLabel: 'Tonight',
    timeLabel: '7:30 PM',
    priceLabel: 'Free',
    category: 'coffee',
    image:
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80',
    posterText: 'BOARD GAME BAITHAK',
    organizer: {
      id: 'tara',
      name: 'Tara Singh',
      title: 'Games curator',
      bio: 'Hosts small-table game nights for people who want structure before small talk. Former DU debating society lead, now building a Delhi board game circuit.',
      rating: '4.9',
      repeatRate: '72%',
      links: ['Instagram verified', 'LinkedIn linked'],
      initials: 'TS',
      color: '#BFF36B',
    },
    attendees: [
      {
        id: 'riya',
        name: 'Riya Malhotra',
        role: 'Product designer',
        signal: '2 mutuals, also into Catan',
        status: 'confirmed',
        initials: 'RM',
        color: '#F77258',
      },
      {
        id: 'arjun',
        name: 'Arjun Bedi',
        role: 'Founder',
        signal: 'Attended 3 plans',
        status: 'confirmed',
        initials: 'AB',
        color: '#8FA7FF',
      },
      {
        id: 'isha',
        name: 'Isha Sood',
        role: 'Journalist',
        signal: 'Host-approved',
        status: 'host-approved',
        initials: 'IS',
        color: '#F6C85F',
      },
      {
        id: 'kabir',
        name: 'Kabir Sethi',
        role: 'Consultant',
        signal: 'Friend of Naman',
        status: 'maybe',
        initials: 'KS',
        color: '#AF7BFF',
      },
    ],
    capacity: 18,
    tags: ['free', 'today', 'curated'],
    vibe: 'Easy structure, no awkward cold open.',
    about:
      'A low-pressure game night for people who want to meet new people without standing around wondering what to say. Tables rotate every 35 minutes.',
    trustSignals: [
      'Host confirmed venue today',
      '12/18 attendees confirmed',
      'Women-friendly table balance',
      'No WhatsApp group migration',
    ],
    prompts: [
      'Which game makes you weirdly competitive?',
      'Are you coming solo or with a friend?',
      'What kind of Delhi plan should exist more often?',
    ],
    confidenceScore: 92,
    friendContext: 'Riya and Arjun are friends-of-friends',
  },
  {
    id: 'lodhi-photo-walk',
    title: 'Lodhi Film Photo Walk',
    locality: 'Lodhi Colony',
    venue: 'Meet outside Lodhi Art District',
    dateLabel: 'Sat',
    timeLabel: '8:00 AM',
    priceLabel: 'Rs 299',
    category: 'culture',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    posterText: 'FILM WALK',
    organizer: {
      id: 'zoya',
      name: 'Zoya Khan',
      title: 'Street photographer',
      bio: 'Runs analog photo walks and creator mixers around Delhi. Known for small groups and clear route planning.',
      rating: '4.8',
      repeatRate: '64%',
      links: ['Instagram verified', 'Portfolio linked'],
      initials: 'ZK',
      color: '#71E4FF',
    },
    attendees: [
      {
        id: 'neil',
        name: 'Neil Kapoor',
        role: 'Brand strategist',
        signal: 'Bringing a point-and-shoot',
        status: 'confirmed',
        initials: 'NK',
        color: '#BFF36B',
      },
      {
        id: 'mehak',
        name: 'Mehak Jain',
        role: 'Architecture student',
        signal: '3 shared interests',
        status: 'confirmed',
        initials: 'MJ',
        color: '#F77258',
      },
      {
        id: 'advait',
        name: 'Advait Rao',
        role: 'Creator',
        signal: 'Host-approved',
        status: 'host-approved',
        initials: 'AR',
        color: '#8FA7FF',
      },
    ],
    capacity: 14,
    tags: ['curated', 'creator-led'],
    vibe: 'Creative, early, intimate, route-led.',
    about:
      'A slow morning walk through murals and quiet lanes. Bring any camera or just your phone. The host pairs solo attendees into tiny shooting prompts.',
    trustSignals: [
      'Route shared before event',
      'Host check-in required',
      'Small group cap',
      'Post-walk cafe plan included',
    ],
    prompts: [
      'What do you usually photograph?',
      'Film, phone, or mirrorless?',
      'Coffee after the walk?',
    ],
    confidenceScore: 86,
    friendContext: 'Mehak is connected through 3 design people',
  },
  {
    id: 'gurgaon-founders-dinner',
    title: 'Gurgaon Builders Dinner',
    locality: 'Cyber Hub',
    venue: 'Sly Granny, Cyber Hub',
    dateLabel: 'Thu',
    timeLabel: '8:15 PM',
    priceLabel: 'Rs 799',
    category: 'founders',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    posterText: 'BUILDERS DINNER',
    organizer: {
      id: 'dev',
      name: 'Dev Arora',
      title: 'Community operator',
      bio: 'Curates founder dinners for operators, indie hackers, and early-stage people. Guest list is reviewed for fit before confirmation.',
      rating: '4.7',
      repeatRate: '58%',
      links: ['LinkedIn linked', 'Past host reviews visible'],
      initials: 'DA',
      color: '#F6C85F',
    },
    attendees: [
      {
        id: 'naina',
        name: 'Naina Oberoi',
        role: 'AI founder',
        signal: 'Confirmed',
        status: 'confirmed',
        initials: 'NO',
        color: '#AF7BFF',
      },
      {
        id: 'samar',
        name: 'Samar Virk',
        role: 'VC analyst',
        signal: '2 mutuals',
        status: 'confirmed',
        initials: 'SV',
        color: '#71E4FF',
      },
      {
        id: 'tanya',
        name: 'Tanya Bhasin',
        role: 'Growth lead',
        signal: 'Host-approved',
        status: 'host-approved',
        initials: 'TB',
        color: '#F77258',
      },
    ],
    capacity: 12,
    tags: ['curated', 'creator-led'],
    vibe: 'Curated dinner, not a pitch night.',
    about:
      'A 12-person dinner for people actively building, buying, or selling software in India. Everyone gets a 45-second intro and a warm ask.',
    trustSignals: [
      'Guest list reviewed',
      'Host arrival guaranteed',
      'Attendance deposit enabled',
      'Restaurant table confirmed',
    ],
    prompts: [
      'What are you building?',
      'What kind of intro would help this month?',
      'Are you hiring, fundraising, or selling?',
    ],
    confidenceScore: 89,
    friendContext: 'Samar and Tanya share LinkedIn context',
  },
];

export const chats = [
  {
    id: 'chat-boardgames',
    eventId: 'hk-boardgames',
    title: 'Board Game Baithak pre-chat',
    members: ['Tara', 'Riya', 'Arjun', 'Isha', 'Kabir', 'You'],
    unread: 3,
    lastMessage: 'Tara: I will split tables by game comfort. Solo folks, you are covered.',
    prompt: 'Which game should we start with?',
  },
  {
    id: 'chat-photo',
    eventId: 'lodhi-photo-walk',
    title: 'Lodhi photo walk',
    members: ['Zoya', 'Neil', 'Mehak', 'You'],
    unread: 0,
    lastMessage: 'Zoya shared the route and cafe stop.',
    prompt: 'Share one photo style you like.',
  },
];

export const loginProfile = {
  name: 'Naman Pandey',
  phone: '+91 98765 43210',
  city,
  instagram: '@naman.jpg',
  linkedin: 'linkedin.com/in/namanpandey',
  intent: 'Meet ambitious people offline without WhatsApp chaos',
};
