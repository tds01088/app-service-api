import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Enable diagnostic logging (optional)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Configure the OTLP Trace Exporter
const otlpExporter = new OTLPTraceExporter({
  url: 'http://localhost:4317', // Replace with your OTLP endpoint
  // Add other configurations if needed, like authentication headers
});

// Set up the NodeSDK with the OTLP exporter
const sdk = new NodeSDK({
  traceExporter: otlpExporter, // Use OTLP exporter directly
  spanProcessor: new BatchSpanProcessor(otlpExporter), // Use BatchSpanProcessor for better performance
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

// Start the SDK
(async () => {
  try {
    await sdk.start();
    console.log('Tracing initialized');
  } catch (err) {
    console.error('Error initializing tracing:', err);
  }
})();

// Graceful shutdown for cleanup
process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing terminated');
  } catch (err) {
    console.error('Error during tracing shutdown:', err);
  }
});
