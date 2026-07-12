# Order Backlog

Break backlog down by job type, age, and retry count. Stop poison jobs from blocking
healthy work; move exhausted jobs to DLQ with evidence. Scale workers only if the
dependency is healthy. For merchant webhooks, preserve delivery IDs/signatures.
Recover when oldest age and arrival/service rates stay below alert thresholds.
