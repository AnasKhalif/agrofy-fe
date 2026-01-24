import { Icon } from "@iconify/react";
import { Box } from "@mui/material";
import type { Editor } from "@tiptap/react";
import { toolbarButtonStyles, dividerStyles } from "./styles";
// import { useUploadDocumentImage } from '@/app/api/document/useDocumentApi';

interface MenuBarProps {
  editor: Editor | null;
  onImageUpload?: () => void;
}

const MenuButton = ({
  onClick,
  isActive = false,
  disabled = false,
  icon,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: string;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={isActive ? "is-active" : ""}
    style={{
      ...toolbarButtonStyles,
      ...(isActive ? (toolbarButtonStyles["&.is-active"] as any) : {}),
    }}
  >
    <Icon icon={icon} width={18} />
  </button>
);

const Divider = () => <Box sx={dividerStyles} />;

export const MenuBar = ({ editor, onImageUpload }: MenuBarProps) => {
  const uploadImageMutation = useUploadDocumentImage();

  if (!editor) {
    return null;
  }

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          // Upload to server and get URL
          const response = await uploadImageMutation.mutateAsync(file);
          const imageUrl = response.data.data.url;
          // Insert image with URL instead of base64
          editor.chain().focus().setImage({ src: imageUrl }).run();
          onImageUpload?.();
        } catch (error) {
          console.error("Failed to upload image:", error);
          alert("Gagal upload gambar. Silakan coba lagi.");
        }
      }
    };
    input.click();
  };

  return (
    <Box
      sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}
    >
      {/* Text Formatting */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        icon="solar:text-bold-linear"
        title="Bold (Ctrl+B)"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        icon="solar:text-italic-linear"
        title="Italic (Ctrl+I)"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        icon="solar:text-underline-linear"
        title="Underline (Ctrl+U)"
      />
      {/* <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon="solar:text-cross-linear"
        title="Strikethrough"
      /> */}

      <Divider />

      {/* Headings */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        icon="mdi:format-header-1"
        title="Heading 1"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        icon="mdi:format-header-2"
        title="Heading 2"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        icon="mdi:format-header-3"
        title="Heading 3"
      />
      <MenuButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
        icon="solar:text-linear"
        title="Paragraph"
      />

      <Divider />

      {/* Lists */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon="solar:list-linear"
        title="Bullet List"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon="solar:list-check-linear"
        title="Numbered List"
      />

      <Divider />

      {/* Alignment */}
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        icon="solar:align-left-linear"
        title="Align Left"
      />
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        icon="solar:align-horizontal-center-linear"
        title="Align Center"
      />
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        icon="solar:align-right-linear"
        title="Align Right"
      />
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        icon="solar:hamburger-menu-linear"
        title="Justify"
      />

      <Divider />

      {/* Image */}
      <MenuButton
        onClick={handleImageUpload}
        disabled={uploadImageMutation.isPending}
        icon={
          uploadImageMutation.isPending
            ? "svg-spinners:180-ring-with-bg"
            : "solar:gallery-add-linear"
        }
        title={uploadImageMutation.isPending ? "Uploading..." : "Insert Image"}
      />

      {/* Additional */}
      {/* <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon="solar:minus-square-linear"
        title="Horizontal Line"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon="solar:quote-down-linear"
        title="Quote"
      /> */}
    </Box>
  );
};
