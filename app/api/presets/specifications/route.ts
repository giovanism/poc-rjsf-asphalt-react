import { NextResponse } from 'next/server';

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

export async function GET() {
  return NextResponse.json(specificationPresets);
}
