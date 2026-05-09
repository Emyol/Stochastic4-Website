import { Database, FileText, Github } from 'lucide-react';
import ResourceLink from '@/features/home/components/ResourceLink';

export default function Resources() {
  return (
    <section id="resources" className="pb-28 md:pb-40">
      <div className="container">
        <div className="reveal relative overflow-hidden rounded-[2rem] bg-[#16224a] text-white p-10 md:p-16">
          <div className="grid-paper absolute inset-0 opacity-60" aria-hidden />
          <div
            aria-hidden
            className="floaty absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#2c8fd5]/40 blur-3xl"
          />

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7 space-y-5">
              <span className="eyebrow text-[#4ea7e0]">Resources</span>
              <h2 className="font-display text-4xl md:text-6xl font-medium leading-[0.98]">
                Explore the <em className="not-italic text-[#4ea7e0]">project</em>.
              </h2>
              <p className="max-w-md text-white/70">
                Access source, dataset, and documentation. Contributions and feedback
                from researchers and practitioners are welcome.
              </p>
            </div>

            <div className="md:col-span-5 grid gap-3">
              <ResourceLink
                icon={<Github className="h-4 w-4" />}
                title="GitHub Repository"
                sub="source · models · evaluation"
              />
              <ResourceLink
                icon={<Database className="h-4 w-4" />}
                title="Kaggle Dataset"
                sub="curated Taglish image-text pairs"
              />
              <ResourceLink
                icon={<FileText className="h-4 w-4" />}
                title="Manuscript (PDF)"
                sub="full thesis document"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
