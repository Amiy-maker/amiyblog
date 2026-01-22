import { ImageUploadField } from "../ImageUploadField";
import { suggestAltText } from "@/lib/blog-validation";
import type { BlogPost } from "@/types/blog";

interface FeaturedImageSectionProps {
  post: BlogPost;
  onUpdatePost: (updates: Partial<BlogPost>) => void;
}

export function FeaturedImageSection({ post, onUpdatePost }: FeaturedImageSectionProps) {
  return (
    <div className="space-y-6 pb-6">
      <ImageUploadField
        label="Featured Image"
        value={post.featuredImage}
        onChange={(imageData) =>
          onUpdatePost({
            featuredImage: {
              ...imageData,
              alt: imageData.alt || suggestAltText("featured", post.primaryKeyword),
            },
          })
        }
        suggestedAltText={suggestAltText("featured", post.primaryKeyword)}
        required={true}
        helpText="This image will appear at the top of your blog post. Choose a high-quality, relevant image that represents your topic."
      />

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
        <p className="text-sm text-blue-900">
          <strong>📏 Image Guidelines:</strong>
        </p>
        <ul className="text-sm text-blue-800 space-y-1 ml-4">
          <li>• Use landscape format (16:9 aspect ratio)</li>
          <li>• File size: less than 5MB</li>
          <li>• Formats: JPG, PNG, or WebP</li>
          <li>• Alt text is required for SEO and accessibility</li>
        </ul>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> The alt text helps search engines understand your
          image and improves accessibility for screen readers. Make sure it describes
          the image content and includes your primary keyword when possible.
        </p>
      </div>
    </div>
  );
}
