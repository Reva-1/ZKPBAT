import Joi from 'joi';

export const createPolicySchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(500).required(),
  content: Joi.string().min(50).required(),
  category: Joi.string().valid('PRIVACY', 'SECURITY', 'COMPLIANCE', 'HR', 'IT', 'FINANCE', 'OTHER').required(),
  effectiveDate: Joi.date().iso().required(),
  expirationDate: Joi.date().iso().greater(Joi.ref('effectiveDate')).optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

export const updatePolicySchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(500).optional(),
  content: Joi.string().min(50).optional(),
  category: Joi.string().valid('PRIVACY', 'SECURITY', 'COMPLIANCE', 'HR', 'IT', 'FINANCE', 'OTHER').optional(),
  effectiveDate: Joi.date().iso().optional(),
  expirationDate: Joi.date().iso().optional(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED').optional(),
  tags: Joi.array().items(Joi.string()).optional()
});
