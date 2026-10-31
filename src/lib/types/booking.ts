export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface IBooking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage?: string;
  studioLocation?: string;
  hourlyRate: number;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt?: string | Date;
}
