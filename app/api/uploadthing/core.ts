import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const upload = createUploadthing();

export const ourFileRouter = {
  applicationDocument: upload({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("You must be signed in to upload documents.");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => ({
      userId: metadata.userId,
      url: file.ufsUrl,
      key: file.key,
      name: file.name,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
