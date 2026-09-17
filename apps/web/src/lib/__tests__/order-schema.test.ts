import { describe, it, expect } from "vitest";
import { orderSchema } from "../order-schema";

const validOrder = {
  items: [{ slug: "marklife-x4", qty: 1, unitPriceBani: 129900 }],
  customer: {
    name: "Ion Popescu",
    phone: "0712345678",
    email: "ion@exemplu.ro",
    judet: "București",
    localitate: "București",
    adresa: "Str. Exemplu nr. 1",
    codPostal: "123456",
  },
};

describe("orderSchema", () => {
  it("accepts a valid order", () => {
    const result = orderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("accepts optional notes", () => {
    const result = orderSchema.safeParse({ ...validOrder, customer: { ...validOrder.customer, notes: "Etaj 3" } });
    expect(result.success).toBe(true);
  });

  it("rejects empty items array", () => {
    const result = orderSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  it("rejects qty < 1", () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      items: [{ slug: "marklife-x4", qty: 0, unitPriceBani: 129900 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid Romanian phone", () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, phone: "123456789" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts +40 prefixed phone", () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, phone: "+40712345678" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects postal code with letters", () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, codPostal: "12345A" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects 5-digit postal code", () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, codPostal: "12345" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = orderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, email: "not-an-email" },
    });
    expect(result.success).toBe(false);
  });
});
