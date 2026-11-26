/** A product from the old trans-sas.com range. Used only when the site runs without the management system. */
export type CatalogEntry = {
  slug: string
  name: string
  categories: string[]
  summary: string
  description: string
  features: string[]
  image: string | null
}

// Photos live in public/products/, named after the product (copied from the management
// system's Stock Items, which holds the originals).

/**
 * The bundled catalogue, taken from the old trans-sas.com product range. It is only the
 * offline fallback: with VITE_API_URL set, products come live from the management system's
 * Stock Items, where these same products were imported (item code = slug in capitals).
 */
export const CATALOG: CatalogEntry[] = [
  {
    slug: 'mobile-medical-couch',
    name: 'Mobile Medical Couch',
    categories: ['Medical'],
    summary: 'Examination couch with a backrest that locks in eight positions.',
    description:
      'A sturdy mobile examination couch for consulting rooms and wards. The backrest adjusts and locks in eight positions, and the frame is built for years of daily use.',
    features: ['Backrest lockable in 8 positions', 'Mobile frame for easy repositioning', 'Built for heavy daily use'],
    image: '/products/mobile-medical-couch.png'
  },
  {
    slug: 'self-propelled-wheelchair',
    name: 'Self Propelled Wheelchair',
    categories: ['Medical'],
    summary: 'Folding aluminium wheelchair with flip-up arms and swing-away footrests.',
    description:
      'A lightweight folding aluminium wheelchair in metallic burgundy. Flip-up desk-length arms let the user get close to tables, and the footrests swing away and lift off for transfers.',
    features: ['Folding aluminium frame', 'Flip-up, under-desk arms', 'Swing-away removable footrests'],
    image: '/products/self-propelled-wheelchair.png'
  },
  {
    slug: 'transit-wheelchair',
    name: 'Transit Wheelchair',
    categories: ['Medical'],
    summary: 'Attendant-pushed folding wheelchair with removable arms.',
    description:
      'A folding transit chair for moving patients around a facility or between appointments. Removable armrests and swing-away footrests make transfers easier, and the inner liners are heavy duty.',
    features: ['Full or desk arms, removable', 'Swing-away footrests', 'Heavy-duty inner liners', 'Folds for transport'],
    image: '/products/transit-wheelchair.png'
  },
  {
    slug: 'lightweight-safety-walker',
    name: 'Lightweight Safety Walker',
    categories: ['Medical'],
    summary: 'Folding walker with a padded seat, backrest and storage bag.',
    description:
      'A folding safety walker that gives support on the move and a place to rest. Handles adjust in height, and it folds flat for storage or the car boot.',
    features: ['Folds flat', 'Height-adjustable handles', 'Padded seat and backrest', 'Storage bag included'],
    image: '/products/lightweight-safety-walker.png'
  },
  {
    slug: 'minor-surgery-couch',
    name: 'Minor Surgery Couch',
    categories: ['Surgical', 'Medical'],
    summary: 'Manually adjustable couch with head-down tilt for minor procedures.',
    description:
      'A couch for minor surgical procedures. The backrest and foot section adjust manually and lock themselves in place, and the couch tilts head-down when needed.',
    features: ['Self-locking backrest and foot section', 'Head-down tilt', 'Manual adjustment, no power needed'],
    image: '/products/minor-surgery-couch.png'
  },
  {
    slug: 'mobile-commode-chair',
    name: 'Mobile Commode Chair',
    categories: ['Medical'],
    summary: 'Wheeled commode and shower chair for safe patient transfer.',
    description:
      'A mobile commode chair that doubles as a shower chair, for moving patients safely to and from the bathroom.',
    features: ['Castors for safe transfer', 'Suitable for shower use'],
    image: '/products/mobile-commode-chair.png'
  },
  {
    slug: 'coolview-c35-examination-light',
    name: 'Coolview C35 Examination Light',
    categories: ['Medical', 'Surgical'],
    summary: 'Examination light with a 20,000 lux spot and a 5,000 lux flood.',
    description:
      'An examination light with two modes: an intense 20,000 lux spot for detailed work and a gentle 5,000 lux flood for general examination, from a 35 W source.',
    features: ['20,000 lux spot', '5,000 lux floodlight', '35 W light source'],
    image: '/products/coolview-c35-examination-light.png'
  },
  {
    slug: 'zenith-ultra-500la-microscope',
    name: 'Zenith ULTRA-500LA Binocular Microscope',
    categories: ['Scientific', 'Laboratory'],
    summary: 'Laboratory microscope, ×40 to ×1000 (×1600 with optional eyepieces).',
    description:
      'A binocular laboratory microscope with paired ×10 DIN widefield eyepieces and parfocal DIN-standard objectives. Magnification runs from ×40 to ×1000, or ×1600 with optional ×16 flatfield eyepieces.',
    features: ['×40 – ×1000 magnification', '×10 DIN widefield eyepieces, 18 mm field', 'DIN-standard parfocal objectives', 'Optional ×16 eyepieces for ×1600'],
    image: '/products/zenith-ultra-500la-microscope.png'
  },
  {
    slug: 'autoclaves-decontamination',
    name: 'Autoclaves & Decontamination',
    categories: ['Medical'],
    summary: 'Sterilisation and decontamination supplies for clinical settings.',
    description:
      'Sterilisation and decontamination supplies, including antimicrobial hospital concentrate for general antiseptic use. Ask our team for the full range.',
    features: ['Hospital-grade antiseptic concentrate', 'Range available on request'],
    image: '/products/autoclaves-decontamination.png'
  },
  {
    slug: '3m-littmann-electronic-stethoscope',
    name: '3M Littmann Electronic Stethoscope',
    categories: ['Medical'],
    summary: 'Amplifies body sounds up to 18 times.',
    description:
      'An electronic stethoscope that amplifies sound up to 18 times, made for heart and body sounds that are hard to hear with an acoustic chest piece.',
    features: ['Up to 18× amplification', 'For difficult-to-hear heart and body sounds'],
    image: '/products/3m-littmann-electronic-stethoscope.png'
  },
  {
    slug: 'accoson-freestyle-sphygmomanometer',
    name: 'Accoson Freestyle Sphygmomanometer',
    categories: ['Medical'],
    summary: 'Manometer with mercury isolation valve and latex-free bulb.',
    description:
      'A blood pressure monitor with a plastic manometer tube and a mercury isolation valve, supplied with an adult velcro cuff, a latex-free bulb and coiled tubing.',
    features: ['Mercury isolation valve', 'Adult velcro cuff', 'Latex-free bulb', 'Coiled tubing'],
    image: '/products/accoson-freestyle-sphygmomanometer.png'
  },
  {
    slug: 'microlab-mk6-spirometer',
    name: 'Microlab MK6 Spirometer',
    categories: ['Medical', 'Scientific'],
    summary: 'Portable spirometer with rechargeable batteries.',
    description:
      'A portable, lightweight spirometer in a high-impact ABS body, powered by rechargeable internal batteries for use away from the desk.',
    features: ['Portable and lightweight', 'Rechargeable internal batteries', 'High-impact ABS body'],
    image: '/products/microlab-mk6-spirometer.png'
  },
  {
    slug: 'elemental-mains-cautery-unit',
    name: 'Elemental Mains Cautery Unit',
    categories: ['Medical', 'Scientific'],
    summary: 'Mains cautery with variable output up to 20 A.',
    description:
      'A mains-powered cautery unit with variable output up to 20 amperes, robust cables and handles, and non-slip feet.',
    features: ['Variable output up to 20 A', 'Robust cables and handles', 'Non-slip feet'],
    image: '/products/elemental-mains-cautery-unit.png'
  },
  {
    slug: 'accu-chek-advantage-meter',
    name: 'Accu-Chek Advantage Meter',
    categories: ['Medical'],
    summary: 'Blood glucose kit with finger pricker, strips and lancets.',
    description:
      'A complete blood glucose kit: the Accu-Chek Advantage meter with a Softclix finger pricker, 10 test strips, 10 lancets, and high and low control solutions.',
    features: ['Softclix finger pricker', '10 test strips, 10 lancets', 'High and low control solutions'],
    image: '/products/accu-chek-advantage-meter.png'
  },
  {
    slug: 'kamplex-kt20-impedance-audiometer',
    name: 'Kamplex KT 20 Impedance Audiometer',
    categories: ['Medical', 'Scientific'],
    summary: 'Hand-held tympanometer for middle-ear testing in children.',
    description: 'A hand-held tympanometer for testing middle-ear function, designed for use with young children.',
    features: ['Hand-held', 'Middle-ear testing', 'Suited to paediatric use'],
    image: '/products/kamplex-kt20-impedance-audiometer.png'
  },
  {
    slug: 'a-ub401-digital-wrist-monitor',
    name: 'A-UB401 Digital Wrist Monitor',
    categories: ['Medical'],
    summary: 'Compact wrist BP monitor showing systolic, diastolic and pulse at once.',
    description:
      'An ultra-compact wrist blood pressure monitor. Its three-line display shows systolic, diastolic and pulse readings together.',
    features: ['Ultra-compact and light', '3-line display', 'Systolic, diastolic and pulse together'],
    image: '/products/a-ub401-digital-wrist-monitor.png'
  },
  {
    slug: 'polaroid-healthcam-kit',
    name: 'Polaroid HealthCam Kit',
    categories: ['Medical', 'Scientific'],
    summary: 'Instant photographic records with a measuring grid overlay.',
    description:
      'Instant clinical photographs with a grid overlay for recording wounds and conditions. The kit includes the camera, twin-pack grid film, a shoulder bag, a light lock and a non-contact close-up lens.',
    features: ['Grid overlay on every print', 'Non-contact close-up lens', 'Shoulder bag and light lock included'],
    image: '/products/polaroid-healthcam-kit.png'
  },
  {
    slug: 'polaroid-macro-5-slr',
    name: 'Polaroid Macro 5 SLR',
    categories: ['Medical', 'Scientific'],
    summary: 'Instant close-up camera for clinical documentation.',
    description: 'An instant camera for close-up clinical documentation. Contact our team for the current specification.',
    features: ['Instant prints', 'Close-up clinical documentation'],
    image: null
  },
  {
    slug: 'universal-cervical-collar',
    name: 'Universal Cervical Collar',
    categories: ['Medical'],
    summary: 'Comfortable, easy-to-fit collar for a range of cervical injuries.',
    description: 'An economical cervical collar that is comfortable to wear and quick to apply, for a variety of cervical injuries.',
    features: ['Quick to apply', 'Comfortable fit', 'Economical'],
    image: '/products/universal-cervical-collar.png'
  },
  {
    slug: 'drive-heavy-duty-suction-machine',
    name: 'Drive Medical Heavy Duty Suction Machine',
    categories: ['Medical', 'Scientific'],
    summary: 'Oil-less suction unit built for continuous operation.',
    description:
      'A heavy-duty suction machine built for continuous use. It has an anti-bacterial filter, a vacuum regulator, an anti-vibration gauge, and a collection bottle with overflow protection.',
    features: ['Continuous operation', 'Oil-less pump', 'Anti-bacterial filter', 'Overflow-protected collection bottle'],
    image: '/products/drive-heavy-duty-suction-machine.png'
  },
  {
    slug: 'closed-infant-incubator',
    name: 'Closed Infant Incubator',
    categories: ['Medical', 'Scientific'],
    summary: 'Stationary incubator for standard and intermediate infant care.',
    description:
      'A stationary closed incubator for standard and intermediate infant care, with simple controls and easy access to the patient.',
    features: ['Standard and intermediate care', 'Simple operation', 'Easy patient access'],
    image: '/products/closed-infant-incubator.png'
  },
  {
    slug: 'microcomputer-anesthesia-machine',
    name: 'Microcomputer Anesthesia Machine',
    categories: ['Medical', 'Scientific'],
    summary: 'Anaesthesia delivery with integrated monitoring and records.',
    description:
      'An anaesthesia workstation that brings monitoring, anaesthesia delivery and care-process records into one system, with the option to connect to a hospital server.',
    features: ['Integrated monitoring', 'Care-process records', 'Server connectivity'],
    image: '/products/microcomputer-anesthesia-machine.png'
  },
  {
    slug: 'infrared-foot-massager',
    name: 'Infrared Circulation Foot Massager',
    categories: ['Medical'],
    summary: 'High-frequency foot massage with adjustable infrared heat.',
    description:
      'A therapeutic foot massager that combines high-frequency massage with adjustable infrared heat and eight natural magnets to support blood circulation.',
    features: ['High-frequency massage', 'Adjustable infrared heat', '8 natural magnets'],
    image: '/products/infrared-foot-massager.png'
  },
  {
    slug: 'massage-chair',
    name: 'Massage Chair',
    categories: ['Medical'],
    summary: '3D massage mechanism with air massage and heated heads.',
    description:
      'A full massage chair with a 3D mechanism, air massage, three massage and stretching techniques, and heated massage heads.',
    features: ['3D massage mechanism', 'Air massage', '3 massage and stretch techniques', 'Heated massage heads'],
    image: '/products/massage-chair.png'
  }
]


/** The products the hero stage cycles through: strong silhouettes that read at a glance. */
export const HERO_SLUGS = [
  'closed-infant-incubator',
  'self-propelled-wheelchair',
  'zenith-ultra-500la-microscope',
  'microcomputer-anesthesia-machine',
  'coolview-c35-examination-light',
  'drive-heavy-duty-suction-machine',
  'minor-surgery-couch',
  'accoson-freestyle-sphygmomanometer'
]
