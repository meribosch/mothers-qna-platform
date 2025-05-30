import { useState } from 'react';
import { useRouter } from 'next/router';

interface QuestionFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string[];
  }) => Promise<void>;
  initialData?: {
    title: string;
    content: string;
    tags: string[];
  };
  isEditing?: boolean;
}

// Common tags for autocomplete
const SUGGESTED_TAGS = [
  'feeding',
  'sleep',
  'health',
  'development',
  'newborn',
  'safety',
  'breastfeeding',
  'milestones',
  'behavior',
  'routine',
];

export function QuestionForm({ onSubmit, initialData, isEditing = false }: QuestionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const filteredTags = SUGGESTED_TAGS.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !formData.tags.includes(tag)
  );

  const handleAddTag = (tag: string) => {
    if (formData.tags.length >= 5) {
      setError('You can only add up to 5 tags');
      return;
    }
    if (tag.trim() && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (formData.tags.length === 0) {
      setError('At least one tag is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      router.push('/questions');
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Be specific and imagine you're asking a question to another mother
        </p>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. How often should I feed my newborn?"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Question Details
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Include all the information someone would need to answer your question
        </p>
        <div className="mt-1">
          <textarea
            id="content"
            name="content"
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Share more details about your question..."
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Add up to 5 tags to describe what your question is about
        </p>
        <div className="mt-1">
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-indigo-500 hover:text-indigo-600"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="relative mt-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowTagSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(tagInput);
                }
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Type a tag and press enter"
            />
            {showTagSuggestions && tagInput && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="relative w-full cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-50"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting
            ? isEditing
              ? 'Saving...'
              : 'Posting...'
            : isEditing
            ? 'Save Changes'
            : 'Post Question'}
        </button>
      </div>
    </form>
  );
} 