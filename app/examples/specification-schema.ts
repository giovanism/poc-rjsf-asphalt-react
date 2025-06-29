export const specificationSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name'
    },
    specification: {
      title: 'Specification',
      $ref: '/schemas/custom-specification'
    },
    description: {
      type: 'string',
      title: 'Description'
    }
  },
  required: ['name', 'specification']
};
