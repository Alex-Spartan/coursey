import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async (req: Request) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
};

const onUploadComplete = async ({ metadata, file }: {
  metadata: { userId: string };
  file: { url: string, name: string };
}) => {
  console.log("metadata", metadata);
  return { uploadedBy: metadata.userId, url: file.url, name: file.name };
}

export const ourFileRouter = {
  courseImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      return handleAuth(req);
    })
    .onUploadComplete(onUploadComplete),

  courseAttachment: f(["text", "pdf", "image", "audio", "video"])
    .middleware(async ({ req }) => handleAuth(req))
    .onUploadComplete(onUploadComplete),

  chapterVideo: f({
    video: { maxFileCount: 1, maxFileSize: "4GB" },
  })
    .middleware(async ({ req }) => handleAuth(req))
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;