import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';

// Editor is an uncontrolled React component
const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: [
            // [{ 'header': [1, 2, 3, false] }],
            ['bold', {'header': 1}, { 'list': 'bullet' }, 'clean' ],        // toggled buttons
            // ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            // ['blockquote', 'code-block'],
            // ['link', 'image', 'video', 'formula'],
          
            // [{ 'header': 1 }],               // custom button values
            // [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
            // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction
          
            // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          
            // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'font': [] }],
            // [{ 'align': [] }],
          
            // ['clean']                                         // remove formatting button
          ],
        },
      });

      quillRef.current = quill;
      ref.current = quill;

      if (defaultValueRef.current) {
        quill.clipboard.dangerouslyPasteHTML(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        quillRef.current = null;
        container.innerHTML = '';
      };
    }, [ref]);

    useEffect(() => {
      if (quillRef.current && defaultValue !== defaultValueRef.current) {
        quillRef.current.clipboard.dangerouslyPasteHTML(defaultValue);
        defaultValueRef.current = defaultValue;
      }
    }, [defaultValue]);

    return <div ref={containerRef}></div>;
  },
);

Editor.displayName = 'Editor';

export default Editor;