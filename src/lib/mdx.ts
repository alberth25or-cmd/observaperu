import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ArticleType = "noticias" | "analisis";

export interface ArticleFrontmatter {
  title: string;
  date: string;
  metaDescription: string;
  keywords?: string[];
  author?: string;
  tags?: string[];
  image?: string;
  bajada?: string;
  references?: string[];
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
}

export type ArticleSummary = ArticleFrontmatter & { slug: string };

const contentDir = path.join(process.cwd(), "content");

export function getAllSlugs(type: ArticleType): string[] {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(type: ArticleType, slug: string): Article | null {
  const filePath = path.join(contentDir, type, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as ArticleFrontmatter, content };
}

export function getAllArticles(type: ArticleType): ArticleSummary[] {
  return getAllSlugs(type)
    .map((slug) => {
      const article = getArticleBySlug(type, slug);
      if (!article) return null;
      return { ...article.frontmatter, slug };
    })
    .filter((a): a is ArticleSummary => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
