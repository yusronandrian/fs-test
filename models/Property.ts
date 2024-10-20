export interface HeroImageUrl {
    lg: string;
    md: string;
    sm: string;
    th: string;
    ori: string;
  }
  
  export interface Catalog {
    fax: string;
    city: string;
    brand: string;
    chain: string;
    phone: string;
    category: string;
    postal_code: string;
    star_rating: number;
    review_count: number;
    review_rating: number;
    hero_image_url: HeroImageUrl;
  }
  
  export interface Area {
    square_feet: number;
    square_meters: number;
  }
  
  export interface ImageLink {
    href: string;
    method: string;
  }
  
  export interface RoomImage {
    links: {
      "70px": ImageLink;
      "200px": ImageLink;
      "350px": ImageLink;
      "1000px": ImageLink;
    };
    caption: string;
    category: number;
    hero_image: boolean;
  }
  
  export interface BedConfiguration {
    size: string;
    type: string;
    quantity: number;
  }
  
  export interface BedGroup {
    id: string;
    description: string;
    configuration: BedConfiguration[];
  }
  
  export interface Amenity {
    id: string;
    name: string;
    categories?: string[];
    value?: string;
  }
  
  export interface Occupancy {
    max_allowed: {
      total: number;
      adults: number;
      children: number;
    };
    age_categories: {
      [key: string]: {
        name: string;
        minimum_age: number;
      };
    };
  }
  
  export interface Room {
    id: string;
    area: Area;
    name: string;
    images: RoomImage[];
    amenities: { [key: string]: Amenity };
    occupancy: Occupancy;
    bed_groups: { [key: string]: BedGroup };
    descriptions: {
      overview: string;
    };
  }
  
  export interface Property {
    id: string;
    slug: string;
    type: string;
    name: string;
    name_suffix: string;
    country_code: string;
    address_line: string;
    latitude: number;
    longitude: number;
    catalog: Catalog;
    image: any | null;
    room: { [key: string]: Room };
  }
  
  export interface PropertyResponse {
    [key: string]: Property;
  }
  