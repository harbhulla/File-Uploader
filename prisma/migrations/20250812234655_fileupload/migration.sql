/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."File_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_path_key" ON "public"."File"("path");
