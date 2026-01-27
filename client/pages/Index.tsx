import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, CheckCircle2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Blog Creator</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
          <p className="text-gray-600">
            Build SEO-optimized blog posts with guided, non-technical workflows
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl">Welcome to the Blog Creator</CardTitle>
            <CardDescription className="text-blue-100">
              Production-ready SEO-optimized blog editor for non-technical users
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700">
                Create professional, SEO-ready blog posts without any technical
                knowledge. Our guided editor enforces best practices and ensures
                your content ranks well in search engines.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Guided Steps</h3>
                  <p className="text-sm text-gray-600">
                    Follow 12 easy steps to create a complete blog post
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">SEO Optimized</h3>
                  <p className="text-sm text-gray-600">
                    Built-in validation ensures SEO best practices
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Live Preview</h3>
                  <p className="text-sm text-gray-600">
                    See your post as you write it
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Shopify Ready</h3>
                  <p className="text-sm text-gray-600">
                    Output exports to Shopify metafields
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t pt-6 space-y-3">
              <div>
                <Button
                  onClick={() => navigate("/blog/create")}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Guided Editor (Step-by-Step)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Best for detailed, form-based creation with validation
                </p>
              </div>
              <div>
                <Button
                  onClick={() => navigate("/blog/generator")}
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  Text Generator (Fast)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Quick text-based generation using section markers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            What You'll Create
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>• A complete, structured blog post with proper heading hierarchy</li>
            <li>• SEO-optimized content with keyword integration</li>
            <li>• Image alt-text for accessibility and SEO</li>
            <li>• FAQ schema markup for rich snippets</li>
            <li>• Clean HTML ready for Shopify or any platform</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
