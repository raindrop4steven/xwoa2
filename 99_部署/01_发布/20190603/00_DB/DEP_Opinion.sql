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

Date: 2019-06-03 10:01:55
*/


-- ----------------------------
-- Table structure for DEP_Opinion
-- ----------------------------
DROP TABLE [dbo].[DEP_Opinion]
GO
CREATE TABLE [dbo].[DEP_Opinion] (
[ID] int NOT NULL IDENTITY(1,1) ,
[EmplID] nvarchar(MAX) NULL ,
[MessageID] nvarchar(MAX) NULL ,
[NodeKey] nvarchar(MAX) NULL ,
[Opinion] nvarchar(MAX) NULL ,
[order] int NOT NULL ,
[CreateTime] datetime NULL ,
[UpdatedTime] datetime NULL 
)


GO

-- ----------------------------
-- Indexes structure for table DEP_Opinion
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table DEP_Opinion
-- ----------------------------
ALTER TABLE [dbo].[DEP_Opinion] ADD PRIMARY KEY ([ID])
GO
