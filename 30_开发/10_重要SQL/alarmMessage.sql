SELECT
	z.* 
FROM
	(
	SELECT
		ROW_NUMBER () OVER ( ORDER BY DATEDIFF( DAY, ReceiveTime, m.AlarmDate ) DESC ) number,
		a.*,
	CASE
			
			WHEN DATEDIFF( DAY, ReceiveTime, m.AlarmDate ) IS NULL THEN -1
			WHEN DATEDIFF( DAY, ReceiveTime, m.AlarmDate ) > 2 THEN -1
			WHEN DATEDIFF( DAY, ReceiveTime, m.AlarmDate ) < 0 THEN -1
			ELSE DATEDIFF( DAY, ReceiveTime, m.AlarmDate ) 
		END AS days 
	FROM
		(
		SELECT
			t.* 
		FROM
			(
			SELECT
				b.DocumentTitle,
				CONVERT ( VARCHAR ( 100 ), b.ClosedOrHairTime, 20 ) AS ClosedOrHairTime,
				b.MessageId,
				b.WorkFlowId,
--流程发起人
				a.MessageIssuedBy AS InitiateEmplId,
				d.EmplName AS InitiateEmplName,
--流程类型
				a.MessageTitle,
--环节
				c.NodeName AS MyTask,
				CONVERT ( VARCHAR ( 100 ), c.CreateTime, 20 ) AS ReceiveTime 
			FROM
				WKF_Message a
				INNER JOIN DEP_ReceiveFile_ZhuJian b ON a.MessageID = b.MessageId
				INNER JOIN WKF_MessageHandle c ON a.MessageID = c.MessageID
				INNER JOIN ORG_Employee d ON a.MessageIssuedBy = d.EmplID 
			WHERE
				c.HandleStatus != 0 
				AND a.MessageStatus NOT IN ( 0, 3 ) 
				AND (
					c.UserID = '100001' 
				OR ( c.EntrustBy = '100001' AND c.EntrustBy <> '' )) UNION
			SELECT
				b.DocumentTitle,
				CONVERT ( VARCHAR ( 100 ), b.ClosedOrHairTime, 20 ) AS ClosedOrHairTime,
				b.MessageId,
				b.WorkFlowId,
--流程发起人
				a.MessageIssuedBy AS InitiateEmplId,
				d.EmplName AS InitiateEmplName,
--流程类型
				a.MessageTitle,
--环节
				c.NodeName AS MyTask,
				CONVERT ( VARCHAR ( 100 ), c.CreateTime, 20 ) AS ReceiveTime 
			FROM
				WKF_Message a
				INNER JOIN DEP_ReceiveFile_KeXin b ON a.MessageID = b.MessageId
				INNER JOIN WKF_MessageHandle c ON a.MessageID = c.MessageID
				INNER JOIN ORG_Employee d ON a.MessageIssuedBy = d.EmplID 
			WHERE
				c.HandleStatus != 0 
				AND a.MessageStatus NOT IN ( 0, 3 ) 
				AND (
					c.UserID = '100001' 
				OR ( c.EntrustBy = '100001' AND c.EntrustBy <> '' ))) t 
		) a
		LEFT JOIN DEP_MessageAlarm m ON a.MessageId = m.MessageID 
	) z 
WHERE
	z.number >= 1 
	AND z.number < 11
ORDER BY z.days desc;