/*
 Navicat Premium Data Transfer

 Source Server         : DeptOA DB
 Source Server Type    : SQL Server
 Source Server Version : 11002100
 Source Host           : 10.211.55.4:1433
 Source Catalog        : xwoa
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 11002100
 File Encoding         : 65001

 Date: 23/05/2019 14:36:00
*/


-- ----------------------------
-- Table structure for DEP_MessageAlarm
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[DEP_MessageAlarm]') AND type IN ('U'))
	DROP TABLE [dbo].[DEP_MessageAlarm]
GO

CREATE TABLE [dbo].[DEP_MessageAlarm] (
  [ID] int  IDENTITY(1,1) NOT NULL,
  [MessageID] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [AlarmDate] datetime  NULL,
  [JobID] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL
)
GO

ALTER TABLE [dbo].[DEP_MessageAlarm] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Primary Key structure for table DEP_MessageAlarm
-- ----------------------------
ALTER TABLE [dbo].[DEP_MessageAlarm] ADD CONSTRAINT [PK_dbo.DEP_MessageAlarm] PRIMARY KEY CLUSTERED ([ID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO

