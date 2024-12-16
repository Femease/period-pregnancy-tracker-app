-- CreateTable
CREATE TABLE "CycleInsights" (
    "id" SERIAL NOT NULL,
    "currentDay" INTEGER NOT NULL,
    "phase" TEXT NOT NULL,
    "predictedNextPeriod" TIMESTAMP(3) NOT NULL,
    "dailyRecommendations" TEXT[],

    CONSTRAINT "CycleInsights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodPattern" (
    "id" SERIAL NOT NULL,
    "cycleInsightsId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mood" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,

    CONSTRAINT "MoodPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyLevel" (
    "id" SERIAL NOT NULL,
    "cycleInsightsId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "EnergyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CycleMetrics" (
    "id" SERIAL NOT NULL,
    "cycleInsightsId" INTEGER NOT NULL,
    "averageCycle" DOUBLE PRECISION NOT NULL,
    "regularity" TEXT NOT NULL,

    CONSTRAINT "CycleMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignificantChange" (
    "id" SERIAL NOT NULL,
    "cycleMetricsId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignificantChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CycleMetrics_cycleInsightsId_key" ON "CycleMetrics"("cycleInsightsId");

-- AddForeignKey
ALTER TABLE "MoodPattern" ADD CONSTRAINT "MoodPattern_cycleInsightsId_fkey" FOREIGN KEY ("cycleInsightsId") REFERENCES "CycleInsights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyLevel" ADD CONSTRAINT "EnergyLevel_cycleInsightsId_fkey" FOREIGN KEY ("cycleInsightsId") REFERENCES "CycleInsights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleMetrics" ADD CONSTRAINT "CycleMetrics_cycleInsightsId_fkey" FOREIGN KEY ("cycleInsightsId") REFERENCES "CycleInsights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignificantChange" ADD CONSTRAINT "SignificantChange_cycleMetricsId_fkey" FOREIGN KEY ("cycleMetricsId") REFERENCES "CycleMetrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
