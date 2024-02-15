CREATE DATABASE IF NOT EXISTS dropzone;

USE dropzone;

CREATE TABLE
    IF NOT EXISTS User (
        userId INTEGER PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE,
        cognitoRef VARCHAR(255) NOT NULL UNIQUE, -- TODO: how is this actually done?
        isPlatformManager BOOLEAN NOT NULL DEFAULT 0,
        isAssessmentCreator BOOLEAN NOT NULL DEFAULT 1,
        dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        -- TODO: Index on (email) and (congnito) likely
    );

CREATE TABLE
    IF NOT EXISTS Folder (
        folderId INTEGER PRIMARY KEY AUTO_INCREMENT,
        parentId INTEGER,
        folderName VARCHAR(255),
        ownerUserId INTEGER NOT NULL,
        dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        dateModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS FileObject (
        fId INTEGER PRIMARY KEY AUTO_INCREMENT,
        parentFolderId INTEGER NOT NULL,
        fName VARCHAR(255) NOT NULL,
        fType ENUM ('uploader_group', 'assessment') NOT NULL,
        dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        dateModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT unique_name_in_folder UNIQUE (parentFolderId, fName),
        INDEX (parentFolderId)
    );

CREATE TABLE
    IF NOT EXISTS UploaderGroup (fileObjectId INTEGER PRIMARY KEY);

CREATE TABLE
    IF NOT EXISTS Assessment (
        fileObjectId INTEGER PRIMARY KEY,
        dueDate TIMESTAMP,
        timeLimitSeconds INTEGER,
        faceBlurAllowed BOOLEAN NOT NULL DEFAULT 0
    );

CREATE TABLE
    IF NOT EXISTS Uploader (
        uploaderId INTEGER PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255)
        -- Index on (email)
    );

CREATE TABLE
    IF NOT EXISTS UploaderGroupMembers (
        uploaderGroupId INTEGER NOT NULL,
        uploaderId INTEGER NOT NULL,
        PRIMARY KEY (uploaderGroupId, uploaderId)
    );

CREATE TABLE
    IF NOT EXISTS UploadRequest (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        uploaderId INTEGER NOT NULL,
        assessmentId INTEGER NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS Video (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        assessmentId INTEGER NOT NULL,
        uploaderId INTEGER NOT NULL,
        uploadedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        s3Key VARCHAR(255) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS AssessmentGroups (
        assessmentId INTEGER NOT NULL,
        uploaderGroupId INTEGER NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS AssessmentUploaders (
        assessmentId INTEGER NOT NULL,
        uploaderId INTEGER NOT NULL
    );

-- Folders may live in Folders
ALTER TABLE Folder ADD FOREIGN KEY (parentId) REFERENCES Folder (folderId) ON DELETE CASCADE;

-- Folders have user owners
ALTER TABLE Folder ADD FOREIGN KEY (ownerUserId) REFERENCES User (userId) ON DELETE CASCADE;

-- FileObject live in Folders
ALTER TABLE FileObject ADD FOREIGN KEY (parentFolderId) REFERENCES Folder (folderId) ON DELETE CASCADE;

-- Every UploaderGroup is a FileObject
ALTER TABLE UploaderGroup ADD FOREIGN KEY (fileObjectId) REFERENCES FileObject (fId) ON DELETE CASCADE;

-- Every Assessment it a FileObject
ALTER TABLE Assessment ADD FOREIGN KEY (fileObjectId) REFERENCES FileObject (fId) ON DELETE CASCADE;

-- UploaderGroupMembers have members
ALTER TABLE UploaderGroupMembers ADD FOREIGN KEY (uploaderId) REFERENCES Uploader (uploaderId) ON DELETE CASCADE;

-- UploaderGroupMembers are groups
ALTER TABLE UploaderGroupMembers ADD FOREIGN KEY (uploaderGroupId) REFERENCES UploaderGroup (fileObjectId) ON DELETE CASCADE;

-- UploadRequest is for an Assignment
ALTER TABLE UploadRequest ADD FOREIGN KEY (assessmentId) REFERENCES Assessment (fileObjectId) ON DELETE CASCADE;

-- An uploader is requested
ALTER TABLE UploadRequest ADD FOREIGN KEY (uploaderId) REFERENCES Uploader (uploaderId) ON DELETE CASCADE;

-- A video is uploaded by an uploader
ALTER TABLE Video ADD FOREIGN KEY (uploaderId) REFERENCES Uploader (uploaderId);

-- A video is submitted to an assessment
ALTER TABLE Video ADD FOREIGN KEY (assessmentId) REFERENCES Assessment (fileObjectId);

-- AssessmentGroups link UploaderGroups to Assessments
ALTER TABLE AssessmentGroups ADD FOREIGN KEY (assessmentId) REFERENCES Assessment (fileObjectId) ON DELETE CASCADE;

ALTER TABLE AssessmentGroups ADD FOREIGN KEY (uploaderGroupId) REFERENCES UploaderGroup (fileObjectId) ON DELETE CASCADE;

-- AssessmentUploaders link Users to Assessments
ALTER TABLE AssessmentUploaders ADD FOREIGN KEY (assessmentId) REFERENCES Assessment (fileObjectId) ON DELETE CASCADE;

ALTER TABLE AssessmentUploaders ADD FOREIGN KEY (uploaderId) REFERENCES Uploader (uploaderId) ON DELETE CASCADE;