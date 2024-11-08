"use client";
import Card from "./Card";
import { Plus, X } from "lucide-react";
// import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ConfirmationModal from "./Modal";
// import SharePage from "./FormContent";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, Tschema } from "@/lib/models";
import { useFormState } from "react-dom";
import { onSubmitAction } from "@/lib/actions";
import db from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Card {
  name: string;
  email: string;
  products: string;
  // createdDate?: string;
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
        products: (docData.products || "").split("|"), // Ensure splitting a string, even if empty
      });
    });

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
}


// function delay ( ms: number ) { return new Promise ( resolve => setTimeout ( resolve , ms ) ) ; }

export default function HomePage() {
  const [ConfirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);

  const [added, setAdded] = useState(false);

  const [cards, setCards] = useState<Card[]>([{
    name: "card-1",
    // createdDate: "15/10/2024",
    products: "product-1",
    email: "test@example.com",
  },
  {
    name: "card-2",
    // createdDate: "15/10/2024",
    products: "product-2",
    email: "test2@example.com",
  },
  {
    name: "card-3",
    // createdDate: "15/10/2024",
    products: "product-3",
    email: "test3@example.com",
  },
  {
    name: "card-4",
    // createdDate: "15/10/2024",
    products: "product-4",
    email: "test4@example.com",
  },])

  // const cards: Card[] = [
  //   {
  //     name: "card-1",
  //     // createdDate: "15/10/2024",
  //     products: "product-1",
  //     email: "test@example.com",
  //   },
  //   {
  //     name: "card-2",
  //     // createdDate: "15/10/2024",
  //     products: "product-2",
  //     email: "test2@example.com",
  //   },
  //   {
  //     name: "card-3",
  //     // createdDate: "15/10/2024",
  //     products: "product-3",
  //     email: "test3@example.com",
  //   },
  //   {
  //     name: "card-4",
  //     // createdDate: "15/10/2024",
  //     products: "product-4",
  //     email: "test4@example.com",
  //   },
  // ];

  const handleClick = () => {
    setConfirmationModalOpen(true);
    setAdded(false);
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
  console.log("render the form");

  // const [cardContent, setCardContent] = useState<Card[]>([]);

  // const [fetched, setFetched] = useState(true);
  // const [helper, setHelper] = useState(true);
  // const [added, setAdded] = useState(state.ifSuccessfullyAdded);
  // const [helper, setHelper] = useState(false);
  // const [helperr, sethelperr] = useState(true);

  // const toggleHelper = () => setHelper((prevState) => !prevState);

  // const [i, setI] = useState(0);

  useEffect(() => {
    // new Promise(resolve => 5000)
    // delay(3000);
    if (state.ifSuccessfullyAdded && added) {
      // cards.push([]);
      console.log("if successfully added is:", state.ifSuccessfullyAdded);
      const fetchData = async () => {
        const data = await fetchDataAndRenderCards();
        setCards((prevCards) => [...prevCards, data[0]]);
        // cards.push(data[data.length - 1]);
        // setCards((prev) => [...prev, data[0]]);
        console.log("the name is: ", data[0].name);
        // data.pop();
        // console.log("the i is:", i);
        // setI(i+1);
        // setCardContent(data);
        // setAdded(false);
        // setAdded(false)
        
        console.log("data fetched is: ", data);
        // console.log("card content is:",cardContent)
      };

      fetchData();
      // setAdded(false);
      // setHelper(true);
    }
  }, [state.ifSuccessfullyAdded, added]);

  // useEffect(() => {
  //   setI(i+1);
  // }, [state.ifSuccessfullyAdded, i])

  // useEffect(() => {
  //   sethelperr(false);
  // }, [helper])

  // const addCardToList = (): void => {
  //   cardContent.forEach((content) => {
  //     // Check if the card already exists in the cards array by comparing the properties
  //     const isDuplicate = cards.some(
  //       (card) =>
  //         card.name === content.name &&
  //         card.email === content.email &&
  //         card.products === content.products
  //     );

  //     if (!isDuplicate) {
  //       setCards((prev) => [...prev, content]);
  //     }
  //   });
  // };

  // addCardToList();

  // const fetchDataAndRenderCards = () => {
  //   if (state.ifSuccessfullyAdded) {

  //   }

  // }

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-24">
      <div className="flex flex-col items-center justify-center w-[300px] h-[150px] bg-twitter-blue rounded-lg border-[0.7px] border-[#eee] p-4 shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)]">
        <Button onClick={handleClick}>
          <Plus className="w-24 h-24" />
        </Button>
        {ConfirmationModalOpen && (
          <ConfirmationModal
            isOpen={ConfirmationModalOpen}
            handleClose={handleCloseModal}
          >
            <Form {...form}>
              {/* {state?.message !== "" && !state.issues && (
          <div className="text-red-500 flex justify-center items-center">
            {state.message}
          </div>
        )} */}
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
                  form.handleSubmit(() => {
                    formAction(new FormData(formRef.current!));
                    setAdded(true);
                    setConfirmationModalOpen(false);
                    form.reset();
                  })(evt);
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
                  // onClick={() => setAdded(true)}
                >
                  Add Card
                </Button>
                {/* {state.ifSuccessfullyAdded && handleCloseModal} */}
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
