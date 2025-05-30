import { useState } from 'react';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

// TODO: Replace with API data
const POPULAR_TAGS = [
  'feeding',
  'sleep',
  'health',
  'development',
  'newborn',
  'safety',
  'breastfeeding',
  'milestones',
];

export function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = POPULAR_TAGS.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${
              selectedTags.includes(tag)
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {tag}
            {selectedTags.includes(tag) && (
              <span className="ml-1 text-white">&times;</span>
            )}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <button
          onClick={() => onTagsChange([])}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      )}
    </div>
  );
} 