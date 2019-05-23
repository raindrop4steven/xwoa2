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

 Date: 23/05/2019 14:36:22
*/


-- ----------------------------
-- Table structure for DEP_FavoriteMessage
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[DEP_FavoriteMessage]') AND type IN ('U'))
	DROP TABLE [dbo].[DEP_FavoriteMessage]
GO

CREATE TABLE [dbo].[DEP_FavoriteMessage] (
  [ID] int  IDENTITY(1,1) NOT NULL,
  [MessageID] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [EmplID] nvarchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [CreateTime] datetime  NOT NULL
)
GO

ALTER TABLE [dbo].[DEP_FavoriteMessage] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Primary Key structure for table DEP_FavoriteMessage
-- ----------------------------
ALTER TABLE [dbo].[DEP_FavoriteMessage] ADD CONSTRAINT [PK_dbo.DEP_FavoriteMessage] PRIMARY KEY CLUSTERED ([ID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO

