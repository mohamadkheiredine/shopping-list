import { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
const createWrapperAndAppendToBody = (wrapperId: string) => {
  if (!document) return null;
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};
function ReactPortal({
  children,
  wrapperId
}: {
  children: React.ReactElement;
  wrapperId: string;
}) {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;
    // If element is not found with wrapperId, create and append to body
    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element!);
    return () => {
      // Delete the programmatically created element
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);
  // wrapperElement state will be null on the very first render
  if (!wrapperElement) return null;
  return createPortal(children, wrapperElement);
}
export default ReactPortal;