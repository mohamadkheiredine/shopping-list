"use server";
import { FormState, schema } from "./models";
import db from "@/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

type dataProp = {
  name: string,
  email: string,
  products: string;
}

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

  // Filter out undefined products
  result.products = result.products.filter((product) => product);

  return result;
}

async function addDataToFireStore({ name, email, products }: dataProp): Promise<boolean> {
  const data = { name, email, products };

  try {
    await addDoc(collection(db, "shopping-list-Id"), data);
    console.log("document written with id")
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

// const db = getFirestore(app); // Initialize Firestore

export async function onSubmitAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const dataa = Object.fromEntries(formData) as InputType;
  const data = transformData(dataa);
  const parsed = schema.safeParse(data);


  // Validation checks
  if (!parsed.success) {
    const fields: Record<string, string> = {};

    for (const key of Object.keys(data)) {
      if (key !== "products") {
        fields[key] = data[key as keyof Omit<FormDataType, "products">];
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

  // const invalidProducts: Record<string, string> = {};
  // parsed.data.products.forEach((prod, index) => {
  //   if (prod.product.includes("|")) {
  //     invalidProducts[`products.${index}.product`] = "Product cannot contain '|' character";
  //   }
  // });

  // if (Object.keys(invalidProducts).length > 0) {
  //   return {
  //     message: "Invalid product",
  //     fields,
  //     issues: parsed.error.issues.push("Product cannot contain '|' character").map((issue) => issue.message)
  //   };
  // }

  const arrayOfProducts = data.products.map(prod => prod.product).join("|");
  const dataToDatabase = { name: data.name, email: data.email, products: arrayOfProducts };

  const success = await addDataToFireStore(dataToDatabase);
  // Perform Firestore document write if needed
  // await addDoc(collection(db, "shopping-list-Id"), data); // Uncomment to add data to Firestore

  // Optionally, revalidate or redirect as necessary
  // revalidatePath("/");
  // redirect("/");
  

  return { message: "Card added successfully.", ifSuccessfullyAdded: success };
}

