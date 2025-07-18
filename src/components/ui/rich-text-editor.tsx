
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

const RichTextEditor = React.forwardRef<Editor, RichTextEditorProps>(
  ({ value = '', onChange, placeholder = 'Enter your content...', className, readOnly = false, ...props }, ref) => {
    return (
      <div className={cn("rich-text-editor [&_.tox-tinymce]:border-border [&_.tox-tinymce]:rounded-md", className)}>
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          value={value}
          onEditorChange={(content) => onChange?.(content)}
          init={{
            height: 200,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
              'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat',
            placeholder,
          }}
          disabled={readOnly}
          {...props}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };