export interface Performer {
  id?: string;
  performerName: string;
  genre1?: string | null;
  genre2?: string | null;
  performerLink?: string | null;
}

export interface PerformerInput {
  performerName: string;
  genre1?: string;
  genre2?: string;
  performerLink?: string;
}

export interface Event {
  id: string;
  flyerUrl: string;
  eventDate: string;
  startTime: string;
  eventLengthHours: number;
  endTime?: string | null;
  eventDateTime: string;        // ⬅️ FALTABA
  isLive: boolean;
  about: string;
  title: string;
  venueName: string;
  venueAddress: string;
  venueZipCode: string;
  venueState: string;
  venueCountry: string;
  capacity: number;
  ageRestriction?: string;
  allAges: boolean;
  alcohol: boolean;
  genres?: string[] | null;
  performers: Performer[];
  ownerId?: string | null;      // ⬅️ FALTABA
  ownerName?: string | null;    // ⬅️ FALTABA
}

export interface CreateEventInput {
  flyerUrl: string;
  eventDate: string;
  startTime: string;
  eventLengthHours: number;
  endTime?: string | null;
  isLive: boolean;
  about: string;
  title: string;
  venueName: string;
  venueAddress: string;
  venueZipCode: string;
  venueState: string;
  venueCountry: string;
  capacity: number;
  allAges: boolean;
  alcohol: boolean;
  performers: PerformerInput[];
  genres?: string[];
}
