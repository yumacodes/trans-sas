export const COMPANY = {
  name: 'Trans-Sas',
  legalName: 'Trans-Sas Trading & Manufacturing Co. Ltd.',
  founded: 1981,
  email: 'sales@trans-sas.com',
  phones: ['+233 302 663 350', '+233 244 690 001', '+233 244 320 404'],
  address: 'Abossey Okai-Mpamprom, near Obetsebi-Lamptey Circle, Accra',
  gps: 'GA-216-7292',
  maps: 'https://www.google.com/maps/place/Trans-Sas+Trading+%26+Manufacturing+Co.Ltd./@5.5613832,-0.2308528,19z',
  whatsapp: 'https://wa.me/message/KLZ2F2A2ANKDE1',
  social: {
    instagram: 'https://instagram.com/transasco',
    x: 'https://twitter.com/sas_mfg',
    youtube: 'https://youtu.be/u2kqtOzAB48'
  }
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
