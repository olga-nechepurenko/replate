-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "posterId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poster" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Poster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poster_eventId_key" ON "Poster"("eventId");

-- AddForeignKey
ALTER TABLE "Poster" ADD CONSTRAINT "Poster_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
