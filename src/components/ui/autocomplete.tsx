
import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useCallback, type KeyboardEvent } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value?: Option[];
  onValueChange?: (value: Option[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  maxItems?: number;
};

export const Autocomplete = ({
  options,
  placeholder,
  emptyMessage,
  value = [],
  onValueChange,
  disabled,
  isLoading = false,
  className,
  maxItems
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option[]>(value);
  const [inputValue, setInputValue] = useState<string>("");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      if (!isOpen) {
        setOpen(true);
      }

      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value
        );
        if (optionToSelect && !selected.find(s => s.value === optionToSelect.value)) {
          if (!maxItems || selected.length < maxItems) {
            const newSelected = [...selected, optionToSelect];
            setSelected(newSelected);
            onValueChange?.(newSelected);
            setInputValue("");
          }
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange, selected, maxItems]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      if (!selected.find(s => s.value === selectedOption.value)) {
        if (!maxItems || selected.length < maxItems) {
          const newSelected = [...selected, selectedOption];
          setSelected(newSelected);
          onValueChange?.(newSelected);
          setInputValue("");
        }
      }

      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange, selected, maxItems]
  );

  const handleRemoveOption = useCallback(
    (optionToRemove: Option) => {
      const newSelected = selected.filter(s => s.value !== optionToRemove.value);
      setSelected(newSelected);
      onValueChange?.(newSelected);
    },
    [selected, onValueChange]
  );

  const filteredOptions = options.filter(option =>
    !selected.find(s => s.value === option.value)
  );

  return (
    <div className={className}>
      {/* Selected items badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selected.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleRemoveOption(option)}
            >
              {option.label}
              <XCircle className="ml-1 cursor-pointer" />
            </Badge>
          ))}
        </div>
      )}

      <CommandPrimitive onKeyDown={handleKeyDown}>
        <div className="border rounded-md">
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={isLoading ? undefined : setInputValue}
            onBlur={handleBlur}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled || (maxItems ? selected.length >= maxItems : false)}
          />
        </div>
        <div className="relative mt-1">
          <div
            className={cn(
              "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white dark:bg-gray-800 outline-none",
              isOpen ? "block" : "hidden"
            )}
          >
            <CommandList className="rounded-lg ring-1 ring-slate-200 dark:ring-gray-700">
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}
              {filteredOptions.length > 0 && !isLoading ? (
                <CommandGroup>
                  {filteredOptions.map((option) => {
                    const isSelected = !!selected.find(s => s.value === option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className={cn(
                          "flex w-full items-center gap-2 dark:text-white",
                          !isSelected ? "pl-8" : null
                        )}
                      >
                        {isSelected ? <Check className="w-4" /> : null}
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm dark:text-gray-400">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
          </div>
        </div>
      </CommandPrimitive>
    </div>
  );
};