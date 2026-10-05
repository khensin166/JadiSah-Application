import { 
  WeddingSummary, 
  RSVPStats, 
  BudgetStats, 
  GuestItem, 
  WeddingEventItem, 
  ChecklistTask,
  UserSession 
} from '@/types/dashboard';

export const mockUser: UserSession = {
  id: 'usr-101',
  fullName: 'Sarah & Dimas',
  email: 'sarah.dimas@jadisah.id',
  role: 'owner',
};

export const mockWedding: WeddingSummary = {
  id: 'wed-001',
  title: 'The Wedding of Sarah & Dimas',
  groomName: 'Dimas Prasetyo',
  brideName: 'Sarah Amanda',
  weddingDate: '2026-12-12',
  venueName: 'The Dharmawangsa Hotel, Jakarta Selatan',
  slug: 'sarah-dimas',
};

export const mockRSVP: RSVPStats = {
  totalInvited: 350,
  attending: 245,
  declined: 35,
  pending: 70,
};

export const mockBudget: BudgetStats = {
  totalBudget: 175000000,
  totalSpent: 112500000,
  categories: [
    { id: 'cat-1', name: 'Venue & Gedung', allocatedAmount: 70000000, spentAmount: 50000000 },
    { id: 'cat-2', name: 'Catering (Buffet & Stalls)', allocatedAmount: 55000000, spentAmount: 35000000 },
    { id: 'cat-3', name: 'Dekorasi & Pelaminan', allocatedAmount: 25000000, spentAmount: 15000000 },
    { id: 'cat-4', name: 'Dokumentasi (Foto & Video)', allocatedAmount: 15000000, spentAmount: 8500000 },
    { id: 'cat-5', name: 'Busana, MUA & Henna', allocatedAmount: 10000000, spentAmount: 4000000 },
  ],
};

export const mockGuests: GuestItem[] = [
  {
    id: 'gst-1',
    name: 'Bpk. Hendra Gunawan & Istri',
    groupName: 'Keluarga Pengantin Pria',
    email: 'hendra.gunawan@gmail.com',
    phone: '081298765432',
    status: 'attending',
    pax: 2,
    updatedAt: '2026-10-02 14:30',
  },
  {
    id: 'gst-2',
    name: 'Dr. Anita Rahayu, Sp.A',
    groupName: 'Keluarga Pengantin Wanita',
    email: 'anita.rahayu@hospital.id',
    phone: '081377889900',
    status: 'attending',
    pax: 2,
    updatedAt: '2026-10-02 11:15',
  },
  {
    id: 'gst-3',
    name: 'Reza Pratama',
    groupName: 'Sahabat Kuliah',
    email: 'reza.pratama@tech.co',
    phone: '085611223344',
    status: 'invited',
    pax: 1,
    updatedAt: '2026-10-01 09:00',
  },
  {
    id: 'gst-4',
    name: 'Maya Indah & Partner',
    groupName: 'Rekan Kerja Kantor',
    email: 'maya.indah@agency.com',
    phone: '081744556677',
    status: 'declined',
    pax: 1,
    updatedAt: '2026-09-30 18:20',
  },
  {
    id: 'gst-5',
    name: 'Ir. Budi Santoso',
    groupName: 'Keluarga Besar',
    email: 'budi.santoso@gmail.com',
    phone: '081822334455',
    status: 'attending',
    pax: 3,
    updatedAt: '2026-09-29 16:45',
  },
  {
    id: 'gst-6',
    name: 'Nadia Salsabila',
    groupName: 'Sahabat SMA',
    email: 'nadia.salsa@outlook.com',
    phone: '081233445566',
    status: 'invited',
    pax: 1,
    updatedAt: '2026-09-28 10:10',
  },
];

export const mockEvents: WeddingEventItem[] = [
  {
    id: 'evt-1',
    title: 'Akad Nikah & Sungkeman',
    startTime: '08:00 WIB',
    endTime: '10:30 WIB',
    location: 'Masjid Agung Al-Azhar, Kebayoran Baru',
    status: 'upcoming',
  },
  {
    id: 'evt-2',
    title: 'Resepsi Sesi 1 (Keluarga & Relasi)',
    startTime: '11:30 WIB',
    endTime: '14:00 WIB',
    location: 'Grand Ballroom The Dharmawangsa, Jakarta',
    status: 'upcoming',
  },
  {
    id: 'evt-3',
    title: 'Resepsi Sesi 2 (Teman & Rekan Muda)',
    startTime: '18:30 WIB',
    endTime: '21:30 WIB',
    location: 'Grand Ballroom The Dharmawangsa, Jakarta',
    status: 'upcoming',
  },
];

export const mockChecklist: ChecklistTask[] = [
  {
    id: 'chk-1',
    title: 'Finalisasi daftar 350 undangan & nomor WhatsApp',
    category: 'Tamu',
    dueDate: '5 Okt 2026',
    isCompleted: true,
  },
  {
    id: 'chk-2',
    title: 'Pembayaran DP 50% Gedung & Ballroom',
    category: 'Anggaran',
    dueDate: '10 Okt 2026',
    isCompleted: true,
  },
  {
    id: 'chk-3',
    title: 'Food tasting menu buffet & gubukan catering',
    category: 'Catering',
    dueDate: '15 Okt 2026',
    isCompleted: false,
  },
  {
    id: 'chk-4',
    title: 'Fitting baju akad pengantin dan seragam keluarga',
    category: 'Busana',
    dueDate: '20 Okt 2026',
    isCompleted: false,
  },
  {
    id: 'chk-5',
    title: 'Distribusi e-invitation via WhatsApp & email',
    category: 'Undangan',
    dueDate: '1 Nov 2026',
    isCompleted: false,
  },
];
