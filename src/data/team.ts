/**
 * The team page's people. EVERY ENTRY BELOW IS A TEMPLATE: replace the name, role, bio,
 * email and phone with the real details, and set `photo` once the picture is in
 * public/team/ (see public/team/README.txt). Remove entries you don't need; the page
 * adapts to any number of people and to any departments you use.
 *
 * Leave `email` or `phone` as null to hide it; the modal then offers the main sales line.
 */

export type TeamMember = {
  id: string
  name: string
  role: string
  department: Department
  /** Path under public/, e.g. '/team/ama-mensah.jpg'. null shows the person's initials. */
  photo: string | null
  /** One line shown on the card when it is hovered. */
  summary: string
  /** Shown in full in the modal. Separate paragraphs with a blank line. */
  bio: string
  /** Short labels shown in the modal, e.g. areas of expertise. */
  focus: string[]
  email: string | null
  phone: string | null
  /** Year they joined, shown as "With Trans-Sas since …". */
  since: number | null
}

export const DEPARTMENTS = ['Leadership', 'Sales', 'Technical', 'Finance', 'Operations'] as const
export type Department = (typeof DEPARTMENTS)[number]

export const TEAM: TeamMember[] = [
  {
    id: 'managing-director',
    name: 'Full Name',
    role: 'Managing Director',
    department: 'Leadership',
    photo: null,
    summary: 'Leads the company and its relationships with hospitals and government partners.',
    bio: 'Write two or three sentences about this person: their background, what they are responsible for at Trans-Sas, and what customers can come to them for.\n\nA second paragraph can cover experience, qualifications or a personal note.',
    focus: ['Strategy', 'Government projects', 'Partnerships'],
    email: 'name@trans-sas.com',
    phone: '+233 00 000 0000',
    since: 1981
  },
  {
    id: 'operations-director',
    name: 'Full Name',
    role: 'Operations Director',
    department: 'Leadership',
    photo: null,
    summary: 'Keeps supply, stock and delivery running across every order.',
    bio: 'Write two or three sentences about this person: their background, what they are responsible for at Trans-Sas, and what customers can come to them for.',
    focus: ['Supply chain', 'Branches', 'Quality'],
    email: 'name@trans-sas.com',
    phone: '+233 00 000 0000',
    since: null
  },
  {
    id: 'sales-manager',
    name: 'Full Name',
    role: 'Sales Manager',
    department: 'Sales',
    photo: null,
    summary: 'Your first contact for quotations, proformas and tenders.',
    bio: 'Write two or three sentences about this person: their background, what they are responsible for at Trans-Sas, and what customers can come to them for.',
    focus: ['Proformas', 'Tenders', 'Hospital accounts'],
    email: 'name@trans-sas.com',
    phone: '+233 00 000 0000',
    since: null
  },
  {
    id: 'sales-executive',
    name: 'Full Name',
    role: 'Sales Executive',
    department: 'Sales',
    photo: null,
    summary: 'Helps clinics and families choose the right equipment.',
    bio: 'Write two or three sentences about this person: their background, what they are responsible for at Trans-Sas, and what customers can come to them for.',
    focus: ['Clinics', 'Home care', 'Product advice'],
    email: 'name@trans-sas.com',
    phone: '+233 00 000 0000',
    since: null
  },
  {
    id: 'biomedical-engineer',
    name: 'Full Name',
    role: 'Biomedical Engineer',
    department: 'Technical',
    photo: null,
    summary: 'Installs, services and repairs equipment on site.',
    bio: 'Write two or three sentences about this person: their background, what they are responsible for at Trans-Sas, and what customers can come to them for.',
    focus: ['Installation', 'Repairs', 'Maintenance'],
    email: 'name@trans-sas.com',
    phone: '+233 00 000 0000',
    since: null
  },
  {
    id: 'technician',
    name: 'Full Name',
    role: 'Equipment Technician',
    department: 'Technical',
    photo: null,
    summary: 'Tests every item before it leaves for delivery.',
    bio: 'Write two or three sentences about this person: their background, what they are responsible for at Trans-Sas, and what customers can come to them for.',
    focus: ['Testing', 'Calibration', 'Training users'],
    email: null,
    phone: '+233 00 000 0000',
    since: null
  },
  {
    id: 'accountant',
    name: 'Full Name',
    role: 'Accountant',
    department: 'Finance',
    photo: null,
    summary: 'Handles invoices, payments and statements for customers.',
    bio: 'Write two or three sentences about this person: their background, what they are responsible for at Trans-Sas, and what customers can come to them for.',
    focus: ['Invoices', 'Payments', 'Statements'],
    email: 'name@trans-sas.com',
    phone: '+233 00 000 0000',
    since: null
  },
  {
    id: 'logistics-coordinator',
    name: 'Full Name',
    role: 'Logistics Coordinator',
    department: 'Operations',
    photo: null,
    summary: 'Schedules deliveries and keeps you updated until they arrive.',
    bio: 'Write two or three sentences about this person: their background, what they are responsible for at Trans-Sas, and what customers can come to them for.',
    focus: ['Delivery', 'Waybills', 'Pickup'],
    email: 'name@trans-sas.com',
    phone: '+233 00 000 0000',
    since: null
  }
]

/** "Ama Mensah" → "AM". */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join('')

/** An entry still holding template text ("Full Name", "+233 00 000 0000", "name@…"). */
const isPlaceholder = (m: TeamMember) =>
  /^full name$/i.test(m.name.trim()) || /\b00 000 0000\b/.test(m.phone ?? '') || /^name@/i.test(m.email ?? '')

/**
 * The people actually shown. While every entry is a template the Team page and every link
 * to it stay hidden (the /team route redirects to About).
 */
export const PUBLISHED_TEAM = TEAM.filter(m => !isPlaceholder(m))

export const hasTeam = PUBLISHED_TEAM.length > 0
