import { TypedNextResponse, route, routeOperation  } from 'next-rest-framework';
import { z } from 'zod';

export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate this static data

const specificationPresets = {
  small: {
    type: 'small',
    requests: {
      cpu: '0.5',
      memory: '512Mi'
    },
    limits: {
      cpu: '1',
      memory: '1Gi'
    }
  },
  medium: {
    type: 'medium',
    requests: {
      cpu: '1',
      memory: '1Gi'
    },
    limits: {
      cpu: '2',
      memory: '2Gi'
    }
  },
  large: {
    type: 'large',
    requests: {
      cpu: '2',
      memory: '2Gi'
    },
    limits: {
      cpu: '4',
      memory: '4Gi'
    }
  },
  memoryOptimized: {
    type: 'memory-optimized',
    requests: {
      cpu: '2',
      memory: '4Gi'
    },
    limits: {
      cpu: '4',
      memory: '8Gi'
    }
  },
  computeOptimized: {
    type: 'compute-optimized',
    requests: {
      cpu: '4',
      memory: '2Gi'
    },
    limits: {
      cpu: '8',
      memory: '4Gi'
    }
  }
};

export const { GET } = route({
  getPresetsSpecifications: routeOperation({
    openApiOperation: {
      summary: 'Get Preset Specifications',
      description: 'Retrieve a list of preset specifications for resource requests and limits.',
      tags: ['Presets']
    },
    method: 'GET'
  })
    .outputs([
      {
        status: 200,
        contentType: 'application/json',
        body: z.record(z.object({
          type: z.string(),
          requests: z.object({
            cpu: z.string(),
            memory: z.string()
          }),
          limits: z.object({
            cpu: z.string(),
            memory: z.string()
          })
        }))
      }
    ])
    .handler(() => {
      return TypedNextResponse.json(specificationPresets);
    }),

})