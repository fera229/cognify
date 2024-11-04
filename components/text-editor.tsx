'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FontFamilyExtension = Extension.create({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: 'Inter',
            parseHTML: (element) =>
              element.style.fontFamily?.replace(/['"]/g, '') || 'Inter',
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
});

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
}

const FONT_FAMILIES = [
  { name: 'Default', value: 'Inter' },
  { name: 'Serif', value: 'ui-serif' },
  { name: 'Mono', value: 'ui-monospace' },
  { name: 'Comic', value: 'Comic Sans MS' },
] as const;

interface MenuBarProps {
  editor: ReturnType<typeof useEditor>;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      const formattedUrl = linkUrl.match(/^https?:\/\//)
        ? linkUrl
        : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: formattedUrl }).run();
      setLinkUrl('');
      setIsLinkInputOpen(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const setFontFamily = (fontFamily: string) => {
    editor.chain().focus().setMark('textStyle', { fontFamily }).run();
  };

  return (
    <div className="border border-gray-200 rounded-t-md bg-white p-2 flex flex-wrap gap-2 items-center">
      <Select onValueChange={setFontFamily} defaultValue="Inter">
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Font..." />
        </SelectTrigger>
        <SelectContent>
          {FONT_FAMILIES.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span style={{ fontFamily: font.value }}>{font.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-slate-200' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-slate-200' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsLinkInputOpen(!isLinkInputOpen)}
          className={editor.isActive('link') ? 'bg-slate-200' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        {isLinkInputOpen && (
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLink();
                }
              }}
            />
            <Button type="button" variant="ghost" size="sm" onClick={addLink}>
              Add
            </Button>
            {editor.isActive('link') && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeLink}
              >
                Remove
              </Button>
            )}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
        <span className="ml-1 text-xs text-muted-foreground">Ctrl+Z</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
        <span className="ml-1 text-xs text-muted-foreground">Ctrl+Y</span>
      </Button>
    </div>
  );
};

const Editor = ({ onChange, value, disabled }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-disc ml-4',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-decimal ml-4',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        },
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'italic',
          },
        },
      }),
      TextStyle,
      FontFamilyExtension,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Tab') {
          const { selection } = view.state;

          if (event.shiftKey) {
            view.dispatch(view.state.tr.deleteSelection());
            editor?.chain().focus().liftListItem('listItem').run();
          } else {
            view.dispatch(view.state.tr.deleteSelection());
            editor?.chain().focus().sinkListItem('listItem').run();
          }
          return true;
        }
        return false;
      },
    },
  });

  return (
    <div className="border rounded-md">
      <MenuBar editor={editor} />
      <div className="bg-white prose max-w-none p-4 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
