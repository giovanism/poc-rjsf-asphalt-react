import { docsRoute } from 'next-rest-framework';

export const dynamic = 'force-dynamic';
export const { GET } = docsRoute({
  // deniedPaths: [...] // Ignore endpoints from the generated OpenAPI spec.
  // allowedPaths: [...], // Explicitly set which endpoints to include in the generated OpenAPI spec.
  // Override and customize the generated OpenAPI spec.
  openApiObject: {
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'My API description.'
    }
    // ...
  },
  // openApiJsonPath: '/openapi.json', // Customize the path where the OpenAPI spec will be generated.
  // Customize the rendered documentation.
  docsConfig: {
    provider: 'redoc', // redoc | swagger-ui
    title: 'My API',
    description: 'My API description.'
    // ...
  }
});