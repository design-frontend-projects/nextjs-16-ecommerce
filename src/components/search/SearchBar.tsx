'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

export function SearchBar({
  className,
  onSearch,
  placeholder,
  showSuggestions = true,
}: SearchBarProps) {
  const t = useTranslations('nav');
  const router = useRouter();
  const { query, setQuery } = useSearchStore();
  const [localQuery, setLocalQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search to recent
  const saveToRecent = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== searchQuery.toLowerCase()
      );
      const updated = [searchQuery, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      setQuery(trimmed);
      saveToRecent(trimmed);
      setIsFocused(false);

      if (onSearch) {
        onSearch(trimmed);
      } else {
        router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      }
    },
    [setQuery, saveToRecent, onSearch, router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    setQuery('');
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown =
    showSuggestions && isFocused && recentSearches.length > 0;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder || t('searchPlaceholder')}
            className="pl-10 pr-10 h-10 rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-colors"
          />
          {localQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Recent Searches Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="text-xs font-medium text-muted-foreground">
              Recent Searches
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-1 px-2"
              onClick={clearRecentSearches}
            >
              Clear
            </Button>
          </div>
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
                  onClick={() => {
                    setLocalQuery(search);
                    handleSearch(search);
                  }}
                >
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{search}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
