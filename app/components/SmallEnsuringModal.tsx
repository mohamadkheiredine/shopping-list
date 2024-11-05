'use client'
import React, { useEffect } from "react";
import ReactPortal from "./ReactPortal";
// import { useRouter } from "next/navigation";

interface ConfirmationModalProps {
  isOpen: boolean;
  handleClose: () => void;
  goToHome: () => void;
}

const SmallConfirmationModal = ({
  isOpen,
  handleClose,
  goToHome,
}: ConfirmationModalProps) => {
  // const router = useRouter();

  // const goToHomePage = () => {
  //   router.push('/'); // Navigates to the home page
  // };

  // Close modal on escape key press
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  // Disable scroll on modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return (): void => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <>
      <div className="fixed top-0 left-0 w-screen h-screen z-40 bg-neutral-800 opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="rounded flex flex-col items-center box-border w-1/2 max-w-md p-5 bg-gray-100 max-h-[15vh]">
            <p className="text-black text-center">Are you sure that you want to close this form?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button 
                className="py-2 px-8 font-bold border rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                onClick={handleClose}
              >
                No
              </button>
              <button 
                className="py-2 px-8 font-bold border rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                onClick={goToHome}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </>
    </ReactPortal>
  );
};

export default React.memo(SmallConfirmationModal);
