-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "game_id" INTEGER NOT NULL,
    "sport_id" INTEGER NOT NULL,
    "opponent_id" INTEGER NOT NULL,
    "opponent_name" TEXT NOT NULL,
    "opponent_logo_url" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_updates" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sport_id" INTEGER NOT NULL,

    CONSTRAINT "game_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_game_id_key" ON "games"("game_id");

