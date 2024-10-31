"use client";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { schema, Tschema } from "@/lib/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { onSubmitAction } from "@/lib/actions";
import { useRef } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SharePage() {
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

  return (
    <>
      <Form {...form}>
        {state?.message !== "" && !state.issues && (
          <div className="text-red-500 flex justify-center items-center">{state.message}</div>
        )}
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
          onSubmit={form.handleSubmit(() => formRef.current?.submit())}
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
                  <FormDescription className="text-white">Your Name</FormDescription>
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
                  <FormDescription className="text-white">Your Email</FormDescription>
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
                      <FormLabel className="text-white">{`product-${index + 1}`}</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />
                <Button onClick={() => handleRemove(index)} className="ml-2" type="button">
                  <X />
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
          <Button type="submit" className="mt-3 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</Button>
        </form>
      </Form>
    </>
  );
}
