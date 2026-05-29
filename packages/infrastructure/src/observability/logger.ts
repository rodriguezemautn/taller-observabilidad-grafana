import pino from "pino"
import { trace, context, isSpanContextValid } from "@opentelemetry/api"

const lokiHost = process.env.LOKI_HOST || "http://loki:3100"

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: { colorize: true },
    },
    {
      target: "pino-loki",
      options: {
        host: lokiHost,
        labels: { service_name: "taller-backend" },
        batching: true,
        interval: 2,
      },
    },
  ],
})

export const logger = pino(
  {
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
  },
  transport,
)
