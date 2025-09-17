-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "riskScore" INTEGER,
ADD COLUMN     "threatLevel" TEXT;

-- CreateTable
CREATE TABLE "user_behavior_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avgLoginTime" DOUBLE PRECISION NOT NULL,
    "commonLocations" TEXT[],
    "typicalDevices" TEXT[],
    "riskScore" INTEGER NOT NULL DEFAULT 50,
    "lastAnalyzed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_behavior_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threat_intelligence" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threat_intelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_incidents" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "incidentType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "indicators" TEXT[],
    "recommendations" TEXT[],
    "confidence" DOUBLE PRECISION NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_recommendations" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "suggestedChanges" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_behavior_profiles_userId_key" ON "user_behavior_profiles"("userId");

-- AddForeignKey
ALTER TABLE "user_behavior_profiles" ADD CONSTRAINT "user_behavior_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_incidents" ADD CONSTRAINT "security_incidents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
