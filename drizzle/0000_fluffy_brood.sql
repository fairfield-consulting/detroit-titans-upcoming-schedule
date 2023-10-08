CREATE TABLE IF NOT EXISTS "game_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"sport_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"game_id" integer NOT NULL,
	"sport_id" integer NOT NULL,
	"opponent_id" integer NOT NULL,
	"opponent_name" text NOT NULL,
	"opponent_logo_url" text,
	"date" date NOT NULL,
	"time" text,
	CONSTRAINT "games_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "game_id_idx" ON "games" ("game_id");