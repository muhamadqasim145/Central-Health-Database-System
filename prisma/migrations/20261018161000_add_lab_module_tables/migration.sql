CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patientID" INTEGER,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LabTestRequest" (
    "id" SERIAL NOT NULL,
    "patientID" INTEGER NOT NULL,
    "recordID" INTEGER,
    "testName" VARCHAR(150) NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LabTestRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LabReport" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "patientID" INTEGER NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100) NOT NULL,
    "fileEncrypted" BYTEA NOT NULL,
    "noteEncrypted" TEXT,
    "uploadedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LabReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AccessLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "userName" VARCHAR(100) NOT NULL,
    "reportTitle" VARCHAR(255) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_patientID_key" ON "User"("patientID");
CREATE INDEX "LabTestRequest_status_createdAt_idx" ON "LabTestRequest"("status", "createdAt");
CREATE INDEX "LabTestRequest_patientID_createdAt_idx" ON "LabTestRequest"("patientID", "createdAt");
CREATE UNIQUE INDEX "LabReport_requestId_key" ON "LabReport"("requestId");
CREATE INDEX "LabReport_patientID_createdAt_idx" ON "LabReport"("patientID", "createdAt");
CREATE INDEX "AccessLog_createdAt_idx" ON "AccessLog"("createdAt");

ALTER TABLE "User"
ADD CONSTRAINT "User_patientID_fkey"
FOREIGN KEY ("patientID") REFERENCES "Patients"("patientID")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LabTestRequest"
ADD CONSTRAINT "LabTestRequest_patientID_fkey"
FOREIGN KEY ("patientID") REFERENCES "Patients"("patientID")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "LabTestRequest"
ADD CONSTRAINT "LabTestRequest_recordID_fkey"
FOREIGN KEY ("recordID") REFERENCES "MedicalRecords"("recordID")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LabReport"
ADD CONSTRAINT "LabReport_requestId_fkey"
FOREIGN KEY ("requestId") REFERENCES "LabTestRequest"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "LabReport"
ADD CONSTRAINT "LabReport_patientID_fkey"
FOREIGN KEY ("patientID") REFERENCES "Patients"("patientID")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "LabReport"
ADD CONSTRAINT "LabReport_uploadedBy_fkey"
FOREIGN KEY ("uploadedBy") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AccessLog"
ADD CONSTRAINT "AccessLog_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
