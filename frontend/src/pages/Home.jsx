import Navbar from "../components/Navbar"

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              AI Customer Support Platform
            </p>

            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Turn Customer Support into
              <span className="text-cyan-400"> AI-Powered Support.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Build an AI support assistant trained on your company's
              knowledge, while giving your customers instant access to
              human support when they need it.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
                Create Account
              </button>

              <button className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">
                See How It Works
              </button>
            </div>
          </div>
        </section>
             
            <section id="features" className="bg-slate-900/50 py-24">
  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
        Powerful Features
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
        Everything you need for smarter support
      </h2>

      <p className="mt-5 text-lg text-slate-400">
        Give your customers instant AI-powered support while keeping
        your human support team in control.
      </p>
    </div>

    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      <div className="rounded-2xl border border-white/10 bg-slate-950 p-7">
        <div className="text-3xl">🤖</div>
        <h3 className="mt-5 text-xl font-semibold text-white">
          AI Support Agent
        </h3>
        <p className="mt-3 text-slate-400">
          Answer customer questions instantly using your company's
          own knowledge and documentation.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950 p-7">
        <div className="text-3xl">📚</div>
        <h3 className="mt-5 text-xl font-semibold text-white">
          Knowledge Base
        </h3>
        <p className="mt-3 text-slate-400">
          Upload PDFs, FAQs, policies and other documents to build
          your AI's knowledge base.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950 p-7">
        <div className="text-3xl">💬</div>
        <h3 className="mt-5 text-xl font-semibold text-white">
          Human Handoff
        </h3>
        <p className="mt-3 text-slate-400">
          Let customers move from AI support to a real support agent
          whenever human help is needed.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950 p-7">
        <div className="text-3xl">📊</div>
        <h3 className="mt-5 text-xl font-semibold text-white">
          Smart Analytics
        </h3>
        <p className="mt-3 text-slate-400">
          Track conversations, AI resolution rates, response times
          and customer support performance.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950 p-7">
        <div className="text-3xl">👥</div>
        <h3 className="mt-5 text-xl font-semibold text-white">
          Team Management
        </h3>
        <p className="mt-3 text-slate-400">
          Invite support agents and control access using
          role-based permissions.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950 p-7">
        <div className="text-3xl">⚡</div>
        <h3 className="mt-5 text-xl font-semibold text-white">
          Real-Time Support
        </h3>
        <p className="mt-3 text-slate-400">
          Connect customers and support agents instantly with
          real-time communication.
        </p>
      </div>

    </div>
  </div>
</section>

<section id="how-it-works" className="py-24">
  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
        How It Works
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
        From your knowledge to AI support
      </h2>

      <p className="mt-5 text-lg text-slate-400">
        Set up your AI support system in a few simple steps.
      </p>
    </div>

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

      <div className="relative rounded-2xl border border-white/10 bg-slate-900 p-7">
        <div className="text-4xl font-bold text-cyan-400">01</div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          Create Workspace
        </h3>

        <p className="mt-3 text-slate-400">
          Create your company account and set up your SupportSphere
          workspace.
        </p>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-slate-900 p-7">
        <div className="text-4xl font-bold text-cyan-400">02</div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          Add Knowledge
        </h3>

        <p className="mt-3 text-slate-400">
          Upload your PDFs, FAQs, policies and documentation so your
          AI understands your business.
        </p>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-slate-900 p-7">
        <div className="text-4xl font-bold text-cyan-400">03</div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          AI Learns
        </h3>

        <p className="mt-3 text-slate-400">
          Our RAG system processes your knowledge and makes it
          available to the AI assistant.
        </p>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-slate-900 p-7">
        <div className="text-4xl font-bold text-cyan-400">04</div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          Support Customers
        </h3>

        <p className="mt-3 text-slate-400">
          Customers ask questions and receive instant AI answers,
          with human support available when needed.
        </p>
      </div>

    </div>
  </div>
