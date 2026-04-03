import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Box } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuBar } from './MenuBar';
import { editorStyles } from './styles';

interface RichTextEditorProps {
  name: string;
  placeholder?: string;
  minHeight?: number | string;
  rules?: any;
  disabled?: boolean;
  defaultValue?: string;
}

export interface RichTextEditorRef {
  getEditor: () => any;
  undo: () => void;
  redo: () => void;
  copyContent: () => void;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ name, placeholder = 'Tulis konten di sini...', minHeight = '320px', rules, disabled = false, defaultValue = '' }, ref) => {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => (
          <RichTextEditorInner
            ref={ref}
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            minHeight={minHeight}
            disabled={disabled}
            error={error?.message as string}
          />
        )}
      />
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

interface RichTextEditorInnerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeight: number | string;
  disabled: boolean;
  error?: string;
}

const RichTextEditorInner = forwardRef<RichTextEditorRef, RichTextEditorInnerProps>(
  ({ value, onChange, placeholder, minHeight, disabled, error }, ref) => {
    const editorRef = useRef<any>(null);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Image.configure({
          inline: true,
          allowBase64: true,
          HTMLAttributes: {
            class: 'editor-image',
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true,
        }),
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange(html);
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm max-w-none focus:outline-none',
        },
      },
    });

    // Update editor content when value changes from outside
    React.useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    // Update editable state
    React.useEffect(() => {
      if (editor) {
        editor.setEditable(!disabled);
      }
    }, [disabled, editor]);

    // Store editor ref
    React.useEffect(() => {
      if (editor) {
        editorRef.current = editor;
      }
    }, [editor]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
      undo: () => {
        if (editor) {
          editor.chain().focus().undo().run();
        }
      },
      redo: () => {
        if (editor) {
          editor.chain().focus().redo().run();
        }
      },
      copyContent: () => {
        if (editor) {
          const html = editor.getHTML();
          const text = editor.getText();
          
          // Copy as both HTML and plain text
          if (navigator.clipboard && window.ClipboardItem) {
            const htmlBlob = new Blob([html], { type: 'text/html' });
            const textBlob = new Blob([text], { type: 'text/plain' });
            const clipboardItem = new ClipboardItem({
              'text/html': htmlBlob,
              'text/plain': textBlob,
            });
            navigator.clipboard.write([clipboardItem]);
          } else {
            // Fallback for older browsers
            navigator.clipboard.writeText(text);
          }
        }
      },
    }));

    return (
      <Box>
        <MenuBar editor={editor} />
        <Box
          sx={{
            ...editorStyles,
            minHeight,
            border: error ? '1px solid #EF4444' : 'none',
            borderRadius: error ? '4px' : 0,
            padding: error ? '8px' : 0,
            paddingTop: 3,
          }}
        >
          <EditorContent editor={editor} />
        </Box>
        {error && (
          <Box sx={{ color: '#EF4444', fontSize: '12px', mt: 0.5 }}>
            {error}
          </Box>
        )}
      </Box>
    );
  }
);

RichTextEditorInner.displayName = 'RichTextEditorInner';

export default RichTextEditor;
