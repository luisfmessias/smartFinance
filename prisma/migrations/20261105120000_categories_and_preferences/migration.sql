-- AlterEnum
ALTER TYPE "ExpenseCategory" ADD VALUE 'groceries';
ALTER TYPE "ExpenseCategory" ADD VALUE 'bills';
ALTER TYPE "ExpenseCategory" ADD VALUE 'beauty';
ALTER TYPE "ExpenseCategory" ADD VALUE 'clothing';
ALTER TYPE "ExpenseCategory" ADD VALUE 'subscriptions';
ALTER TYPE "ExpenseCategory" ADD VALUE 'travel';
ALTER TYPE "ExpenseCategory" ADD VALUE 'pets';
ALTER TYPE "ExpenseCategory" ADD VALUE 'gifts';

-- AlterTable
ALTER TABLE "user_preferences"
  ADD COLUMN "hideValues" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "reduceMotion" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "alertThreshold" INTEGER NOT NULL DEFAULT 80,
  ADD COLUMN "startScreen" TEXT NOT NULL DEFAULT 'home',
  ADD COLUMN "defaultCategory" "ExpenseCategory" NOT NULL DEFAULT 'food';