</section>


       <section id="pricing" className="bg-slate-900/50 py-24">
  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
        Pricing
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
        Simple plans for every business
      </h2>

      <p className="mt-5 text-lg text-slate-400">
        Start free and upgrade when your customer support grows.
      </p>
    </div>

    <div className="mt-16 grid gap-8 lg:grid-cols-3">

      {/* Free */}
      <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
        <h3 className="text-2xl font-semibold text-white">
          Free
        </h3>

        <p className="mt-3 text-slate-400">
          For individuals and small projects.
        </p>

        <div className="mt-6">
          <span className="text-5xl font-bold text-white">₹0</span>
          <span className="text-slate-400"> / month</span>
        </div>

        <ul className="mt-8 space-y-4 text-slate-300">
          <li>✓ 100 conversations / month</li>
          <li>✓ 1 workspace</li>
          <li>✓ Basic AI assistant</li>
          <li>✓ Knowledge base</li>
        </ul>

        <button className="mt-8 w-full rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10">
          Create Account
        </button>
      </div>

      {/* Pro */}
      <div className="relative rounded-3xl border border-cyan-400/50 bg-slate-950 p-8 shadow-xl shadow-cyan-500/10">

        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-1 text-sm font-semibold text-slate-950">
          Most Popular
        </div>

        <h3 className="text-2xl font-semibold text-white">
          Pro
        </h3>

        <p className="mt-3 text-slate-400">
          For growing businesses.
        </p>

        <div className="mt-6">
          <span className="text-5xl font-bold text-white">₹999</span>
          <span className="text-slate-400"> / month</span>
        </div>

        <ul className="mt-8 space-y-4 text-slate-300">
          <li>✓ 5,000 conversations / month</li>
          <li>✓ 3 team members</li>
          <li>✓ Advanced AI assistant</li>
          <li>✓ RAG knowledge base</li>
          <li>✓ Analytics</li>
          <li>✓ Human handoff</li>
        </ul>

        <button className="mt-8 w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
          Create Account
        </button>
      </div>

      {/* Business */}
      <div className="rounded-3xl border border-white/10 bg-slate-950 p-8">
        <h3 className="text-2xl font-semibold text-white">
          Business
        </h3>

        <p className="mt-3 text-slate-400">
          For teams with high support volume.
        </p>

        <div className="mt-6">
          <span className="text-5xl font-bold text-white">₹2,999</span>
          <span className="text-slate-400"> / month</span>
        </div>

        <ul className="mt-8 space-y-4 text-slate-300">
          <li>✓ 50,000 conversations / month</li>
          <li>✓ Unlimited team members</li>
          <li>✓ Advanced RAG</li>
          <li>✓ Advanced analytics</li>
          <li>✓ API access</li>
          <li>✓ Priority support</li>
        </ul>

        <button className="mt-8 w-full rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10">
          Create Account
        </button>
      </div>

    </div>
  </div>
</section>

            <section className="py-24">
  <div className="mx-auto max-w-4xl px-6">

    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
        FAQ
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
        Frequently asked questions
      </h2>

      <p className="mt-5 text-lg text-slate-400">
        Everything you need to know about SupportSphere AI.
      </p>
    </div>

    <div className="mt-12 space-y-4">

      <details className="group rounded-2xl border border-white/10 bg-slate-900 p-6">
        <summary className="cursor-pointer list-none text-lg font-semibold text-white">
          What is SupportSphere AI?
        </summary>

        <p className="mt-4 leading-7 text-slate-400">
          SupportSphere AI is a customer-support platform that allows
          businesses to create AI assistants using their own knowledge,
          documents and FAQs.
        </p>
      </details>

      <details className="group rounded-2xl border border-white/10 bg-slate-900 p-6">
        <summary className="cursor-pointer list-none text-lg font-semibold text-white">
          Can the AI answer using our own documents?
        </summary>

        <p className="mt-4 leading-7 text-slate-400">
          Yes. Businesses can upload documents and build a knowledge
          base that the AI uses to answer customer questions.
        </p>
      </details>

      <details className="group rounded-2xl border border-white/10 bg-slate-900 p-6">
        <summary className="cursor-pointer list-none text-lg font-semibold text-white">
          Can customers talk to a human agent?
        </summary>

        <p className="mt-4 leading-7 text-slate-400">
          Yes. Customers can request human support whenever the AI
          cannot properly resolve their issue.
        </p>
      </details>

      <details className="group rounded-2xl border border-white/10 bg-slate-900 p-6">
        <summary className="cursor-pointer list-none text-lg font-semibold text-white">
          Is my company's data isolated from other companies?
        </summary>

        <p className="mt-4 leading-7 text-slate-400">
          Yes. SupportSphere is designed as a multi-tenant SaaS
          platform where each company's data is isolated.
        </p>
      </details>

      <details className="group rounded-2xl border border-white/10 bg-slate-900 p-6">
        <summary className="cursor-pointer list-none text-lg font-semibold text-white">
          Can I integrate SupportSphere into my website?
        </summary>

        <p className="mt-4 leading-7 text-slate-400">
          Yes. We will eventually provide an embeddable chat widget
          and API for integrating SupportSphere into external websites.
        </p>
      </details>

    </div>
  </div>
</section>


    <footer className="border-t border-white/10 bg-slate-950">
  <div className="mx-auto max-w-7xl px-6 py-12">

    <div className="grid gap-10 md:grid-cols-4">

      <div className="md:col-span-2">
        <h3 className="text-2xl font-bold text-white">
          SupportSphere<span className="text-cyan-400">AI</span>
        </h3>

        <p className="mt-4 max-w-md leading-7 text-slate-400">
          AI-powered customer support that helps businesses
          deliver faster, smarter and more reliable support.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-white">
          Product
        </h4>

        <ul className="mt-4 space-y-3 text-slate-400">
          <li>Features</li>
          <li>Pricing</li>
          <li>How It Works</li>
          <li>API</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-white">
          Company
        </h4>

        <ul className="mt-4 space-y-3 text-slate-400">
          <li>About</li>
          <li>Contact</li>
          <li>Privacy</li>
          <li>Terms</li>
        </ul>
      </div>

    </div>

    <div className="mt-12 border-t border-white/10 pt-8 text-sm text-slate-500">
      © 2026 SupportSphere AI. All rights reserved.
    </div>

  </div>
</footer>


      </main>
    </div>
  )
}

export default Home