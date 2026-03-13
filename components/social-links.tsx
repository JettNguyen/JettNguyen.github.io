import Image from "next/image";
import { socialLinks } from "@/data/social-links";
import { SectionReveal } from "@/components/section-reveal";

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {socialLinks.map((item, index) => (
        <SectionReveal key={item.label} variant="item" delay={index * 0.035}>
          <a
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-accent hover:text-accent-soft"
          >
            <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-line/80 bg-panel/70 text-muted">
              <SocialIcon label={item.label} />
            </span>
            {item.label}
          </a>
        </SectionReveal>
      ))}
    </div>
  );
}

function SocialIcon({ label }: { label: string }) {
  if (label === "GitHub") {
    return <Image src="/assets/github.png" alt="GitHub" fill sizes="20px" className="object-cover" />;
  }

  if (label === "Depop") {
    return <Image src="/assets/depop.png" alt="Depop" fill sizes="20px" className="object-cover" />;
  }

  if (label === "Mercari") {
    return <Image src="/assets/mercari.jpeg" alt="Mercari" fill sizes="20px" className="object-cover" />;
  }

  if (label === "Jett2Fly") {
    return <Image src="/assets/jett2fly.png" alt="Jett2Fly" fill sizes="20px" className="object-cover" />;
  }

  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6.86 7.02a1.93 1.93 0 1 1 0-3.86 1.93 1.93 0 0 1 0 3.86ZM5.2 8.8h3.3V19.2H5.2V8.8Zm5.22 0h3.16v1.42h.05c.44-.83 1.52-1.7 3.12-1.7 3.33 0 3.95 2.19 3.95 5.04v5.64h-3.3v-5c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.92 1.3-1.92 2.65v5.09h-3.4V8.8Z"
        />
      </svg>
    );
  }

  if (label === "Email") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2 .13 6.48 4.69a.9.9 0 0 0 1.04 0L19 6.88v-.13a.75.75 0 0 0-.75-.75H5.75a.75.75 0 0 0-.75.75v.13Zm14 2.46-5.3 3.83a2.9 2.9 0 0 1-3.4 0L5 9.34v7.91c0 .41.34.75.75.75h12.5c.41 0 .75-.34.75-.75V9.34Z"
        />
      </svg>
    );
  }

  if (label === "Production Portfolio") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 2a6.5 6.5 0 0 1 5.6 3.2 8.5 8.5 0 0 0-3.6-.8 8.5 8.5 0 0 0-6.9 3.5A6.5 6.5 0 0 1 12 5.5Zm-5.9 7.1A6.5 6.5 0 0 1 12 7.5c1.5 0 2.9.5 4 1.3a8.5 8.5 0 0 0-5.7 7.3 6.5 6.5 0 0 1-4.2-3.5Zm6.3 5.9a6.5 6.5 0 0 1-2.1-.4 6.5 6.5 0 0 1 8.2-5.1 6.5 6.5 0 0 1-6.1 5.5Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <path fill="currentColor" d="M12 3.5 4 7.6v8.8l8 4.1 8-4.1V7.6l-8-4.1Zm0 2.2 5.75 2.95L12 11.6 6.25 8.65 12 5.7Zm-6 4.7 5 2.56v5.5l-5-2.56v-5.5Zm7 8.06v-5.5l5-2.56v5.5l-5 2.56Z" />
    </svg>
  );
}
