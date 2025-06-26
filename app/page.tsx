'use client';

import { useState } from 'react';
import { SchemaEditor } from '@/components/schema-editor';
import { JSONObjectEditor } from '@/components/json-object-editor';
import { UISchemaEditor } from '@/components/ui-schema-editor';
import { LiveFormRenderer } from '@/components/live-form-renderer';
import { Button } from '@/components/ui/button';
import { RefreshCw, Code, FileText } from 'lucide-react';

const defaultUseCase = "userProfile";

const defaultSchema = `{
  "type": "object",
  "title": "User Profile",
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First Name",
      "minLength": 2
    },
    "lastName": {
      "type": "string",
      "title": "Last Name",
      "minLength": 2
    },
    "email": {
      "type": "string",
      "title": "Email",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "title": "Age",
      "minimum": 18,
      "maximum": 120
    },
    "bio": {
      "type": "string",
      "title": "Biography",
      "description": "Tell us about yourself"
    },
    "isActive": {
      "type": "boolean",
      "title": "Active User",
      "default": true
    },
    "role": {
      "type": "string",
      "title": "Role",
      "enum": ["user", "admin", "moderator"],
      "enumNames": ["User", "Administrator", "Moderator"]
    }
  },
  "required": ["firstName", "lastName", "email"]
}`;

const defaultFormData = `{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "bio": "Full-stack developer with 5+ years of experience",
  "isActive": true,
  "role": "user"
}`;

const useCases = {
  userProfile: {
    label: "User Profile",
    schema: defaultSchema,
    uiSchema: `{
      "bio": {
        "ui:widget": "textarea",
        "ui:options": {
          "rows": 4
        }
      },
      "email": {
        "ui:options": {
          "inputType": "email"
        }
      },
      "isActive": {
        "ui:widget": "checkbox"
      },
      "role": {
        "ui:widget": "select"
      }
    }`,
    formData: defaultFormData
  },
  autoScalingGroup: {
    label: "Auto Scaling Group",
    schema: `{
      "type": "object",
      "title": "Auto Scaling Group Configuration",
      "required": ["groupName", "minSize", "maxSize", "targetSize", "instanceType"],
      "properties": {
        "groupName": {
          "type": "string",
          "title": "Group Name",
          "minLength": 1,
          "pattern": "^[a-zA-Z0-9-_]+$"
        },
        "minSize": {
          "type": "integer",
          "title": "Minimum Size",
          "minimum": 0,
          "maximum": 100
        },
        "maxSize": {
          "type": "integer",
          "title": "Maximum Size",
          "minimum": 1,
          "maximum": 100
        },
        "targetSize": {
          "type": "integer",
          "title": "Desired Capacity",
          "minimum": 1,
          "maximum": 100
        },
        "instanceType": {
          "type": "string",
          "title": "Instance Type",
          "enum": ["t3.micro", "t3.small", "t3.medium", "t3.large"],
          "enumNames": ["t3.micro (2 vCPU, 1GB)", "t3.small (2 vCPU, 2GB)", "t3.medium (2 vCPU, 4GB)", "t3.large (2 vCPU, 8GB)"]
        },
        "cooldown": {
          "type": "integer",
          "title": "Cooldown Period (seconds)",
          "default": 300,
          "minimum": 0,
          "maximum": 3600
        },
        "monitoring": {
          "type": "boolean",
          "title": "Enable Detailed Monitoring",
          "default": false
        }
      }
    }`,
    uiSchema: `{
      "instanceType": {
        "ui:widget": "select"
      },
      "monitoring": {
        "ui:widget": "checkbox"
      },
      "ui:order": ["groupName", "minSize", "maxSize", "targetSize", "instanceType", "cooldown", "monitoring"]
    }`,
    formData: `{
      "groupName": "web-servers",
      "minSize": 1,
      "maxSize": 10,
      "targetSize": 3,
      "instanceType": "t3.medium",
      "cooldown": 300,
      "monitoring": true
    }`
  },
  kubernetesDeployment: {
    label: "Kubernetes Deployment",
    schema: `{
      "type": "object",
      "title": "Kubernetes Deployment Configuration",
      "required": ["name", "image", "replicas"],
      "properties": {
        "name": {
          "type": "string",
          "title": "Deployment Name",
          "pattern": "^[a-z0-9-]+$",
          "minLength": 1
        },
        "namespace": {
          "type": "string",
          "title": "Namespace",
          "default": "default"
        },
        "image": {
          "type": "string",
          "title": "Container Image",
          "pattern": "^([a-zA-Z0-9-._]+\\/)?([a-zA-Z0-9-._]+\\/)*[a-zA-Z0-9-._]+(?:[:@][a-zA-Z0-9-._]+)?$",
          "description": "Docker image name (e.g., nginx:1.19, registry.example.com/org/app:v1.0.0)"
        },
        "replicas": {
          "type": "integer",
          "title": "Number of Replicas",
          "minimum": 0,
          "maximum": 100,
          "default": 1
        },
        "resources": {
          "type": "object",
          "title": "Resource Limits",
          "properties": {
            "cpu": {
              "type": "string",
              "title": "CPU Limit",
              "default": "500m"
            },
            "memory": {
              "type": "string",
              "title": "Memory Limit",
              "default": "512Mi"
            }
          }
        },
        "ports": {
          "type": "array",
          "title": "Container Ports",
          "items": {
            "type": "object",
            "properties": {
              "containerPort": {
                "type": "integer",
                "title": "Container Port",
                "minimum": 1,
                "maximum": 65535
              },
              "protocol": {
                "type": "string",
                "title": "Protocol",
                "enum": ["TCP", "UDP"],
                "default": "TCP"
              }
            }
          }
        }
      }
    }`,
    uiSchema: `{
      "ui:order": ["name", "namespace", "image", "replicas", "resources", "ports"],
      "resources": {
        "ui:order": ["cpu", "memory"]
      },
      "ports": {
        "items": {
          "ui:order": ["containerPort", "protocol"],
          "protocol": {
            "ui:widget": "select"
          }
        }
      }
    }`,
    formData: `{
      "name": "frontend-app",
      "namespace": "production",
      "image": "nginx:1.19",
      "replicas": 3,
      "resources": {
        "cpu": "500m",
        "memory": "512Mi"
      },
      "ports": [
        {
          "containerPort": 80,
          "protocol": "TCP"
        }
      ]
    }`
  }
};

