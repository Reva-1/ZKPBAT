import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean existing data
  await prisma.policyAssignment.deleteMany()
  await prisma.policyVersion.deleteMany()
  await prisma.policy.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      password: await bcrypt.hash('admin123', 10),
    },
  })

  const policyManager = await prisma.user.create({
    data: {
      email: 'policy@company.com',
      firstName: 'Policy',
      lastName: 'Manager',
      role: 'POLICY_MANAGER',
      password: await bcrypt.hash('policy123', 10),
    },
  })

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@company.com',
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER',
      password: await bcrypt.hash('user123', 10),
    },
  })

  // Create policies
  const securityPolicy = await prisma.policy.create({
    data: {
      title: 'Information Security Policy',
      description: 'Comprehensive security guidelines for all employees',
      content: `# Information Security Policy

## Overview
This policy establishes the framework for information security within our organization.

## Password Requirements
- Minimum 12 characters
- Must include uppercase, lowercase, numbers, and symbols
- Changed every 90 days

## Data Classification
- **Public**: Unrestricted access
- **Internal**: Company use only
- **Confidential**: Restricted access
- **Secret**: Highest level protection

## Incident Reporting
All security incidents must be reported within 24 hours.`,
      category: 'SECURITY',
      status: 'ACTIVE',
      version: 1,
      effectiveDate: new Date(),
      authorId: policyManager.id,
      tags: ['security', 'passwords', 'data-protection'],
    },
  })

  const hrPolicy = await prisma.policy.create({
    data: {
      title: 'Remote Work Policy',
      description: 'Guidelines for remote work arrangements',
      content: `# Remote Work Policy

## Eligibility
Employees may work remotely with manager approval.

## Requirements
- Secure internet connection
- Appropriate workspace
- Regular communication with team

## Equipment
Company will provide necessary equipment for remote work.`,
      category: 'HR',
      status: 'ACTIVE',
      version: 2,
      effectiveDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      authorId: policyManager.id,
      tags: ['hr', 'remote-work', 'flexibility'],
    },
  })

  // Create policy assignments
  await prisma.policyAssignment.create({
    data: {
      policyId: securityPolicy.id,
      userId: regularUser.id,
    },
  })

  await prisma.policyAssignment.create({
    data: {
      policyId: hrPolicy.id,
      userId: regularUser.id,
      acknowledgedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  })

  console.log('Seed completed successfully!')
  console.log('Created users:')
  console.log('- Admin: admin@company.com / admin123')
  console.log('- Policy Manager: policy@company.com / policy123')
  console.log('- Regular User: user@company.com / user123')
  console.log('Created 2 policies and assignments')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
