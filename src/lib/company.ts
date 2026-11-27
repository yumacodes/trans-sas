/**
 * Company facts used across the website. Fields marked "Fill in" are deliberately empty:
 * the site shows nothing for them until a real, confirmed value is entered here.
 */
export const COMPANY = {
  name: 'Trans-Sas',
  legalName: 'Trans-Sas Trading & Manufacturing Co. Ltd.',
  founded: 1981,
  email: 'sales@trans-sas.com',
  phones: ['+233 302 663 350', '+233 244 690 001', '+233 244 320 404'],
  address: 'Abossey Okai-Mpamprom, near Obetsebi-Lamptey Circle, Accra',
  locality: 'Accra',
  countryCode: 'GH',
  gps: 'GA-216-7292',
  maps: 'https://www.google.com/maps/place/Trans-Sas+Trading+%26+Manufacturing+Co.Ltd./@5.5613832,-0.2308528,19z',
  whatsapp: 'https://wa.me/message/KLZ2F2A2ANKDE1',
  social: {
    instagram: 'https://instagram.com/transasco',
    x: 'https://twitter.com/sas_mfg',
    youtube: 'https://youtu.be/u2kqtOzAB48'
  },

  /**
   * Public address of this website, no trailing slash. Used for canonical/Open Graph links and
   * JSON-LD; public/robots.txt and public/sitemap.xml repeat it. Confirm before launch.
   */
  siteUrl: 'https://www.trans-sas.com',

  /** Fill in: opening hours, e.g. [{ days: 'Monday to Friday', time: '8:00 to 17:00' }]. Empty hides them. */
  hours: [] as { days: string; time: string }[],

  /** Fill in: a Google Maps embed URL (Share → Embed a map → the iframe's src). Empty shows a link only. */
  mapEmbedUrl: '',

  /** Fill in: how quickly sales replies, e.g. 'within one working day'. Empty shows generic copy. */
  replyTime: '',

  /**
   * Delivery conditions, shown wherever "Free delivery" is claimed. Replace with the real
   * terms (areas covered, minimum order, lead time) once confirmed.
   */
  deliveryNote: 'Delivery terms are confirmed on your proforma.',

  /** Trust facts. Every entry starts empty; the trust band shows nothing for an empty entry. */
  trust: {
    /** Fill in: regulatory registrations, e.g. the FDA Ghana registration with its number. */
    registrations: [] as string[],
    /** Fill in: certifications held, e.g. a quality-management standard. */
    certifications: [] as string[],
    /** Fill in: brands Trans-Sas is an authorised distributor for. */
    authorisedBrands: [] as string[],
    /** Fill in: warranty terms, in one line. */
    warranty: '',
    /** Fill in: after-sales support, in one line. */
    afterSales: ''
  }
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/** A WhatsApp link with a prefilled message. */
export const whatsappHref = (text: string) => `${COMPANY.whatsapp}?text=${encodeURIComponent(text)}`
