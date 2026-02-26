"use client";

import { use } from "react";
import ThreadDetail from "@/components/ThreadDetail";

export default function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  return <ThreadDetail threadId={threadId} />;
}
