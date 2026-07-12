# Deploy Rollback

Stop new rollout, keep the database forward-compatible, and roll stateless services
to the last green image. Drain workers before replacement. Do not reverse a data
migration destructively; use a forward repair. Warm the prior image's hot set,
run browse→cart→checkout→order smoke, and monitor checkout SLO for 15 minutes.
