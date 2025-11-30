// src/types/landing.ts
export interface SearchField {
    id: string | number;
    icon?: string;
    label: string;
    type?: string;
    placeholder?: string;
  }
  
  export interface HeroButton {
    label?: string;
    icon?: string;
    action?: string; // url or route
  }
  
  export interface HeroSectionData {
    logo?: string;
    heading?: string;
    description?: string;
    searchFields?: SearchField[];
    button?: HeroButton;
  }
  
  export interface AboutSectionData {
    // add real fields as needed
    title?: string;
    content?: string;
  }
  
  export interface Offer {
    isActive: boolean;
    oldPrice?: number;
    newPrice?: number;
    badge?: string;
    expiresAt?: string | Date;
  }
  
  export interface FlightOffer {
    _id: string;
    price?: number;
    origin?: { city?: string; country?: string };
    destination?: { city?: string; country?: string };
    image?: string;
    description?: string;
    rating?: number;
    offer?: Offer;
    // add other fields you need
  }
  
  export interface LandingData {
    heroSection?: HeroSectionData;
    aboutSection?: AboutSectionData;
    videoSection?: any;
    topDestinations?: any[];
    specialOffers?: any[];
    tourPackages?: any[];
    filters?: any[];
  }
  