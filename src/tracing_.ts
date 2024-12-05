import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import * as jaeger from '@opentelemetry/exporter-jaeger';

const JaegerExporter = jaeger.JaegerExporter;
// Enable diagnostic logging (optional, for debugging)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Configure Jaeger Exporter
const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces', // Replace with your Jaeger endpoint
});
// Configure OpenTelemetry SDK
const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter() || jaegerExporter, // Replace with other exporters for production
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

// // Configure Jaeger Exporter
// const jaegerExporter = new JaegerExporter({
//   endpoint: 'http://localhost:14268/api/traces', // Replace with your Jaeger endpoint
//   serviceName: 'my-typescript-app',
// });


// Start the SDK
(async () => {
  try {
    await sdk.start();
    console.log('Tracing initialized');
  } catch (err) {
    console.error('Error initializing tracing:', err);
  }
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((err) => console.error('Error during tracing shutdown:', err));
});
