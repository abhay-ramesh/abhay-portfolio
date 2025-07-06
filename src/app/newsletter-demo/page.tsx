import NewsletterSignup from "@/components/NewsletterSignup";

export default function NewsletterDemo() {
  return (
    <div className="px-4 py-12 min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto space-y-12 max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white font-clash">
            Newsletter Component Demo
          </h1>
          <p className="text-xl text-white/60">
            Resend Audiences integration with automatic audience creation
          </p>
        </div>

        {/* Basic Newsletter Signup */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-white font-clash">
              Knowledge Sharing Focus
            </h2>
            <NewsletterSignup className="mx-auto max-w-md" />
          </div>

          {/* Blog Post Integration */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-white font-clash">
              Blog Post Integration
            </h2>
            <div className="mx-auto max-w-2xl">
              <div className="mb-16">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-2 py-1 text-xs whitespace-nowrap rounded md:text-sm bg-white/10 text-white/80">
                    Development
                  </span>
                  <span className="px-2 py-1 text-xs whitespace-nowrap rounded md:text-sm bg-white/10 text-white/80">
                    Tutorial
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white font-clash">
                  How to Build a Newsletter Component
                </h3>
                <p className="text-white/60 line-clamp-3">
                  This is how your blog post content would look. The newsletter
                  signup appears naturally at the end of your posts, seamlessly
                  integrated with your existing design...
                </p>
              </div>

              <div className="pt-8 border-t border-white/10">
                <NewsletterSignup
                  title="Keep Learning"
                  description="Get my latest methods and insights delivered to your inbox."
                />
              </div>
            </div>
          </div>

          {/* Project Showcase */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-white font-clash">
              After Project Showcase
            </h2>
            <NewsletterSignup
              title="Behind the Scenes"
              description="Learn how I built this and get exclusive development insights."
              className="mx-auto max-w-lg"
            />
          </div>

          {/* Footer/Contact Section */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-white font-clash">
              Contact/About Section
            </h2>
            <NewsletterSignup
              title="Let's Connect"
              description="Join developers learning my proven methods and approaches."
              className="mx-auto max-w-md"
            />
          </div>

          {/* Ultra Minimal */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-white font-clash">
              Ultra Minimal
            </h2>
            <NewsletterSignup
              title="Weekly Insights"
              description="Methods. Tips. Code."
              className="mx-auto max-w-xs"
            />
          </div>

          {/* Horizontal Layout */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-white font-clash">
              Horizontal Layout
            </h2>
            <NewsletterSignup
              title="Side-by-Side Newsletter"
              description="Perfect for wider sections with more space. Text on the left, form on the right."
              layout="horizontal"
              className="mx-auto max-w-4xl"
            />
          </div>

          {/* No Header (for sections with existing titles) */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-white font-clash">
              Section with Existing Title
            </h2>
            <p className="mb-6 text-white/60">
              When you already have a section title and description, hide the
              newsletter component&apos;s header to avoid duplication.
            </p>
            <NewsletterSignup
              title="This title is hidden"
              description="This description is hidden"
              showHeader={false}
              className="mx-auto max-w-md"
            />
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="p-8 rounded-lg border bg-white/5 border-white/10">
          <h2 className="mb-4 text-2xl font-semibold text-white font-clash">
            🚀 Usage Instructions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white/90">
                1. Install Resend
              </h3>
              <pre className="overflow-x-auto p-3 text-sm rounded border bg-white/5 border-white/10">
                <code className="text-white/80">npm install resend</code>
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white/90">
                2. Environment Variables
              </h3>
              <p className="mb-2 text-white/60">Add to your .env.local file:</p>
              <pre className="overflow-x-auto p-3 text-sm rounded border bg-white/5 border-white/10">
                <code className="text-white/80">{`RESEND_API_KEY=re_xxxxxxxxx
RESEND_AUDIENCE_ID=78261eea-8f8b-4381-83c6-79fa7120f1cf  # Optional`}</code>
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white/90">
                3. Component Usage
              </h3>
              <pre className="overflow-x-auto p-3 text-sm rounded border bg-white/5 border-white/10">
                <code className="text-white/80">{`import NewsletterSignup from '@/components/NewsletterSignup'

// End of blog post
<NewsletterSignup
  title="Keep Learning"
  description="Get my latest methods and insights delivered to your inbox."
/>

// After project showcase
<NewsletterSignup
  title="Behind the Scenes"
  description="Learn how I built this and get exclusive development insights."
/>

// Horizontal layout for wider sections
<NewsletterSignup
  title="Side-by-Side Newsletter"
  description="Perfect for wider sections with more space."
  layout="horizontal"
  className="mx-auto max-w-4xl"
/>

// Hide header when section already has title/description
<NewsletterSignup
  showHeader={false}
  className="mx-auto max-w-md"
/>

// Footer/About section
<NewsletterSignup
  title="Let's Connect"
  description="Join developers learning my proven methods."
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white/90">
                ✨ Features
              </h3>
              <ul className="space-y-1 text-white/60">
                <li>• 🎯 Perfect for knowledge-sharing portfolios</li>
                <li>• ✨ Ultra-minimal design matching your blog aesthetic</li>
                <li>
                  • 🧠 Focus on learning & expertise, not generic newsletters
                </li>
                <li>• ⚡ Automatic audience creation in Resend</li>
                <li>• 🎨 Customizable copy for different contexts</li>
                <li>• 📱 Clean, responsive design</li>
                <li>• 🚫 Built-in spam protection</li>
                <li>• 🔄 Horizontal & vertical layout options</li>
                <li>• 🎭 Hide headers to avoid duplication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
