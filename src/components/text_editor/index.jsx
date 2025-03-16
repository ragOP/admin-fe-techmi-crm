import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";

const TextEditor = ({ onTextChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const config = {
    height: 400,
    toolbarSticky: false,
    minHeight: 400,
    maxHeight: 600,
  };

  return (
    <div className="border p-4 min-h-[400px]">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onChange={(newContent) => {
          setContent(newContent);
          onTextChange(newContent);
        }}
      />
    </div>
  );
};

export default TextEditor;
