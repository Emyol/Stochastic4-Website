import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface ResourceLinkProps {
  icon: ReactNode;
  title: string;
  sub: string;
  href?: string;
}

export default function ResourceLink({ icon, title, sub, href = '#' }: ResourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-4 transition-all duration-300 hover:border-[#4ea7e0]/60 hover:bg-white/10"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[#4ea7e0]">
          {icon}
        </span>
        <div>
          <p className="font-medium text-white">{title}</p>
          <p className="text-xs text-white/50">{sub}</p>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-white/50 transition-all duration-300 group-hover:text-white group-hover:rotate-45" />
    </a>
  );
}
