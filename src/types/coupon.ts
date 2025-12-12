export interface Coupon {
  id?: string;
  code: string;
  discount_percentage: number;
  min_purchase?: number | null;
  max_uses?: number | null;
  current_uses?: number;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active: boolean;
}
