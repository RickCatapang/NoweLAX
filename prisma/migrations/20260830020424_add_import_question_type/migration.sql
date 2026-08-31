/*
  Warnings:

  - Added the required column `questionType` to the `import_batch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "import_batch" ADD COLUMN     "questionType" "QuestionType" NOT NULL;
