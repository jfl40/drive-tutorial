"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { success: false, error: "Unauthorized" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    )
    .limit(1);
  if (!file) {
    return { success: false, error: "File not found" };
  }

  const utapiResult = await utApi.deleteFiles([
    file.url.replace("https://y4zkq9empn.ufs.sh/f/", ""),
  ]);

  console.log(utapiResult);

  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  console.log(dbDeleteResult);

  const c = await cookies();

  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { success: false, error: "Unauthorized" };
  }

  const foldersForDeletion = [folderId]; // Need to add the start folder itself
  const filesForDeletion = [];
  const queue = [folderId];

  while (queue.length) {
    const currentId = queue.shift()!;

    const [folders, files] = await Promise.all([
      db
        .select({ id: folders_table.id })
        .from(folders_table)
        .where(eq(folders_table.parent, currentId)),

      db
        .select({ id: files_table.id, url: files_table.url })
        .from(files_table)
        .where(
          and(
            eq(files_table.parent, currentId),
            eq(files_table.ownerId, session.userId),
          ),
        ),
    ]);

    foldersForDeletion.push(...folders.map((folder) => folder.id));
    filesForDeletion.push(...files);

    queue.push(...folders.map((folder) => folder.id));
  }

  try {
    const [utapiResult, dbDeleteResult, dbDeleteFilesResult] =
      await Promise.all([
        utApi.deleteFiles(
          filesForDeletion.map((file) =>
            file.url.replace("https://y4zkq9empn.ufs.sh/f/", ""),
          ),
        ),

        db
          .delete(folders_table)
          .where(inArray(folders_table.id, foldersForDeletion)),

        db.delete(files_table).where(
          inArray(
            files_table.id,
            filesForDeletion.map((file) => file.id),
          ),
        ),
      ]);

    console.log(utapiResult);
    console.log(dbDeleteResult);
    console.log(dbDeleteFilesResult);
  } catch (error) {
    console.error("Error occurred during the deletion process:", error);
    return {
      success: false,
      error: "Error occurred during the deletion process",
    };
  }

  const c = await cookies();

  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function createFolder(folderName: string, parentId: number) {
  const session = await auth();
  if (!session.userId) {
    return { success: false, error: "Unauthorized" };
  }

  const dbAddResult = await db.insert(folders_table).values({
    name: folderName,
    ownerId: session.userId,
    parent: parentId,
  });

  console.log(dbAddResult);
  const c = await cookies();

  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
