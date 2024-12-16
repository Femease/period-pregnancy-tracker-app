/*
  Warnings:

  - The primary key for the `CycleInsights` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CycleMetrics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `EnergyLevel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MoodPattern` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SignificantChange` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `baby_growths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `developments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `expected_changes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `fruit_comparisons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mother_growths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `nutritions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `period_trackers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `periods` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sizes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `symptoms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `weekly_contents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `weight_gains` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CycleMetrics" DROP CONSTRAINT "CycleMetrics_cycleInsightsId_fkey";

-- DropForeignKey
ALTER TABLE "EnergyLevel" DROP CONSTRAINT "EnergyLevel_cycleInsightsId_fkey";

-- DropForeignKey
ALTER TABLE "MoodPattern" DROP CONSTRAINT "MoodPattern_cycleInsightsId_fkey";

-- DropForeignKey
ALTER TABLE "SignificantChange" DROP CONSTRAINT "SignificantChange_cycleMetricsId_fkey";

-- DropForeignKey
ALTER TABLE "baby_growths" DROP CONSTRAINT "baby_growths_weekly_content_id_fkey";

-- DropForeignKey
ALTER TABLE "developments" DROP CONSTRAINT "developments_baby_growth_id_fkey";

-- DropForeignKey
ALTER TABLE "expected_changes" DROP CONSTRAINT "expected_changes_mother_growth_id_fkey";

-- DropForeignKey
ALTER TABLE "fruit_comparisons" DROP CONSTRAINT "fruit_comparisons_baby_growth_id_fkey";

-- DropForeignKey
ALTER TABLE "mother_growths" DROP CONSTRAINT "mother_growths_weekly_content_id_fkey";

-- DropForeignKey
ALTER TABLE "nutritions" DROP CONSTRAINT "nutritions_mother_growth_id_fkey";

-- DropForeignKey
ALTER TABLE "period_trackers" DROP CONSTRAINT "period_trackers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "periods" DROP CONSTRAINT "periods_period_tracker_id_fkey";

-- DropForeignKey
ALTER TABLE "sizes" DROP CONSTRAINT "sizes_baby_growth_id_fkey";

-- DropForeignKey
ALTER TABLE "symptoms" DROP CONSTRAINT "symptoms_period_tracker_id_fkey";

-- DropForeignKey
ALTER TABLE "weight_gains" DROP CONSTRAINT "weight_gains_mother_growth_id_fkey";

-- AlterTable
ALTER TABLE "CycleInsights" DROP CONSTRAINT "CycleInsights_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CycleInsights_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CycleInsights_id_seq";

-- AlterTable
ALTER TABLE "CycleMetrics" DROP CONSTRAINT "CycleMetrics_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cycleInsightsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CycleMetrics_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CycleMetrics_id_seq";

-- AlterTable
ALTER TABLE "EnergyLevel" DROP CONSTRAINT "EnergyLevel_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cycleInsightsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "EnergyLevel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EnergyLevel_id_seq";

-- AlterTable
ALTER TABLE "MoodPattern" DROP CONSTRAINT "MoodPattern_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cycleInsightsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MoodPattern_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MoodPattern_id_seq";

-- AlterTable
ALTER TABLE "SignificantChange" DROP CONSTRAINT "SignificantChange_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cycleMetricsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SignificantChange_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SignificantChange_id_seq";

-- AlterTable
ALTER TABLE "baby_growths" DROP CONSTRAINT "baby_growths_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "weekly_content_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "baby_growths_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "baby_growths_id_seq";

-- AlterTable
ALTER TABLE "developments" DROP CONSTRAINT "developments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "baby_growth_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "developments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "developments_id_seq";

-- AlterTable
ALTER TABLE "expected_changes" DROP CONSTRAINT "expected_changes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "mother_growth_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "expected_changes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "expected_changes_id_seq";

-- AlterTable
ALTER TABLE "fruit_comparisons" DROP CONSTRAINT "fruit_comparisons_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "baby_growth_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "fruit_comparisons_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "fruit_comparisons_id_seq";

-- AlterTable
ALTER TABLE "mother_growths" DROP CONSTRAINT "mother_growths_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "weekly_content_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "mother_growths_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "mother_growths_id_seq";

-- AlterTable
ALTER TABLE "nutritions" DROP CONSTRAINT "nutritions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "mother_growth_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "nutritions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "nutritions_id_seq";

-- AlterTable
ALTER TABLE "period_trackers" DROP CONSTRAINT "period_trackers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "period_trackers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "period_trackers_id_seq";

-- AlterTable
ALTER TABLE "periods" DROP CONSTRAINT "periods_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "period_tracker_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "periods_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "periods_id_seq";

-- AlterTable
ALTER TABLE "sizes" DROP CONSTRAINT "sizes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "baby_growth_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sizes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sizes_id_seq";

-- AlterTable
ALTER TABLE "symptoms" DROP CONSTRAINT "symptoms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "period_tracker_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "symptoms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "symptoms_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AlterTable
ALTER TABLE "weekly_contents" DROP CONSTRAINT "weekly_contents_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "weekly_contents_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "weekly_contents_id_seq";

-- AlterTable
ALTER TABLE "weight_gains" DROP CONSTRAINT "weight_gains_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "mother_growth_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "weight_gains_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "weight_gains_id_seq";

-- AddForeignKey
ALTER TABLE "period_trackers" ADD CONSTRAINT "period_trackers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_period_tracker_id_fkey" FOREIGN KEY ("period_tracker_id") REFERENCES "period_trackers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symptoms" ADD CONSTRAINT "symptoms_period_tracker_id_fkey" FOREIGN KEY ("period_tracker_id") REFERENCES "period_trackers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baby_growths" ADD CONSTRAINT "baby_growths_weekly_content_id_fkey" FOREIGN KEY ("weekly_content_id") REFERENCES "weekly_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_baby_growth_id_fkey" FOREIGN KEY ("baby_growth_id") REFERENCES "baby_growths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developments" ADD CONSTRAINT "developments_baby_growth_id_fkey" FOREIGN KEY ("baby_growth_id") REFERENCES "baby_growths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fruit_comparisons" ADD CONSTRAINT "fruit_comparisons_baby_growth_id_fkey" FOREIGN KEY ("baby_growth_id") REFERENCES "baby_growths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mother_growths" ADD CONSTRAINT "mother_growths_weekly_content_id_fkey" FOREIGN KEY ("weekly_content_id") REFERENCES "weekly_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expected_changes" ADD CONSTRAINT "expected_changes_mother_growth_id_fkey" FOREIGN KEY ("mother_growth_id") REFERENCES "mother_growths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weight_gains" ADD CONSTRAINT "weight_gains_mother_growth_id_fkey" FOREIGN KEY ("mother_growth_id") REFERENCES "mother_growths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritions" ADD CONSTRAINT "nutritions_mother_growth_id_fkey" FOREIGN KEY ("mother_growth_id") REFERENCES "mother_growths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodPattern" ADD CONSTRAINT "MoodPattern_cycleInsightsId_fkey" FOREIGN KEY ("cycleInsightsId") REFERENCES "CycleInsights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyLevel" ADD CONSTRAINT "EnergyLevel_cycleInsightsId_fkey" FOREIGN KEY ("cycleInsightsId") REFERENCES "CycleInsights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleMetrics" ADD CONSTRAINT "CycleMetrics_cycleInsightsId_fkey" FOREIGN KEY ("cycleInsightsId") REFERENCES "CycleInsights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignificantChange" ADD CONSTRAINT "SignificantChange_cycleMetricsId_fkey" FOREIGN KEY ("cycleMetricsId") REFERENCES "CycleMetrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
