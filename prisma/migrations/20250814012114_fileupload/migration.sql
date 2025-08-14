-- DropForeignKey
ALTER TABLE "public"."Folder" DROP CONSTRAINT "Folder_userEmail_fkey";

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "public"."User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
