export interface IReview {
  id?: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface IStudio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  images?: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  rating: number;
  reviews?: IReview[];
  createdAt?: string | Date;
}
