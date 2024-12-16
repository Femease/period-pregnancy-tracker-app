/*
  Warnings:

  - You are about to drop the `CycleInsights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CycleMetrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnergyLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MoodPattern` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SignificantChange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CycleMetrics" DROP CONSTRAINT "CycleMetrics_cycleInsightsId_fkey";

-- DropForeignKey
ALTER TABLE "EnergyLevel" DROP CONSTRAINT "EnergyLevel_cycleInsightsId_fkey";

-- DropForeignKey
ALTER TABLE "MoodPattern" DROP CONSTRAINT "MoodPattern_cycleInsightsId_fkey";

-- DropForeignKey
ALTER TABLE "SignificantChange" DROP CONSTRAINT "SignificantChange_cycleMetricsId_fkey";

-- DropTable
DROP TABLE "CycleInsights";

-- DropTable
DROP TABLE "CycleMetrics";

-- DropTable
DROP TABLE "EnergyLevel";

-- DropTable
DROP TABLE "MoodPattern";

-- DropTable
DROP TABLE "SignificantChange";

-- CreateTable
CREATE TABLE "cycle_insights" (
    "id" TEXT NOT NULL,
    "currentDay" INTEGER NOT NULL,
    "phase" TEXT NOT NULL,
    "predictedNextPeriod" TIMESTAMP(3) NOT NULL,
    "dailyRecommendations" TEXT[],

    CONSTRAINT "cycle_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mood_patterns" (
    "id" TEXT NOT NULL,
    "cycle_insights_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mood" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,

    CONSTRAINT "mood_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "energy_levels" (
    "id" TEXT NOT NULL,
    "cycle_insights_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "energy_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycle_metrics" (
    "id" TEXT NOT NULL,
    "cycle_insights_id" TEXT NOT NULL,
    "averageCycle" DOUBLE PRECISION NOT NULL,
    "regularity" TEXT NOT NULL,

    CONSTRAINT "cycle_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "significant_changes" (
    "id" TEXT NOT NULL,
    "cycle_metrics_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "significant_changes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mood_patterns_cycle_insights_id_idx" ON "mood_patterns"("cycle_insights_id");

-- CreateIndex
CREATE INDEX "energy_levels_cycle_insights_id_idx" ON "energy_levels"("cycle_insights_id");

-- CreateIndex
CREATE UNIQUE INDEX "cycle_metrics_cycle_insights_id_key" ON "cycle_metrics"("cycle_insights_id");

-- CreateIndex
CREATE INDEX "cycle_metrics_cycle_insights_id_idx" ON "cycle_metrics"("cycle_insights_id");

-- CreateIndex
CREATE INDEX "significant_changes_cycle_metrics_id_idx" ON "significant_changes"("cycle_metrics_id");

-- AddForeignKey
ALTER TABLE "mood_patterns" ADD CONSTRAINT "mood_patterns_cycle_insights_id_fkey" FOREIGN KEY ("cycle_insights_id") REFERENCES "cycle_insights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_levels" ADD CONSTRAINT "energy_levels_cycle_insights_id_fkey" FOREIGN KEY ("cycle_insights_id") REFERENCES "cycle_insights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_metrics" ADD CONSTRAINT "cycle_metrics_cycle_insights_id_fkey" FOREIGN KEY ("cycle_insights_id") REFERENCES "cycle_insights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "significant_changes" ADD CONSTRAINT "significant_changes_cycle_metrics_id_fkey" FOREIGN KEY ("cycle_metrics_id") REFERENCES "cycle_metrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
