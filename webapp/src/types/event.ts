export type EventStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "LIVE";

export interface Performer {
  id?: string;
  performerName: string;
  genre1?: string | null;
  genre2?: string | null;
  genre3?: string | null;
  performerLink?: string | null;
}

export interface PerformerInput {
  performerName: string;
  genre1?: string;
  genre2?: string;
  genre3?: string;
  performerLink?: string;
}

export interface Event {
  id: string;
  flyerUrl: string;
  eventDate: string;
  startTime: string;
  eventLengthHours: number;
  endTime?: string | null;
  eventDateTime: string;
  isLive: boolean;
  status?: EventStatus;
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
  ownerId?: string | null;
  ownerName?: string | null;
}

export interface CreateEventInput {
  flyerUrl: string;
  eventDate: string;
  startTime: string;
  eventLengthHours: number;
  endTime?: string | null;
  isLive: boolean;
  status?: EventStatus;
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
