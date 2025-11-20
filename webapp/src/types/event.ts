export interface Event {
  id: string;
  title: string;
  description?: string | null;
  eventDateTime: string;
  venueName: string;
  venueAddress: string;
  capacity: number;
  ageRestriction: string;
  ownerId?: string;
  ownerName?: string | null;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  eventDateTime: string;
  venueName: string;
  venueAddress: string;
  capacity: number;
  ageRestriction: string;
}
