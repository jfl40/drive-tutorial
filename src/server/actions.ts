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
    return { error: "Unauthorized" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );
  if (!file) {
    return { error: "File not found" };
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
    return { error: "Unauthorized" };
  }

  const foldersForDeletion = [folderId]; // Need to add the start folder itself
  const filesForDeletion = [];
  const queue = [folderId];

  while (queue.length) {
    const currentId = queue.shift()!;

    const folders = await db
      .select({ id: folders_table.id })
      .from(folders_table)
      .where(eq(folders_table.parent, currentId));

    const files = await db
      .select({ id: files_table.id, url: files_table.url })
      .from(files_table)
      .where(
        and(
          eq(files_table.parent, currentId),
          eq(files_table.ownerId, session.userId),
        ),
      );

    foldersForDeletion.push(...folders.map((folder) => folder.id));
    filesForDeletion.push(...files);

    queue.push(...folders.map((folder) => folder.id));
  }

  const utapiResult = await utApi.deleteFiles(
    filesForDeletion.map((file) =>
      file.url.replace("https://y4zkq9empn.ufs.sh/f/", ""),
    ),
  );
  console.log(utapiResult);

  const dbDeleteResult = await db
    .delete(folders_table)
    .where(inArray(folders_table.id, foldersForDeletion));
  console.log(dbDeleteResult);

  const dbDeleteFilesResult = await db.delete(files_table).where(
    inArray(
      files_table.id,
      filesForDeletion.map((file) => file.id),
    ),
  );
  console.log(dbDeleteFilesResult);

  const c = await cookies();

  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
