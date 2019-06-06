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

Date: 2019-06-03 10:01:41
*/


-- ----------------------------
-- Table structure for DEP_FavoriteMessage
-- ----------------------------
DROP TABLE [dbo].[DEP_FavoriteMessage]
GO
CREATE TABLE [dbo].[DEP_FavoriteMessage] (
[ID] int NOT NULL IDENTITY(1,1) ,
[MessageID] nvarchar(MAX) NULL ,
[EmplID] nvarchar(MAX) NULL ,
[CreateTime] datetime NOT NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[DEP_FavoriteMessage]', RESEED, 19)
GO

-- ----------------------------
-- Indexes structure for table DEP_FavoriteMessage
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table DEP_FavoriteMessage
-- ----------------------------
ALTER TABLE [dbo].[DEP_FavoriteMessage] ADD PRIMARY KEY ([ID])
GO
