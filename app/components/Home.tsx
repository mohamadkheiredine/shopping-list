"use client";
import Card from "./Card";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ConfirmationModal from "./Modal";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, Tschema } from "@/lib/models";
import { onSubmitAction } from "@/lib/actions";
import db from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useFormState } from "react-dom";

interface Card {
  name: string;
  email: string;
  products: string;
}

async function fetchDataAndRenderCards() {
  try {
    const querySnapshot = await getDocs(collection(db, "shopping-list-Id"));
    const data: Card[] = [];
    
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        name: docData.name,
        email: docData.email,
        products: (docData.products || "").split("|"),
      });
    });

    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
}

export default function HomePage() {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  
  const handleClick = () => {
    setConfirmationModalOpen(true);
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };

  const [state, formAction] = useFormState(onSubmitAction, {
    message: "",
  });

  const form = useForm<Tschema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      products: [{ product: "" }],
      ...(state?.fields ?? {}),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleAdd = () => {
    append({ product: "" });
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataAndRenderCards();
        setCards(data);
      } catch (error) {
        console.error("Error fetching data inside useEffect:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: Tschema) => {
    formAction(new FormData(formRef.current!));
    const newCard: Card = {
      name: data.name,
      email: data.email,
      products: data.products.map((item) => item.product).join(" "),
    };

    setCards((prevCards) => [...prevCards, newCard]);
    form.reset();
    setConfirmationModalOpen(false);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-24">
      <div className="flex flex-col items-center justify-center w-[300px] h-[150px] bg-twitter-blue rounded-lg border-[0.7px] border-[#eee] p-4 shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)]">
        <Button onClick={handleClick}>
          <Plus className="w-24 h-24" />
        </Button>
        {confirmationModalOpen && (
          <ConfirmationModal
            isOpen={confirmationModalOpen}
            handleClose={handleCloseModal}
          >
            <Form {...form}>
              {state?.issues && (
                <div className="text-red-500 flex justify-center items-center">
                  <ul>
                    {state.issues.map((issue) => (
                      <li key={issue} className="flex gap-1">
                        <X fill="red" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <form
                action={formAction}
                ref={formRef}
                className="space-y-8 flex justify-center items-center flex-col"
                onSubmit={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  form.handleSubmit(onSubmit)(evt);
                }}
              >
                <div className="flex gap-2">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription className="text-white">
                          Your Name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription className="text-white">
                          Your Email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-row items-center">
                      <FormField
                        name={`products.${index}.product`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel className="text-white">{`product-${
                              index + 1
                            }`}</FormLabel>
                            <FormControl>
                              <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => handleRemove(index)}
                        className="ml-2"
                        type="button"
                      >
                        <X className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={handleAdd}
                    className="mt-3 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    type="button"
                  >
                    Add Product
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="mt-3 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Card
                </Button>
              </form>
            </Form>
          </ConfirmationModal>
        )}
      </div>
      {cards.map((card, index) => (
        <Card
          key={index}
          name={card.name}
          product={card.products}
          sharedWithEmail={card.email}
        />
      ))}
    </div>
  );
}
