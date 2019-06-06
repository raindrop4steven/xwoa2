/*
Navicat SQL Server Data Transfer

Source Server         : 本地SQL_Server
Source Server Version : 110000
Source Host           : .:1433
Source Database       : xwshow
Source Schema         : dbo

Target Server Type    : SQL Server
Target Server Version : 110000
File Encoding         : 65001

Date: 2019-06-03 10:02:09
*/


-- ----------------------------
-- Table structure for DEP_SubflowRelation
-- ----------------------------
DROP TABLE [dbo].[DEP_SubflowRelation]
GO
CREATE TABLE [dbo].[DEP_SubflowRelation] (
[ID] int NOT NULL IDENTITY(1,1) ,
[OriginMessageID] nvarchar(MAX) NULL ,
[SubflowMessageID] nvarchar(MAX) NULL ,
[CreateTime] datetime NOT NULL ,
[UpdateTime] datetime NOT NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[DEP_SubflowRelation]', RESEED, 4)
GO

-- ----------------------------
-- Indexes structure for table DEP_SubflowRelation
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table DEP_SubflowRelation
-- ----------------------------
ALTER TABLE [dbo].[DEP_SubflowRelation] ADD PRIMARY KEY ([ID])
GO
