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

 Date: 24/05/2019 09:46:39
*/


-- ----------------------------
-- Table structure for DEP_SubflowRelation
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[DEP_SubflowRelation]') AND type IN ('U'))
	DROP TABLE [dbo].[DEP_SubflowRelation]
GO

CREATE TABLE [dbo].[DEP_SubflowRelation] (
  [ID] int  IDENTITY(1,1) NOT NULL,
  [OriginMessageID] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [SubflowMessageID] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [CreateTime] datetime  NOT NULL,
  [UpdateTime] datetime  NOT NULL
)
GO

ALTER TABLE [dbo].[DEP_SubflowRelation] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Primary Key structure for table DEP_SubflowRelation
-- ----------------------------
ALTER TABLE [dbo].[DEP_SubflowRelation] ADD CONSTRAINT [PK_dbo.DEP_SubflowRelation] PRIMARY KEY CLUSTERED ([ID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO

