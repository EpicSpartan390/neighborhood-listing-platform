const features = [
  {
    title: "Listings:",
    description:
      "Browse neighborhood property listings and discover places that fit your needs.",
  },
  {
    title: "Neighborhood Sponsors",
    description:
      "Learn about local organizations and businesses that support the community.",
  },
  {
    title: "Voice Help:",
    description:
      "Use accessible voice assistance to navigate the platform and find information.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Neighborhood Listing Platform
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Find helpful resources in your neighborhood.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            A simple community platform for finding property listings,
            neighborhood sponsors, and accessible voice assistance.
          </p>
        </header>

        <section aria-labelledby="features-heading" className="mt-14">
          <h2 id="features-heading" className="text-2xl font-semibold">
            Platform features
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
              >
                <h3 className="text-xl font-semibold text-emerald-300">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}