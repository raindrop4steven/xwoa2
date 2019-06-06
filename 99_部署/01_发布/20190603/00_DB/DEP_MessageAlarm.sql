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

Date: 2019-06-03 10:01:48
*/


-- ----------------------------
-- Table structure for DEP_MessageAlarm
-- ----------------------------
DROP TABLE [dbo].[DEP_MessageAlarm]
GO
CREATE TABLE [dbo].[DEP_MessageAlarm] (
[ID] int NOT NULL IDENTITY(1,1) ,
[MessageID] nvarchar(MAX) NULL ,
[AlarmDate] datetime NULL ,
[JobID] nvarchar(MAX) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[DEP_MessageAlarm]', RESEED, 1051)
GO

-- ----------------------------
-- Indexes structure for table DEP_MessageAlarm
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table DEP_MessageAlarm
-- ----------------------------
ALTER TABLE [dbo].[DEP_MessageAlarm] ADD PRIMARY KEY ([ID])
GO
