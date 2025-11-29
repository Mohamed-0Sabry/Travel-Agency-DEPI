import React, { useEffect, useRef, useState } from "react";

type Size = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  id?: string;
  title?: React.ReactNode;
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  size?: Size;
  centered?: boolean;
  scrollable?: boolean;
  className?: string;
  closeButton?: boolean;
  animationDuration?: number; // ms
}

const sizeClass = (size?: Size) => {
  switch (size) {
    case "sm":
      return "modal-sm";
    case "lg":
      return "modal-lg";
    case "xl":
      return "modal-xl";
    default:
      return "";
  }
};

export const Modal: React.FC<ModalProps> = ({
  id,
  title,
  show,
  onClose,
  children,
  size = "md",
  centered = true,
  scrollable = false,
  className = "",
  closeButton = true,
  animationDuration = 240,
}) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(show);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (show) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setMounted(true);

      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      timeoutRef.current = window.setTimeout(() => {
        setMounted(false);
      }, animationDuration);
    }
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [show, animationDuration]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  useEffect(() => {
    if (!mounted) return;
    const el = contentRef.current;
    if (!el) return;
    const firstFocusable = el.querySelector<HTMLElement>(
      'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );
    (firstFocusable ?? el).focus();
  }, [mounted]);

  if (!mounted) return null;

  const dialogClasses = [
    "modal-dialog",
    centered ? "modal-dialog-centered" : "",
    scrollable ? "modal-dialog-scrollable" : "",
    sizeClass(size),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={backdropRef}
      id={id}
      className={`modal fade ${
        visible ? "show d-block" : "d-block"
      } ${className}`}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onMouseDown={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: `background-color ${animationDuration}ms ease`,
      }}
    >
      <div
        className={dialogClasses}
        role="document"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className={`modal-content ${visible ? "entering" : "exiting"}`}
          ref={contentRef}
          tabIndex={-1}
          style={{
            transition: `transform ${animationDuration}ms ease, opacity ${animationDuration}ms ease`,
          }}
        >
          <div className="modal-header">
            <div className="w-100">
              {title ? (
                typeof title === "string" ? (
                  <h1
                    className="modal-title fs-4 text-center"
                    id={`${id ?? ""}Label`}
                  >
                    {title}
                  </h1>
                ) : (
                  title
                )
              ) : null}
            </div>
            {closeButton && (
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            )}
          </div>

          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
