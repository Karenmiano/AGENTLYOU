import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

import { useOutsideClick } from "../hooks/useOutsideClick";

import type { Dispatch, SetStateAction, PropsWithChildren } from "react";

interface ModalContextType {
  openName: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
}

interface OpenProps {
  opens: string;
  children: React.ReactElement<{ onClick: () => void }>;
}

interface WindowProps {
  name: string;
  children: React.ReactElement<{ closeModal: () => void }>;
}

const ModalContext = createContext<ModalContextType | null>(null);

function useModal() {
  const context = useContext(ModalContext);

  if (context === null) {
    throw new Error("useModal has to be used within <ModalContext.Provider>");
  }

  return context;
}

function Modal({ children }: PropsWithChildren) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ opens: opensWindowName, children }: OpenProps) {
  const { open } = useModal();

  return cloneElement(children, {
    onClick: () => open(opensWindowName),
  });
}

function Overlay({ children }: PropsWithChildren) {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-1000">{children}</div>
  );
}

function Window({ name, children }: WindowProps) {
  const { openName, close } = useModal();

  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <div
        ref={ref}
        className="fixed top-24 left-5 right-5 rounded-lg bg-white p-4 border border-gray-300 shadow-strong"
      >
        <div>{cloneElement(children, { closeModal: close })} </div>
      </div>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
