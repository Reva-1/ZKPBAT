import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.policyAssignment.deleteMany();
  await prisma.policyVersion.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.user.deleteMany();

  // Create default users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@policyapp.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const policyManager = await prisma.user.create({
    data: {
      email: 'manager@policyapp.com',
      password: managerPassword,
      firstName: 'Policy',
      lastName: 'Manager',
      role: 'POLICY_MANAGER',
      isActive: true,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@policyapp.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      isActive: true,
    },
  });

  const auditorUser = await prisma.user.create({
    data: {
      email: 'auditor@policyapp.com',
      password: userPassword,
      firstName: 'Jane',
      lastName: 'Auditor',
      role: 'AUDITOR',
      isActive: true,
    },
  });

  console.log('✅ Created default users');

  // Create sample policies
  const securityPolicy = await prisma.policy.create({
    data: {
      title: 'Information Security Policy',
      description: 'Comprehensive information security guidelines for all employees',
      content: `# Information Security Policy

## Purpose
This policy establishes guidelines for protecting company information assets.

## Scope
This policy applies to all employees, contractors, and third parties.

## Password Requirements
- Minimum 8 characters
- Mix of letters, numbers, and symbols
- Changed every 90 days
- No reuse of last 5 passwords

## Data Classification
- **Public**: No protection required
- **Internal**: Company use only
- **Confidential**: Restricted access
- **Secret**: Highest level protection

## Incident Reporting
All security incidents must be reported within 24 hours.`,
      category: 'SECURITY',
      status: 'ACTIVE',
      version: 1,
      effectiveDate: new Date(),
      createdById: policyManager.id,
      tags: ['security', 'passwords', 'data-protection'],
    },
  });

  const hrPolicy = await prisma.policy.create({
    data: {
      title: 'Remote Work Policy',
      description: 'Guidelines for employees working from home or remote locations',
      content: `# Remote Work Policy

## Eligibility
Employees may work remotely with manager approval.

## Requirements
- Reliable internet connection
- Secure home office setup
- Availability during core hours (9 AM - 3 PM)

## Equipment
- Company laptop provided
- VPN access required
- Regular security updates

## Communication
- Daily check-ins with team
- Weekly one-on-one with manager
- Prompt response to messages`,
      category: 'HR',
      status: 'ACTIVE',
      version: 1,
      effectiveDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      createdById: policyManager.id,
      tags: ['remote-work', 'hr', 'flexibility'],
    },
  });

  const compliancePolicy = await prisma.policy.create({
    data: {
      title: 'Data Privacy and GDPR Compliance',
      description: 'Data handling procedures to ensure GDPR compliance',
      content: `# Data Privacy and GDPR Compliance

## Data Protection Principles
1. Lawfulness, fairness, and transparency
2. Purpose limitation
3. Data minimization
4. Accuracy
5. Storage limitation
6. Integrity and confidentiality

## Individual Rights
- Right to information
- Right of access
- Right to rectification
- Right to erasure
- Right to restrict processing
- Right to data portability

## Breach Response
All data breaches must be reported within 72 hours.`,
      category: 'COMPLIANCE',
      status: 'ACTIVE',
      version: 1,
      effectiveDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      createdById: adminUser.id,
      tags: ['gdpr', 'privacy', 'compliance', 'data-protection'],
    },
  });

  console.log('✅ Created sample policies');

  // Create policy versions
  await prisma.policyVersion.create({
    data: {
      policyId: securityPolicy.id,
      version: 1,
      content: securityPolicy.content,
      changes: 'Initial version of security policy',
      createdById: policyManager.id,
    },
  });

  await prisma.policyVersion.create({
    data: {
      policyId: hrPolicy.id,
      version: 1,
      content: 'Previous version of remote work policy...',
      changes: 'Updated remote work guidelines',
      createdById: policyManager.id,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    },
  });

  await prisma.policyVersion.create({
    data: {
      policyId: hrPolicy.id,
      version: 1,
      content: hrPolicy.content,
      changes: 'Minor updates to communication requirements',
      createdById: adminUser.id,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
  });

  console.log('✅ Created policy versions');

  // Create policy assignments
  await prisma.policyAssignment.create({
    data: {
      policyId: securityPolicy.id,
      userId: regularUser.id,
    },
  });

  await prisma.policyAssignment.create({
    data: {
      policyId: hrPolicy.id,
      userId: regularUser.id,
      acknowledgedAt: new Date(),
      acknowledgedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  await prisma.policyAssignment.create({
    data: {
      policyId: compliancePolicy.id,
      userId: regularUser.id,
    },
  });

  console.log('✅ Created policy assignments');

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      userId: policyManager.id,
      action: 'CREATE_POLICY',
      entityType: 'Policy',
      entityId: securityPolicy.id,
      details: {
        policyTitle: 'Information Security Policy',
        version: 1,
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'UPDATE_POLICY',
      entityType: 'Policy',
      entityId: hrPolicy.id,
      details: {
        policyTitle: 'Remote Work Policy',
        oldVersion: '2.0',
        newVersion: '2.1',
        changes: ['Updated communication requirements'],
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: regularUser.id,
      action: 'ACKNOWLEDGE_POLICY',
      entityType: 'PolicyAssignment',
      entityId: hrPolicy.id,
      details: {
        policyTitle: 'Remote Work Policy',
        acknowledgedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    },
  });

  console.log('✅ Created audit logs');

  console.log(`
🎉 Database seeding completed successfully!

Default Users Created:
- Admin: admin@policyapp.com (password: admin123)
- Policy Manager: manager@policyapp.com (password: manager123)
- Regular User: user@policyapp.com (password: user123)
- Auditor: auditor@policyapp.com (password: user123)

Sample Policies Created:
- Information Security Policy
- Remote Work Policy
- Data Privacy and GDPR Compliance

You can now log in and explore the application!
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
