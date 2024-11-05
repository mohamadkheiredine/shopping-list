"use server";
import { FormState, schema } from "./models";
// import { redirect } from "next/dist/server/api-utils";
// import { revalidatePath } from "next/cache";

type Product = {
  product: string;
};

type FormDataType = {
  name: string;
  email: string;
  products: Product[];
};

type InputType = {
  [key: string]: string;
};

function transformData(input: InputType): FormDataType {
  const result: FormDataType = {
    name: input.name,
    email: input.email,
    products: [],
  };

  for (const key in input) {
    if (key.startsWith("products.")) {
      const index = Number(key.split(".")[1]);
      const product: Product = {
        product: input[key],
      };

      result.products[index] = product;
    }
  }

  result.products = result.products.filter((product) => product);

  return result;
}

export async function onSubmitAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const dataa = Object.fromEntries(formData) as InputType;

  const data = transformData(dataa);

  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const fields: Record<string, string> = {};

    for (const key of Object.keys(data)) {
      if (key !== "products") {
        fields[key] = data[
          key as keyof Omit<FormDataType, "products">
        ] as string;
      } else {
        data.products.forEach((product, index) => {
          fields[`products.${index}.product`] = product.product;
        });
      }
    }

    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
  // revalidatePath("/");
  // redirect("/");

  return { message: "User registered" };
}
