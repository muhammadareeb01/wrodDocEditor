import Link from "next/link";


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-900 border-t-4" style={{ borderColor: 'var(--theme-color-2)' }}>
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ background: "linear-gradient(135deg, var(--theme-color-1), var(--theme-color-2))" }}>
            D
          </div>
          <h1 className="text-3xl font-bold tracking-tight">DocFlow</h1>
        </div>

        <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-gray-900">
          The Workspace for Your Best Ideas.
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-600">
          A lightweight, collaborative document editor that brings your team together. Create, share, and stay synchronized without the clutter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup"
            className="px-8 py-3 rounded-lg font-bold text-white shadow-md hover:shadow-lg transition-shadow"
            style={{ background: "var(--theme-color-2)" }}>
            Get Started Free
          </Link>
          <Link href="/login"
            className="px-8 py-3 rounded-lg font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
            Sign In
          </Link>
        </div>

        {/* Hero Image Mockup */}
        <div className="relative w-full max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          <img src="/hero-preview.png" alt="DocFlow Dashboard Preview" className="w-full h-auto block" />
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="w-full bg-white py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to write</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Focus on writing while DocFlow takes care of formatting, saving, and collaboration syncing behind the scenes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "⚡", title: "Instant Collaboration", desc: "Share a link and see your teammates' cursors moving in real-time." },
              { icon: "📄", title: "File Import", desc: "Upload .txt or .md files instantly to start editing without copy-pasting." },
              { icon: "🔒", title: "Granular Permissions", desc: "Easily control who views or edits your content. Maintain privacy by default." },
            ].map((feature) => (
              <div key={feature.title} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:-translate-y-1 transition-transform">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="font-bold mb-2 text-lg text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Split Section */}
      <section className="w-full py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm" style={{ background: "rgba(106, 17, 203, 0.1)", color: "var(--theme-color-1)" }}>
              🚀
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Work faster, not harder.</h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Managing documents shouldn&apos;t feel like a chore. DocFlow offers a seamless rich-text TiTap editor that formats beautifully as you type. Combined with our real-time engine, you&apos;ll never overwrite a colleague&apos;s work again.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Minimalist Distraction-Free UI",
                "Advanced Sharing & Revocation",
                "Built on robust Next.js technology"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-700 font-medium">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700">
              Create your account  &rarr;
            </Link>
          </div>
          <div className="md:w-1/2 w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white p-2">
             <img src="/hero-preview.png" alt="Collaboration feature visual" className="w-full h-auto rounded-xl opacity-90" style={{ filter: "hue-rotate(30deg)" }} />
          </div>
        </div>
      </section>
    </main>
  );
}
