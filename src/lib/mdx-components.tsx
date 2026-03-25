import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

// Componentes estilizados para el contenido MDX.
// Se pasan como prop `components` a <MDXRemote />.
// No requiere @tailwindcss/typography.

export const mdxComponents = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-10 mb-4 text-[22px] font-extrabold leading-tight text-[#0b1b3b] sm:text-[24px]"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-6 mb-3 text-[18px] font-bold text-[#0b1b3b] sm:text-[19px]"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className="mt-4 mb-2 text-[16px] font-bold text-[#0b1b3b]"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p
      className="mb-5 text-[16px] leading-[175%] text-slate-700 sm:text-[17px]"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="mb-5 list-disc space-y-2 pl-6 text-[16px] leading-[175%] text-slate-700 sm:text-[17px]"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mb-5 list-decimal space-y-2 pl-6 text-[16px] leading-[175%] text-slate-700 sm:text-[17px]"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className="pl-1 text-slate-700" {...props}>
      {children}
    </li>
  ),
  a: ({ href = "#", children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="font-semibold text-[#1b2b5a] underline decoration-[#1b2b5a]/40 underline-offset-2 hover:decoration-[#1b2b5a]"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#1b2b5a] underline decoration-[#1b2b5a]/40 underline-offset-2 hover:decoration-[#1b2b5a]"
        {...props}
      >
        {children}
      </a>
    );
  },
  strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-bold text-[#0b1b3b]" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: ComponentPropsWithoutRef<"em">) => (
    <em className="italic text-slate-600" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-4 border-[#0b1b3b] bg-[#eef2fb] py-3 pl-5 pr-4 text-[16px] italic text-slate-600 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-slate-200" />,
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
      <table
        className="w-full min-w-[280px] border-collapse text-left text-[15px] text-slate-700"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-slate-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-slate-200 px-4 py-3 font-semibold text-[#0b1b3b]"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td
      className="border-b border-slate-100 px-4 py-3 last:border-0"
      {...props}
    >
      {children}
    </td>
  ),
};
