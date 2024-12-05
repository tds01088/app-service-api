import express, { Request, Response, NextFunction } from "express";
import { context, propagation, trace } from '@opentelemetry/api';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export class TraceLogger {
  /**
   * Apply tracing middleware for Express to create spans for incoming requests.
   */
  static applyRestTracingMiddleware(app: express.Application): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const tracer = trace.getTracer("rest-api-tracer");
      const span = tracer.startSpan(`HTTP ${req.method} ${req.path}`);

      // Set active context with the span
      context.with(trace.setSpan(context.active(), span), () => {
        res.on("finish", () => {
          span.setAttribute("http.method", req.method);
          span.setAttribute("http.url", req.originalUrl);
          span.setAttribute("http.status_code", res.statusCode);
          span.end(); // End the span when the response is finished
        });

        next();
      });
    });
  }

  /**
   * Apply middleware to log request headers and propagate tracing headers.
   */
  static applyLogHeaderMiddleware(
    app: express.Application,
    loggingIgnore: string[] = []
  ): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (!loggingIgnore.some((path) => req.path.startsWith(path))) {
        console.log("Request Headers:", req.headers);
      }
      next();
    });
  }

  /**
   * Apply an Axios interceptor for tracing.
   */
  static applyAxiosTracingInterceptor(axiosInstance: typeof axios): void {
    const tracer = trace.getTracer("axios-tracer");

    // Request interceptor
    axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const span = tracer.startSpan(
        `HTTP ${config.method?.toUpperCase()} ${config.url}`
      );

      // Inject the current trace context into the headers
      const headers = config.headers || {};
      trace.getSpan(context.active())?.spanContext() &&
        propagation.inject(context.active(), headers);
      config.headers = headers;

      (config as any).__otelSpan = span; // Attach span to config for later access
      return config;
    });

    // Response interceptor
    axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const span = (response.config as any).__otelSpan;
        if (span) {
          span.setAttribute("http.status_code", response.status);
          span.end(); // End the span when the response is received
        }
        return response;
      },
      (error) => {
        const span = (error.config as any).__otelSpan;
        if (span) {
          span.setAttribute("http.status_code", error.response?.status || 500);
          span.recordException(error);
          span.end(); // End the span on error
        }
        return Promise.reject(error);
      }
    );
  }
}
