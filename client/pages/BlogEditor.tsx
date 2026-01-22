import { useState, useCallback } from "react";
import { BlogEditorSinglePage } from "@/components/blog/BlogEditorSinglePage";
import { ProgressIndicator } from "@/components/blog/ProgressIndicator";
import type { BlogPost, ValidationState } from "@/types/blog";

const INITIAL_STATE: BlogPost = {
  primaryKeyword: "",
  secondaryKeywords: [],
  keywordLocked: false,
  h1Title: "",
  featuredImage: { file: null, alt: "" },
  introduction: "",
  sections: {
    whatIs: {
      content: "",
      image: { file: null, alt: "" },
    },
    benefits: {
      items: [],
      image: { file: null, alt: "" },
    },
    types: {
      items: [],
      comparisonImage: { file: null, alt: "" },
    },
    howItWorks: {
      steps: [],
      diagramImage: { file: null, alt: "" },
    },
    useCases: {
      items: [],
      image: { file: null, alt: "" },
    },
    brandPromotion: {
      enabled: false,
      brandName: "",
      uspBullets: [],
      cta: "",
    },
    faqs: {
      items: [],
    },
    conclusion: {
      content: "",
      cta: "",
    },
  },
  metaDescription: "",
  slug: "",
};

export default function BlogEditor() {
  const [post, setPost] = useState<BlogPost>(INITIAL_STATE);
  const [validation, setValidation] = useState<ValidationState>({
    errors: [],
    warnings: [],
    completedSections: [],
  });

  const updatePost = useCallback(
    (updates: Partial<BlogPost>) => {
      setPost((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const updateSection = useCallback(
    (sectionName: keyof BlogPost["sections"], updates: any) => {
      setPost((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionName]: {
            ...prev.sections[sectionName],
            ...updates,
          },
        },
      }));
    },
    []
  );

  const isValid = validation.errors.length === 0;
  const TOTAL_SECTIONS = 5;
  const completionPercent =
    (validation.completedSections.length / TOTAL_SECTIONS) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header with Progress */}
      <ProgressIndicator
        completionPercent={completionPercent}
        completedSections={validation.completedSections.length}
        totalSections={TOTAL_SECTIONS}
        errors={validation.errors}
        warnings={validation.warnings}
      />

      {/* Main Content Area */}
      <div className="min-h-[calc(100vh-80px)] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create Your Blog Post
            </h1>
            <p className="text-gray-600">
              Follow the structured format below to create an SEO-optimized blog post.
              All sections are essential for a complete article.
            </p>
          </div>

          <BlogEditorSinglePage
            post={post}
            validation={validation}
            onUpdatePost={updatePost}
            onUpdateSection={updateSection}
            onValidationChange={setValidation}
          />

          {/* Error/Warning Summary */}
          {!isValid && (
            <div className="mt-12 p-6 bg-red-50 border-2 border-red-200 rounded-lg max-w-3xl mx-auto">
              <h3 className="font-bold text-red-900 mb-4 text-lg">
                ⚠️ Blocking Issues ({validation.errors.length})
              </h3>
              <ul className="space-y-2 text-red-800">
                {validation.errors.map((error, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg max-w-3xl mx-auto">
              <h3 className="font-bold text-yellow-900 mb-4 text-lg">
                ⚡ Warnings ({validation.warnings.length})
              </h3>
              <ul className="space-y-2 text-yellow-800">
                {validation.warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
