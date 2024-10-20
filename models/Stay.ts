export interface RoomImage {
  caption: string;
  size_sm: string;
}

export interface BedGroup {
  id: string;
  description: string;
  configuration: {
    type: string;
    size: string;
    quantity: number;
  }[];
}

export interface CancelPenalty {
  start: string;
  end: string;
  percent: string;
  currency: string;
}

export interface PricingDetail {
  type: string;
  value: string;
  currency: string;
}

export interface TotalPrice {
  value: string;
  currency: string;
}

export interface OccupancyPricing {
  nightly: PricingDetail[][];
  totals: {
    property_inclusive: {
      request_currency: TotalPrice;
      billable_currency: TotalPrice;
    };
    marketing_fee: {
      request_currency: TotalPrice;
      billable_currency: TotalPrice;
    };
    gross_profit: {
      request_currency: TotalPrice;
      billable_currency: TotalPrice;
    };
    inclusive: {
      request_currency: TotalPrice;
      billable_currency: TotalPrice;
    };
    exclusive: {
      request_currency: TotalPrice;
      billable_currency: TotalPrice;
    };
  };
}

export interface XcodeLog {
  id: string;
  status: string;
  available_rooms: number;
  refundable: boolean;
  member_deal_available: boolean;
  sale_scenario: {
    package: boolean;
    member: boolean;
    corporate: boolean;
    distribution: boolean;
  };
  merchant_of_record: string;
  amenities: {
    [key: string]: {
      id: string;
      name: string;
    };
  };
  links: {
    payment_options: {
      method: string;
      href: string;
    };
  };
  bed_groups: {
    [key: string]: BedGroup;
  };
  cancel_penalties: CancelPenalty[];
  occupancy_pricing: {
    [key: string]: OccupancyPricing;
  };
}

export interface RoomData {
  is_mapped: boolean;
  is_decoded: boolean;
  id: string;
}

export interface PricingData {
  strikethrough_rate_nightly: number;
  strikethrough_price_total: number;
  rate_nightly: number;
  price_total: number;
  cashback_rate: number;
  cashback_pct: number;
  net_rate_nightly: number;
  net_price_total: number;
  bonus_cashback_rate: number;
  bonus_cashback_pct: number;
  net_rate_nightly_with_bonus: number;
  net_price_total_with_bonus: number;
  wisata_point: number;
  saving_pct: number;
}

export interface OfferItem {
  offer_id: string;
  price_total: number;
  rate_nightly: number;
  room_name: string;
  room_available: string;
  room_bed_groups: string;
  room_size_sqm: number;
  room_views: string;
  room_images: RoomImage[];
  meal_plan_code: string;
  meal_plan_description: string;
  cancel_policy_code: string;
  cancel_policy_deadline: string;
  cancel_policy_description: string;
  price_check_href: string;
  tax: number;
  tax_rate: number;
  xcode_log: XcodeLog;
  room_data: RoomData;
  pricing_data: PricingData;
}

export interface Stay {
  property_id: string;
  offer_summary_data: Record<string, unknown>;
  offer_list: OfferItem[];
}
