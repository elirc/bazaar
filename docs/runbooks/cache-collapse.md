# Cache Hit-Ratio Collapse

Check whether the failure is global, layer-specific, or one trending key. Preserve
single-flight, reduce nonessential query caching, warm the current hot head, and
watch origin DB saturation. Flush only poisoned keys/tags; a global flush amplifies
the incident. Recover when hit ratio and database p95 stay within budget for 15m.
