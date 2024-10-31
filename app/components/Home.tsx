"use client";
import Card from "./Card";
import { Plus } from "lucide-react";
// import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import ConfirmationModal from "./Modal";
import SharePage from "./FormContent";

interface Card {
  name: string;
  createdDate: string;
  product: string;
  sharedWithEmail: string;
}

export default function HomePage() {
  const [ConfirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);

  const cards: Card[] = [
    {
      name: "card-1",
      createdDate: "15/10/2024",
      product: "product-1",
      sharedWithEmail: "test@example.com",
    },
    {
      name: "card-2",
      createdDate: "15/10/2024",
      product: "product-2",
      sharedWithEmail: "test2@example.com",
    },
    {
      name: "card-3",
      createdDate: "15/10/2024",
      product: "product-3",
      sharedWithEmail: "test3@example.com",
    },
    {
      name: "card-4",
      createdDate: "15/10/2024",
      product: "product-4",
      sharedWithEmail: "test4@example.com",
    },
  ];

  const handleClick = () => {
    setConfirmationModalOpen(true);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-24">
      <div className="flex flex-col items-center justify-center w-[300px] h-[150px] bg-twitter-blue rounded-lg border-[0.7px] border-[#eee] p-4 shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)]">
        {/* <Link href="/share">
            <Plus className="w-24 h-24"/>
        </Link> */}
        <Button onClick={handleClick}>
          <Plus className="w-24 h-24" />
        </Button>
        {ConfirmationModalOpen && (
          <ConfirmationModal
            isOpen={ConfirmationModalOpen}
            handleClose={() => setConfirmationModalOpen(!ConfirmationModalOpen)}
          >
            <SharePage />
          </ConfirmationModal>
        )}
      </div>
      {cards.map((card, index) => (
        <Card
          key={index}
          name={card.name}
          createdDate={card.createdDate}
          product={card.product}
          sharedWithEmail={card.sharedWithEmail}
        />
      ))}
    </div>
  );
}
