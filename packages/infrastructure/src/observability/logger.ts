import pino from "pino"
import { trace, context, isSpanContextValid } from "@opentelemetry/api"

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
  level: process.env.LOG_LEVEL || "info",
  mixin() {
    const span = trace.getSpan(context.active())
    if (!span) return {}
    const spanContext = span.spanContext()
    if (!isSpanContextValid(spanContext)) return {}
    return {
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
    }
  },
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
})
