// AssistantAI 2.0 Configuration
const CONFIG = {
  // Vertesia API Settings
  api: {
    endpoint: 'https://api.vertesia.io/api/v1',
    key: 'sk-773875c9d651f7b4fadb1a491577c017',
    interactionId: '682cd4f06d3140ec92cf2b2b', // Your RetAgentV2 interaction
    environmentId: '681915c6a01fb262a410c161'
  },
  
  // Client Data
  clients: {
    'james-jackson': {
      id: 'james-jackson',
      clientId: 'P00051',
      name: 'James Jackson',
      company: 'Texas University',
      accountType: 'UT Saver TSA 403(b)',
      birthDate: '1990-05-12',
      age: 35,
      avatar: 'JJ',
      balance: '$127,000',
      status: 'active'
    },
    'eleanor-chen': {
      id: 'eleanor-chen',
      clientId: 'P00087',
      name: 'Dr. Eleanor Chen',
      company: 'Harvard University',
      accountType: 'Harvard TDA 403(b)',
      birthDate: '1975-03-22',
      age: 48,
      avatar: 'EC',
      balance: '$342,000',
      status: 'archived'
    }
  },
  
  // Archived conversation remains the same...
  archivedConversation: {
    messages: [
      {
        content: "I'm looking to borrow from my 403(b) account. What are my options?",
        isUser: true,
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        content: `Based on Dr. Eleanor Chen's Harvard TDA 403(b) plan:

**Loan Eligibility**: Yes, participant loans are permitted
**Maximum Amount**: $50,000 or 50% of vested balance (whichever is less)
**Current Vested Balance**: $342,000
**Maximum Loan Available**: $50,000

**Key Requirements**:
- Minimum loan amount: $1,000
- Maximum repayment period: 5 years (extended for primary residence)
- Interest rate: Prime Rate + 1% (currently 8.5%)
- Repayment: Automated payroll deduction required

**Important Considerations**:
- Outstanding loans reduce death benefit
- Default triggers taxable distribution
- Cannot borrow if previous loan in default

*Source: Harvard University Retirement Plan Document, Article VII, Section 7.2*`,
        isUser: false,
        timestamp: new Date(Date.now() - 3300000)
      },
      {
        content: "What happens if I leave Harvard before repaying the loan?",
        isUser: true,
        timestamp: new Date(Date.now() - 3000000)
      },
      {
        content: `Upon termination of employment with Harvard University:

**Loan Acceleration**: The entire outstanding balance becomes due
**Grace Period**: 90 days to repay in full
**Default Consequences**: 
- Unpaid balance treated as taxable distribution
- Additional 10% early withdrawal penalty if under age 59½
- 1099-R issued for tax reporting

**Options Available**:
1. **Full Repayment**: Pay outstanding balance within 90 days
2. **Rollover**: Some plans accept loans - verify with new employer
3. **Continue Payments**: May be possible if plan allows (rare)

**Recommendation**: Contact Harvard Benefits Office before separation to discuss options. Consider loan timing carefully if job change is anticipated.

*Reference: Harvard TDA Plan Loan Policy, Section 7.5 - Termination Provisions*`,
        isUser: false,
        timestamp: new Date(Date.now() - 2700000)
      }
    ]
  },
  
  demo: {
    incomingCallDelay: 3000
  }
};

console.log('CONFIG loaded:', {
  hasEndpoint: !!CONFIG.api.endpoint,
  hasKey: !!CONFIG.api.key,
  hasInteractionId: !!CONFIG.api.interactionId
});
