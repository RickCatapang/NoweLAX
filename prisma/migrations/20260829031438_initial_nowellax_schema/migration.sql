-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('EXAMINATION', 'EDUCATIONAL', 'ORGANIZATIONAL', 'GENERAL');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'IDENTIFICATION');

-- CreateEnum
CREATE TYPE "QuestionVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuestionSource" AS ENUM ('MANUAL', 'JSON_IMPORT', 'CSV_IMPORT');

-- CreateEnum
CREATE TYPE "ImportSourceType" AS ENUM ('JSON', 'CSV');

-- CreateEnum
CREATE TYPE "ImportInputMode" AS ENUM ('FILE', 'PASTED_TEXT');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "ImportItemStatus" AS ENUM ('PENDING', 'IMPORTED', 'FAILED');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('EXAM', 'QUIZ');

-- CreateEnum
CREATE TYPE "AssessmentMode" AS ENUM ('FIXED', 'DYNAMIC');

-- CreateEnum
CREATE TYPE "AssessmentVisibility" AS ENUM ('PRIVATE', 'PUBLIC', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'ABANDONED');

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CategoryType" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_subject" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "category_subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "categorySubjectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "visibility" "QuestionVisibility" NOT NULL DEFAULT 'PRIVATE',
    "status" "QuestionStatus" NOT NULL DEFAULT 'DRAFT',
    "allowReuse" BOOLEAN NOT NULL DEFAULT false,
    "source" "QuestionSource" NOT NULL DEFAULT 'MANUAL',
    "importBatchId" TEXT,
    "declaredDifficulty" DOUBLE PRECISION,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "credibilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_version" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL,
    "questionText" TEXT NOT NULL,
    "hint" TEXT,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choice" (
    "id" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_answer" (
    "id" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "question_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_batch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" "ImportSourceType" NOT NULL,
    "inputMode" "ImportInputMode" NOT NULL,
    "fileName" TEXT,
    "sourceText" TEXT,
    "status" "ImportStatus" NOT NULL DEFAULT 'PROCESSING',
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "importedItems" INTEGER NOT NULL DEFAULT 0,
    "failedItems" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "import_batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_batch_item" (
    "id" TEXT NOT NULL,
    "importBatchId" TEXT NOT NULL,
    "rowNumber" INTEGER,
    "status" "ImportItemStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "rawData" JSONB,
    "questionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_batch_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "AssessmentType" NOT NULL,
    "mode" "AssessmentMode" NOT NULL DEFAULT 'FIXED',
    "visibility" "AssessmentVisibility" NOT NULL DEFAULT 'PRIVATE',
    "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "timeLimitSeconds" INTEGER,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_subject" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "categorySubjectId" TEXT NOT NULL,
    "questionCount" INTEGER,

    CONSTRAINT "assessment_subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_selection_rule" (
    "id" TEXT NOT NULL,
    "assessmentSubjectId" TEXT NOT NULL,
    "minRating" DOUBLE PRECISION,
    "minCredibilityScore" DOUBLE PRECISION,
    "minDifficulty" DOUBLE PRECISION,
    "maxDifficulty" DOUBLE PRECISION,
    "publicOnly" BOOLEAN NOT NULL DEFAULT true,
    "reusableOnly" BOOLEAN NOT NULL DEFAULT true,
    "randomize" BOOLEAN NOT NULL DEFAULT true,
    "excludePreviouslyAttempted" BOOLEAN NOT NULL DEFAULT false,
    "historyWindow" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_selection_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_question" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "assessmentSubjectId" TEXT,
    "questionId" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "assessment_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_access" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_share_link" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_share_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "totalPoints" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "durationSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_question" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "assessmentQuestionId" TEXT,
    "assessmentSubjectId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "presentedAt" TIMESTAMP(3),
    "answeredAt" TIMESTAMP(3),
    "timeSpentSeconds" INTEGER,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "isCorrect" BOOLEAN,
    "pointsEarned" DOUBLE PRECISION,

    CONSTRAINT "attempt_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_answer" (
    "id" TEXT NOT NULL,
    "attemptQuestionId" TEXT NOT NULL,
    "selectedChoiceId" TEXT,
    "textAnswer" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attempt_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_rating" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_rating" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_rating" (
    "id" TEXT NOT NULL,
    "raterId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creator_rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subject_name_key" ON "subject"("name");

-- CreateIndex
CREATE INDEX "category_subject_categoryId_idx" ON "category_subject"("categoryId");

-- CreateIndex
CREATE INDEX "category_subject_subjectId_idx" ON "category_subject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "category_subject_categoryId_subjectId_key" ON "category_subject"("categoryId", "subjectId");

-- CreateIndex
CREATE INDEX "question_categorySubjectId_idx" ON "question"("categorySubjectId");

-- CreateIndex
CREATE INDEX "question_createdById_idx" ON "question"("createdById");

-- CreateIndex
CREATE INDEX "question_importBatchId_idx" ON "question"("importBatchId");

-- CreateIndex
CREATE INDEX "question_categorySubjectId_status_visibility_allowReuse_idx" ON "question"("categorySubjectId", "status", "visibility", "allowReuse");

-- CreateIndex
CREATE INDEX "question_categorySubjectId_status_declaredDifficulty_idx" ON "question"("categorySubjectId", "status", "declaredDifficulty");

-- CreateIndex
CREATE INDEX "question_categorySubjectId_status_averageRating_idx" ON "question"("categorySubjectId", "status", "averageRating");

-- CreateIndex
CREATE INDEX "question_categorySubjectId_status_credibilityScore_idx" ON "question"("categorySubjectId", "status", "credibilityScore");

-- CreateIndex
CREATE INDEX "question_version_questionId_idx" ON "question_version"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "question_version_questionId_version_key" ON "question_version"("questionId", "version");

-- CreateIndex
CREATE INDEX "choice_questionVersionId_idx" ON "choice"("questionVersionId");

-- CreateIndex
CREATE INDEX "question_answer_questionVersionId_idx" ON "question_answer"("questionVersionId");

-- CreateIndex
CREATE INDEX "import_batch_userId_idx" ON "import_batch"("userId");

-- CreateIndex
CREATE INDEX "import_batch_status_idx" ON "import_batch"("status");

-- CreateIndex
CREATE INDEX "import_batch_sourceType_idx" ON "import_batch"("sourceType");

-- CreateIndex
CREATE INDEX "import_batch_inputMode_idx" ON "import_batch"("inputMode");

-- CreateIndex
CREATE INDEX "import_batch_item_importBatchId_idx" ON "import_batch_item"("importBatchId");

-- CreateIndex
CREATE INDEX "import_batch_item_status_idx" ON "import_batch_item"("status");

-- CreateIndex
CREATE INDEX "import_batch_item_questionId_idx" ON "import_batch_item"("questionId");

-- CreateIndex
CREATE INDEX "assessment_createdById_idx" ON "assessment"("createdById");

-- CreateIndex
CREATE INDEX "assessment_status_visibility_idx" ON "assessment"("status", "visibility");

-- CreateIndex
CREATE INDEX "assessment_createdById_status_idx" ON "assessment"("createdById", "status");

-- CreateIndex
CREATE INDEX "assessment_subject_assessmentId_idx" ON "assessment_subject"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_subject_categorySubjectId_idx" ON "assessment_subject"("categorySubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_subject_assessmentId_categorySubjectId_key" ON "assessment_subject"("assessmentId", "categorySubjectId");

-- CreateIndex
CREATE INDEX "assessment_selection_rule_assessmentSubjectId_idx" ON "assessment_selection_rule"("assessmentSubjectId");

-- CreateIndex
CREATE INDEX "assessment_question_assessmentId_idx" ON "assessment_question"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_question_assessmentSubjectId_idx" ON "assessment_question"("assessmentSubjectId");

-- CreateIndex
CREATE INDEX "assessment_question_questionId_idx" ON "assessment_question"("questionId");

-- CreateIndex
CREATE INDEX "assessment_question_questionVersionId_idx" ON "assessment_question"("questionVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_question_assessmentId_questionId_key" ON "assessment_question"("assessmentId", "questionId");

-- CreateIndex
CREATE INDEX "assessment_access_assessmentId_idx" ON "assessment_access"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_access_userId_idx" ON "assessment_access"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_access_assessmentId_userId_key" ON "assessment_access"("assessmentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_share_link_token_key" ON "assessment_share_link"("token");

-- CreateIndex
CREATE INDEX "assessment_share_link_assessmentId_idx" ON "assessment_share_link"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_share_link_active_idx" ON "assessment_share_link"("active");

-- CreateIndex
CREATE INDEX "attempt_assessmentId_idx" ON "attempt"("assessmentId");

-- CreateIndex
CREATE INDEX "attempt_userId_idx" ON "attempt"("userId");

-- CreateIndex
CREATE INDEX "attempt_userId_assessmentId_idx" ON "attempt"("userId", "assessmentId");

-- CreateIndex
CREATE INDEX "attempt_status_idx" ON "attempt"("status");

-- CreateIndex
CREATE INDEX "attempt_question_attemptId_idx" ON "attempt_question"("attemptId");

-- CreateIndex
CREATE INDEX "attempt_question_questionId_idx" ON "attempt_question"("questionId");

-- CreateIndex
CREATE INDEX "attempt_question_questionVersionId_idx" ON "attempt_question"("questionVersionId");

-- CreateIndex
CREATE INDEX "attempt_question_assessmentQuestionId_idx" ON "attempt_question"("assessmentQuestionId");

-- CreateIndex
CREATE INDEX "attempt_question_assessmentSubjectId_idx" ON "attempt_question"("assessmentSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_question_attemptId_sortOrder_key" ON "attempt_question"("attemptId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_answer_attemptQuestionId_key" ON "attempt_answer"("attemptQuestionId");

-- CreateIndex
CREATE INDEX "attempt_answer_selectedChoiceId_idx" ON "attempt_answer"("selectedChoiceId");

-- CreateIndex
CREATE INDEX "question_rating_questionId_idx" ON "question_rating"("questionId");

-- CreateIndex
CREATE INDEX "question_rating_userId_idx" ON "question_rating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "question_rating_questionId_userId_key" ON "question_rating"("questionId", "userId");

-- CreateIndex
CREATE INDEX "assessment_rating_assessmentId_idx" ON "assessment_rating"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_rating_userId_idx" ON "assessment_rating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_rating_assessmentId_userId_key" ON "assessment_rating"("assessmentId", "userId");

-- CreateIndex
CREATE INDEX "creator_rating_raterId_idx" ON "creator_rating"("raterId");

-- CreateIndex
CREATE INDEX "creator_rating_creatorId_idx" ON "creator_rating"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "creator_rating_raterId_creatorId_key" ON "creator_rating"("raterId", "creatorId");

-- AddForeignKey
ALTER TABLE "category_subject" ADD CONSTRAINT "category_subject_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_subject" ADD CONSTRAINT "category_subject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_categorySubjectId_fkey" FOREIGN KEY ("categorySubjectId") REFERENCES "category_subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "import_batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_version" ADD CONSTRAINT "question_version_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choice" ADD CONSTRAINT "choice_questionVersionId_fkey" FOREIGN KEY ("questionVersionId") REFERENCES "question_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_answer" ADD CONSTRAINT "question_answer_questionVersionId_fkey" FOREIGN KEY ("questionVersionId") REFERENCES "question_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch" ADD CONSTRAINT "import_batch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch_item" ADD CONSTRAINT "import_batch_item_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "import_batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch_item" ADD CONSTRAINT "import_batch_item_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_subject" ADD CONSTRAINT "assessment_subject_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_subject" ADD CONSTRAINT "assessment_subject_categorySubjectId_fkey" FOREIGN KEY ("categorySubjectId") REFERENCES "category_subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_selection_rule" ADD CONSTRAINT "assessment_selection_rule_assessmentSubjectId_fkey" FOREIGN KEY ("assessmentSubjectId") REFERENCES "assessment_subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_question" ADD CONSTRAINT "assessment_question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_question" ADD CONSTRAINT "assessment_question_assessmentSubjectId_fkey" FOREIGN KEY ("assessmentSubjectId") REFERENCES "assessment_subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_question" ADD CONSTRAINT "assessment_question_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_question" ADD CONSTRAINT "assessment_question_questionVersionId_fkey" FOREIGN KEY ("questionVersionId") REFERENCES "question_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_access" ADD CONSTRAINT "assessment_access_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_access" ADD CONSTRAINT "assessment_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_share_link" ADD CONSTRAINT "assessment_share_link_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_questionVersionId_fkey" FOREIGN KEY ("questionVersionId") REFERENCES "question_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_assessmentQuestionId_fkey" FOREIGN KEY ("assessmentQuestionId") REFERENCES "assessment_question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_assessmentSubjectId_fkey" FOREIGN KEY ("assessmentSubjectId") REFERENCES "assessment_subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_attemptQuestionId_fkey" FOREIGN KEY ("attemptQuestionId") REFERENCES "attempt_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_selectedChoiceId_fkey" FOREIGN KEY ("selectedChoiceId") REFERENCES "choice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_rating" ADD CONSTRAINT "question_rating_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_rating" ADD CONSTRAINT "question_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_rating" ADD CONSTRAINT "assessment_rating_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_rating" ADD CONSTRAINT "assessment_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creator_rating" ADD CONSTRAINT "creator_rating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creator_rating" ADD CONSTRAINT "creator_rating_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
