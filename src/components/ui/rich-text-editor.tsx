import React, { forwardRef, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'color', 'background',
  'align',
  'link'
];

const RichTextEditor = forwardRef<ReactQuill, RichTextEditorProps>(
  ({ value = '', onChange, placeholder = 'Enter your content...', className, readOnly = false, ...props }, ref) => {
    const quillRef = useRef<ReactQuill>(null);
    
    const imageHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = () => {
        const file = input.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              const index = range ? range.index : 0;
              quill.insertEmbed(index, 'image', reader.result);
              quill.setSelection(index + 1, 0);
            }
          };
          reader.readAsDataURL(file);
        }
      };
    };

    const modulesWithImageHandler = {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: imageHandler,
        },
      },
    };

    return (
      <div className={cn("rich-text-editor [&_.ql-toolbar]:border-border [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:border-border [&_.ql-container]:rounded-b-md [&_.ql-editor]:min-h-[120px] [&_.ql-editor.ql-blank::before]:text-muted-foreground", className)}>
        <ReactQuill
          ref={ref || quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          modules={modulesWithImageHandler}
          formats={[...formats, 'image']}
          className="bg-background"
          {...props}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };