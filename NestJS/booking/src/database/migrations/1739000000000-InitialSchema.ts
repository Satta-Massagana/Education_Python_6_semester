import { MigrationInterface, QueryRunner } from 'typeorm';

/** Начальная миграция: таблицы users, workshops, bookings. */
export class InitialSchema1739000000000 implements MigrationInterface {
  name = 'InitialSchema1739000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "username" character varying(150) NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying(10) NOT NULL DEFAULT 'user',
        "first_name" character varying(150),
        "last_name" character varying(150),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "workshops" (
        "id" SERIAL NOT NULL,
        "title" character varying(200) NOT NULL,
        "description" text NOT NULL,
        "date" TIMESTAMP WITH TIME ZONE NOT NULL,
        "capacity" integer NOT NULL,
        "created_by_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workshops" PRIMARY KEY ("id"),
        CONSTRAINT "FK_workshops_created_by" FOREIGN KEY ("created_by_id")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "workshop_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "unique_user_workshop_booking" UNIQUE ("user_id", "workshop_id"),
        CONSTRAINT "FK_bookings_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_bookings_workshop" FOREIGN KEY ("workshop_id")
          REFERENCES "workshops"("id") ON DELETE CASCADE
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "workshops"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
