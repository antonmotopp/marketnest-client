export interface IRating {
  id: number;
  reviewer_id: number;
  reviewed_user_id: number;
  advertisement_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface IRatingCreate {
  reviewed_user_id: number;
  advertisement_id: number;
  rating: number;
  comment: string;
}
