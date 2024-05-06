export interface RequestAttendees {
  date: string;
  dateId: number;
  eventId: number;
  userId: number;
}

export interface ResponseAttendees {
  id: number;
  date: string;
  dateId: number;
  eventId: number;
  userId: number;
}