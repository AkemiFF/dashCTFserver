"use client"

import type { ContentItem as ContentItemType } from "@/types/course"
import { TextContentItem } from "./text-content-item"
import { Button } from "@/components/ui/button"

interface ContentItemProps {
  item: ContentItemType
}

export function ContentItem({ item }: ContentItemProps) {
  if (!item) {
    console.error("Content item is undefined")
    return null
  }

  switch (item.type) {
    case "text":
      return <TextContentItem content={item.content || ""} />

    case "image":
      return (
        <div className={`my-4 flex justify-${item.position || "center"}`}>
          <img src={item.url || "/placeholder.svg"} alt="Module content" className="rounded-lg max-h-[400px]" />
        </div>
      )

    case "video":
      if (item.platform === "youtube") {
        return (
          <div className="my-4 aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${item.url}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        )
      } else {
        return (
          <div className="my-4">
            <video controls className="w-full rounded-lg">
              <source src={item.url} type="video/mp4" />
              Votre navigateur ne prend pas en charge la lecture de vidéos.
            </video>
          </div>
        )
      }

    case "file":
      return (
        <div className="my-4 p-4 border border-white/10 rounded-lg bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 2v7h7M16 13H8M16 17H8M10 9H8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium">{item.filename}</p>
              <p className="text-sm text-white/60">{item.description}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
            Télécharger
          </Button>
        </div>
      )

    case "link":
      return (
        <div className="my-4">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline flex items-center gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {item.description || item.url}
          </a>
        </div>
      )

    default:
      return null
  }
}

