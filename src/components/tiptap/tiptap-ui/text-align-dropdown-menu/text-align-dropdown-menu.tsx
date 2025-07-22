"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap/tiptap-icons/chevron-down-icon"
import { AlignCenter } from "lucide-react"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/tiptap/tiptap-ui-primitive/dropdown-menu"
import { TextAlignButton } from "../text-align-button"

export interface TextAlignDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null
  onOpenChange?: (isOpen: boolean) => void
}

export function TextAlignDropdownMenu({
  onOpenChange,
  ...props
}: TextAlignDropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOnOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          role="button"
          tabIndex={-1}
          aria-label="Text alignment"
          tooltip="Text alignment"
          {...props}
        >
          <AlignCenter className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <TextAlignButton align="left" text="Left" />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <TextAlignButton align="center" text="Center" />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <TextAlignButton align="right" text="Right" />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <TextAlignButton align="justify" text="Justify" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TextAlignDropdownMenu
