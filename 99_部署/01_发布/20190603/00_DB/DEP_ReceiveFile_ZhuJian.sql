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

Date: 2019-06-03 10:02:02
*/


-- ----------------------------
-- Table structure for DEP_ReceiveFile_ZhuJian
-- ----------------------------
DROP TABLE [dbo].[DEP_ReceiveFile_ZhuJian]
GO
CREATE TABLE [dbo].[DEP_ReceiveFile_ZhuJian] (
[Id] nvarchar(36) NOT NULL ,
[DocumentTitle] nvarchar(200) NULL ,
[ClosedOrHairTime] datetime NULL ,
[MessageId] nvarchar(36) NOT NULL ,
[WorkFlowId] nvarchar(36) NOT NULL 
)


GO
IF ((SELECT COUNT(*) from fn_listextendedproperty('MS_Description', 
'SCHEMA', N'dbo', 
'TABLE', N'DEP_ReceiveFile_ZhuJian', 
'COLUMN', N'Id')) > 0) 
EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'主键Id'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'Id'
ELSE
EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'主键Id'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'Id'
GO
IF ((SELECT COUNT(*) from fn_listextendedproperty('MS_Description', 
'SCHEMA', N'dbo', 
'TABLE', N'DEP_ReceiveFile_ZhuJian', 
'COLUMN', N'DocumentTitle')) > 0) 
EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'文件标题'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'DocumentTitle'
ELSE
EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'文件标题'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'DocumentTitle'
GO
IF ((SELECT COUNT(*) from fn_listextendedproperty('MS_Description', 
'SCHEMA', N'dbo', 
'TABLE', N'DEP_ReceiveFile_ZhuJian', 
'COLUMN', N'ClosedOrHairTime')) > 0) 
EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'收/发文日期'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'ClosedOrHairTime'
ELSE
EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'收/发文日期'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'ClosedOrHairTime'
GO
IF ((SELECT COUNT(*) from fn_listextendedproperty('MS_Description', 
'SCHEMA', N'dbo', 
'TABLE', N'DEP_ReceiveFile_ZhuJian', 
'COLUMN', N'MessageId')) > 0) 
EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'工作流程Id'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'MessageId'
ELSE
EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'工作流程Id'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'MessageId'
GO
IF ((SELECT COUNT(*) from fn_listextendedproperty('MS_Description', 
'SCHEMA', N'dbo', 
'TABLE', N'DEP_ReceiveFile_ZhuJian', 
'COLUMN', N'WorkFlowId')) > 0) 
EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'工作流Id'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'WorkFlowId'
ELSE
EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'工作流Id'
, @level0type = 'SCHEMA', @level0name = N'dbo'
, @level1type = 'TABLE', @level1name = N'DEP_ReceiveFile_ZhuJian'
, @level2type = 'COLUMN', @level2name = N'WorkFlowId'
GO
