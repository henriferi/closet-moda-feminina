
import { Coupon } from "@/types/coupon";
import { getAuthHeaders } from "./getAuthHeaders";

export const fetchValidCoupon = async (code: string): Promise<Coupon> => {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/coupons?code=eq.${code}&select=*`;
  const headers = await getAuthHeaders();

  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...headers,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Erro ao validar cupom");

  const data = await res.json();

  if (!data.length) throw new Error("Cupom não encontrado");

  const coupon = data[0];

  return {
    id: coupon.id,
    code: coupon.code,
    discount_percentage: coupon.discount_percentage,
    is_active: coupon.is_active,
  };
};
