import { z } from "zod";

/** Romanian mobile/landline — 07xx xxx xxx or 02x/03x xxx xxx formats */
const roPhone = z
  .string()
  .regex(
    /^(\+40|0040|0)(7\d{8}|[23]\d{7,8})$/,
    "Număr de telefon invalid (format românesc)",
  );

/** Romanian postal code — exactly 6 digits */
const roPostalCode = z
  .string()
  .regex(/^\d{6}$/, "Codul poștal trebuie să conțină exact 6 cifre");

export const cartItemSchema = z.object({
  slug: z.string().min(1),
  qty: z.number().int().min(1).max(999),
  unitPriceBani: z.number().int().min(0),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const orderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Coșul nu poate fi gol"),
  customer: z.object({
    name: z.string().min(2, "Numele trebuie să conțină cel puțin 2 caractere"),
    phone: roPhone,
    email: z.string().email("Adresă de email invalidă"),
    judet: z.string().min(2, "Selectați județul"),
    localitate: z.string().min(2, "Introduceți localitatea"),
    adresa: z.string().min(5, "Introduceți adresa completă"),
    codPostal: roPostalCode,
    notes: z.string().max(500).optional(),
  }),
});

export type OrderInput = z.infer<typeof orderSchema>;