export default function Home() {
  const [schema, setSchema] = useState(defaultSchema);
  const [uiSchema, setUISchema] = useState(useCases[defaultUseCase].uiSchema);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedUseCase, setSelectedUseCase] = useState<keyof typeof useCases>(defaultUseCase);

  const handleUseCaseChange = (useCase: keyof typeof useCases) => {
    setSelectedUseCase(useCase);
    setSchema(useCases[useCase].schema);
    setUISchema(useCases[useCase].uiSchema);
    setFormData(useCases[useCase].formData);
  };

  const handleReset = () => {
    handleUseCaseChange(selectedUseCase);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6 h-screen flex flex-col">
        <div className="mb-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                JSON Schema Editor
              </h1>
              <p className="text-gray-600 text-lg">
                Build and test JSON schemas with live form rendering
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedUseCase}
                onChange={(e) => handleUseCaseChange(e.target.value as keyof typeof useCases)}
                className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(useCases).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Left Panel - Editors */}
          <div className="flex flex-col gap-6 min-h-0">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 flex-shrink-0">
              <Code className="w-4 h-4" />
              Code Editors
            </div>
            
            <div className="flex-1 min-h-0 grid grid-rows-3 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">JSON Schema</span>
                <div className="flex-1">
                  <SchemaEditor value={schema} onChange={setSchema} />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">UI Schema</span>
                <div className="flex-1">
                  <UISchemaEditor value={uiSchema} onChange={setUISchema} />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">Form Data</span>
                <div className="flex-1">
                  <JSONObjectEditor value={formData} onChange={setFormData} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="flex flex-col gap-6 min-h-0">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 flex-shrink-0">
              <FileText className="w-4 h-4" />
              Live Preview
            </div>
            
            <div className="flex-1 min-h-0">
              <LiveFormRenderer
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onFormDataChange={setFormData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}