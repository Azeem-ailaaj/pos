-- Add permissions to User table if not exists
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "permissions" JSONB[] DEFAULT '{}';

-- Create Location table
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "wh_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "stn" TEXT NOT NULL,
    "ntn" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Location_wh_id_key" UNIQUE ("wh_id"),
    CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
