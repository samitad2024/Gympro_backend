CREATE TABLE "owners" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(120) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "owners_email_unique" UNIQUE("email")
);
