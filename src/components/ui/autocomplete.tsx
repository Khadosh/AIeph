
import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from "react";

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
  const commandRef = useRef<HTMLDivElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option[]>(value);
  const [inputValue, setInputValue] = useState<string>("");

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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
            
            // Close autocomplete if maxItems is reached
            if (maxItems && newSelected.length >= maxItems) {
              setOpen(false);
            }
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
          
          // Close autocomplete if maxItems is reached
          if (maxItems && newSelected.length >= maxItems) {
            setOpen(false);
          }
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

  const isMaxReached = maxItems && selected.length >= maxItems;
  const dynamicPlaceholder = isMaxReached 
    ? `Límite alcanzado (${selected.length}/${maxItems})`
    : placeholder;

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

      <CommandPrimitive ref={commandRef} onKeyDown={handleKeyDown}>
        <div className={cn(
          "border rounded-md",
          isMaxReached && "opacity-60"
        )}>
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={isLoading ? undefined : setInputValue}
            onBlur={handleBlur}
            onFocus={() => !isMaxReached && setOpen(true)}
            placeholder={dynamicPlaceholder}
            disabled={disabled || isMaxReached as boolean}
            className={cn(isMaxReached && "cursor-not-allowed")}
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
      
      {/* Helper text when max items reached */}
      {isMaxReached && (
        <div className="text-xs text-muted-foreground mt-1">
          Máximo de {maxItems} elemento{maxItems !== 1 ? 's' : ''} seleccionado{maxItems !== 1 ? 's' : ''}. 
          Elimina uno para agregar más.
        </div>
      )}
    </div>
  );
};