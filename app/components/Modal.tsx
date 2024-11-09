import React, { useEffect, useState } from "react";
import ReactPortal from "./ReactPortal";
import SmallConfirmationModal from "./SmallEnsuringModal";

interface ConfirmationModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}

const ConfirmationModal = ({
  children,
  isOpen,
  handleClose,
}: ConfirmationModalProps) => {
    const [ensuringModal, setEnsuringModal] = useState(false);

    const closeEnsuringModal = () => {
        setEnsuringModal(false);
    }
    const openEnsuringModal = () => {
        setEnsuringModal(true);
    }


  // Close modal on escape key press
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else {
        return null;
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
        <div className="fixed rounded flex flex-col box-border min-w-fit p-5 bg-zinc-800 inset-y-32 inset-x-1/4 pointer-events-auto z-50 max-h-[80vh]">
          <button
            onClick={openEnsuringModal}
            className="py-2 px-8 self-end font-bold hover:bg-violet-600 border rounded text-white"
          >
            Close
          </button>
          {ensuringModal && <SmallConfirmationModal isOpen={ensuringModal} handleClose={closeEnsuringModal} goToHome={handleClose}/>}
          <div className="box-border overflow-y-auto max-h-[70vh]">
            {children}
          </div>
        </div>
      </>
    </ReactPortal>
  );
};

export default React.memo(ConfirmationModal);
