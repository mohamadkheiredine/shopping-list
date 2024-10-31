import { z } from "zod"

export type FormValues = {
  name: string,
  email: string,
  products: {
    product: string
  }[]
}

export const productsSchema = z.object({
  product: z.string().trim().min(1, {
    message: "Product is required"
  }),
})

export const schema = z.object({
  name: z.string().trim().min(1, {
    message: "the name is required"
  }),
  email: z.string().trim().email({
    message: "Invalid email address"
  }),
  products: z.array(productsSchema)
})

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export type Tschema = z.infer<typeof schema>