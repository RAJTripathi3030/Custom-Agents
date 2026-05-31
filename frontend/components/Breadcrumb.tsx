import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className="flex items-center gap-1 flex-wrap"
        style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}
      >
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden="true" style={{ color: "var(--color-text-muted)" }}>
                &rsaquo;
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:underline transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
