-- CreateTable
CREATE TABLE "period_trackers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "period_trackers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periods" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "period_tracker_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptoms" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "period_tracker_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_contents" (
    "id" SERIAL NOT NULL,
    "week" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "weekly_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baby_growths" (
    "id" SERIAL NOT NULL,
    "weekly_content_id" INTEGER NOT NULL,

    CONSTRAINT "baby_growths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" SERIAL NOT NULL,
    "baby_growth_id" INTEGER NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developments" (
    "id" SERIAL NOT NULL,
    "baby_growth_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "milestones" TEXT[],

    CONSTRAINT "developments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fruit_comparisons" (
    "id" SERIAL NOT NULL,
    "baby_growth_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "fruit_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mother_growths" (
    "id" SERIAL NOT NULL,
    "weekly_content_id" INTEGER NOT NULL,

    CONSTRAINT "mother_growths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expected_changes" (
    "id" SERIAL NOT NULL,
    "mother_growth_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "symptoms" TEXT[],
    "recommendations" TEXT[],

    CONSTRAINT "expected_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weight_gains" (
    "id" SERIAL NOT NULL,
    "mother_growth_id" INTEGER NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "weight_gains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutritions" (
    "id" SERIAL NOT NULL,
    "mother_growth_id" INTEGER NOT NULL,
    "requirements" TEXT[],
    "foods" TEXT[],
    "supplements" TEXT[],

    CONSTRAINT "nutritions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "period_trackers_user_id_key" ON "period_trackers"("user_id");

-- CreateIndex
CREATE INDEX "period_trackers_user_id_idx" ON "period_trackers"("user_id");

-- CreateIndex
CREATE INDEX "periods_period_tracker_id_idx" ON "periods"("period_tracker_id");

-- CreateIndex
CREATE INDEX "symptoms_period_tracker_id_idx" ON "symptoms"("period_tracker_id");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_contents_week_key" ON "weekly_contents"("week");

-- CreateIndex
CREATE INDEX "weekly_contents_week_idx" ON "weekly_contents"("week");

-- CreateIndex
CREATE INDEX "weekly_contents_isPublished_idx" ON "weekly_contents"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "baby_growths_weekly_content_id_key" ON "baby_growths"("weekly_content_id");

-- CreateIndex
CREATE INDEX "baby_growths_weekly_content_id_idx" ON "baby_growths"("weekly_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_baby_growth_id_key" ON "sizes"("baby_growth_id");

-- CreateIndex
CREATE INDEX "sizes_baby_growth_id_idx" ON "sizes"("baby_growth_id");

-- CreateIndex
CREATE UNIQUE INDEX "developments_baby_growth_id_key" ON "developments"("baby_growth_id");

-- CreateIndex
CREATE INDEX "developments_baby_growth_id_idx" ON "developments"("baby_growth_id");

-- CreateIndex
CREATE UNIQUE INDEX "fruit_comparisons_baby_growth_id_key" ON "fruit_comparisons"("baby_growth_id");

-- CreateIndex
CREATE INDEX "fruit_comparisons_baby_growth_id_idx" ON "fruit_comparisons"("baby_growth_id");

-- CreateIndex
CREATE UNIQUE INDEX "mother_growths_weekly_content_id_key" ON "mother_growths"("weekly_content_id");

-- CreateIndex
CREATE INDEX "mother_growths_weekly_content_id_idx" ON "mother_growths"("weekly_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "expected_changes_mother_growth_id_key" ON "expected_changes"("mother_growth_id");

-- CreateIndex
CREATE INDEX "expected_changes_mother_growth_id_idx" ON "expected_changes"("mother_growth_id");

-- CreateIndex
CREATE UNIQUE INDEX "weight_gains_mother_growth_id_key" ON "weight_gains"("mother_growth_id");

-- CreateIndex
CREATE INDEX "weight_gains_mother_growth_id_idx" ON "weight_gains"("mother_growth_id");

-- CreateIndex
CREATE UNIQUE INDEX "nutritions_mother_growth_id_key" ON "nutritions"("mother_growth_id");

-- CreateIndex
CREATE INDEX "nutritions_mother_growth_id_idx" ON "nutritions"("mother_growth_id");

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
