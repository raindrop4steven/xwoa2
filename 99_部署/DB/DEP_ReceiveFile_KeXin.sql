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

 Date: 23/05/2019 14:36:47
*/


-- ----------------------------
-- Table structure for DEP_ReceiveFile_KeXin
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[DEP_ReceiveFile_KeXin]') AND type IN ('U'))
	DROP TABLE [dbo].[DEP_ReceiveFile_KeXin]
GO

CREATE TABLE [dbo].[DEP_ReceiveFile_KeXin] (
  [Id] nvarchar(36) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [DocumentTitle] nvarchar(200) COLLATE Chinese_PRC_CI_AS  NULL,
  [ClosedOrHairTime] datetime  NULL,
  [MessageId] nvarchar(36) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [WorkFlowId] nvarchar(36) COLLATE Chinese_PRC_CI_AS  NOT NULL
)
GO

ALTER TABLE [dbo].[DEP_ReceiveFile_KeXin] SET (LOCK_ESCALATION = TABLE)
GO

EXEC sp_addextendedproperty
'MS_Description', N'主键Id',
'SCHEMA', N'dbo',
'TABLE', N'DEP_ReceiveFile_KeXin',
'COLUMN', N'Id'
GO

EXEC sp_addextendedproperty
'MS_Description', N'文件标题',
'SCHEMA', N'dbo',
'TABLE', N'DEP_ReceiveFile_KeXin',
'COLUMN', N'DocumentTitle'
GO

EXEC sp_addextendedproperty
'MS_Description', N'收/发文日期',
'SCHEMA', N'dbo',
'TABLE', N'DEP_ReceiveFile_KeXin',
'COLUMN', N'ClosedOrHairTime'
GO

EXEC sp_addextendedproperty
'MS_Description', N'工作流程Id',
'SCHEMA', N'dbo',
'TABLE', N'DEP_ReceiveFile_KeXin',
'COLUMN', N'MessageId'
GO

EXEC sp_addextendedproperty
'MS_Description', N'工作流Id',
'SCHEMA', N'dbo',
'TABLE', N'DEP_ReceiveFile_KeXin',
'COLUMN', N'WorkFlowId'
GO

