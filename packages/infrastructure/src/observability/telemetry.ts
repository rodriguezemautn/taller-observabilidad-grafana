import { NodeSDK } from "@opentelemetry/sdk-node"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { Resource } from "@opentelemetry/resources"
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions"

let sdk: NodeSDK | null = null

export function initTelemetry(): void {
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318"

  sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "taller-backend",
    }),
    traceExporter: new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url: `${otlpEndpoint}/v1/metrics` }),
      exportIntervalMillis: 5000,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-pino": {
          enabled: true,
        },
        "@opentelemetry/instrumentation-fastify": {
          enabled: true,
        },
        "@opentelemetry/instrumentation-http": {
          enabled: true,
        },
        "@opentelemetry/instrumentation-pg": {
          enabled: true,
        },
      }),
    ],
  })

  sdk.start()
  console.log("[OTel] SDK iniciado — traces, metrics y logs habilitados")
}

export async function shutdownTelemetry(): Promise<void> {
  if (sdk) {
    await sdk.shutdown()
    console.log("[OTel] SDK detenido correctamente")
  }
}
