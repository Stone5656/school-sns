-- DropForeignKey
ALTER TABLE "TagScraps" DROP CONSTRAINT "TagScraps_scrapId_fkey";

-- AddForeignKey
ALTER TABLE "TagScraps" ADD CONSTRAINT "TagScraps_scrapId_fkey" FOREIGN KEY ("scrapId") REFERENCES "Scraps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
