import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import { Quill } from "react-quill";

const TextEditor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        theme: "snow",
      });

      ref.current = quill;

      if (defaultValueRef.current) {
        quill.root.innerHTML = defaultValueRef.current;
      }

      quill.on(Quill.events.TEXT_CHANGE, () => {
        const htmlContent = quill.root.innerHTML; 
        onTextChangeRef.current?.(htmlContent);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref]);

    return <div className="h-[20rem]" ref={containerRef}></div>;
  }
);

TextEditor.displayName = "TextEditor";

export default TextEditor;