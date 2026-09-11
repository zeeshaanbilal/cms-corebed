"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLatestPosts, Post } from "@/lib/wordpress";

export function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await fetchLatestPosts(3);
        setPosts(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (loading) return null;
  if (!posts || posts.length === 0) return null;

  return (
    <section className="reveal-section py-24 px-6 max-w-[1440px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl text-core-ink mb-4">Latest from the Journal</h2>
        <p className="text-core-muted-foreground">Sleep science, tips, and CoreBed news.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm group-hover:shadow-xl transition-shadow duration-300 bg-white mb-6">
              {post.featuredImage?.node?.sourceUrl ? (
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-[var(--ease-house)]"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center text-core-muted-foreground text-sm">
                  No Image
                </div>
              )}
            </div>
            
            <time className="text-xs font-semibold uppercase tracking-widest text-core-muted-foreground mb-2 block">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </time>
            <h3 className="font-heading text-xl text-core-ink mb-3 group-hover:text-core-accent transition-colors">
              {post.title}
            </h3>
            <div 
              className="text-sm text-core-muted-foreground line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          </Link>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/blog" className="inline-block border border-core-ink px-8 py-3 uppercase tracking-widest text-xs font-bold text-core-ink hover:bg-core-ink hover:text-white hover:scale-105 shadow-sm transition-all duration-300 rounded-md">
          Read the Journal
        </Link>
      </div>
    </section>
  );
}
