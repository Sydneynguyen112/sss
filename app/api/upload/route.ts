import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Client-upload flow: client gọi route này để xin signed URL, rồi upload thẳng lên Blob.
// Bypass Vercel function body limit (~4.5MB) — cho phép upload video lớn.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Whitelist pathname prefix + content type
        if (!pathname.startsWith("tennis/") && !pathname.startsWith("meal-")) {
          throw new Error("Pathname không hợp lệ");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "video/webm"],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Không cần callback — client tự lưu URL vào localStorage
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
