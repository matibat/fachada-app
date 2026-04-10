import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    coverImage: z.string(),
    roles: z.array(z.string()).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  projects,
  blog,
};
