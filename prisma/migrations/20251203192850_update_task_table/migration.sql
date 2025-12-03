-- DropIndex
DROP INDEX "Task_title_key";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
