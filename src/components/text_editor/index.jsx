import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";

const TextEditor = ({ onTextChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    height: 400,
    minHeight: 400,
    maxHeight: 600,
    placeholder: "Start writing your blog...",
    buttons: "bold,italic,underline,|,ul,ol,|,link,undo,redo", // Essential formatting tools
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarSticky: false,
    toolbarAdaptive: false,
  };

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      onBlur={(newContent) => {
        setContent(newContent);
        onTextChange(newContent);
      }}
    />
  );
};

export default TextEditor;
