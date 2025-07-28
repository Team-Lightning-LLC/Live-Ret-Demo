// Client data
const clients = {
  'james-jackson': {
    id: 'james-jackson',
    clientId: 'P00051',
    name: 'James Jackson',
    company: 'Texas University',
    accountType: 'UT Saver TSA 403(b)',
    birthDate: '1990-05-12',
    age: 35,
    avatar: 'JJ'
  },
  'eleanor-chen': {
    id: 'eleanor-chen',
    name: 'Dr. Eleanor Chen',
    company: 'Harvard University',
    accountType: 'Harvard TDA 403(b)',
    avatar: 'EC'
  },
  'jessica-holmes': {
    id: 'jessica-holmes',
    clientId: 'P00020',
    name: 'Jessica Holmes',
    company: 'UT System',
    accountType: 'UT System Cash Balance Plan',
    avatar: 'JH'
  },
  'blank': {
    id: 'blank',
    name: 'New Client',
    company: 'Company Name',
    accountType: 'Account Type',
    avatar: 'NC'
  }
};

// Predefined AI responses
const aiResponses = {
  'james-jackson': {
    'borrowing': `
      <div class="ai-response">
        <div class="response-header">
          <strong>Answer</strong>
        </div>
        <p>James, based on your UT Saver TSA 403(b) plan, you can borrow up to <strong>$50,000 or 50% of your vested account balance, whichever is less</strong>. The minimum loan amount isn't explicitly stated in your plan document, but is typically $1,000 for most 403(b) plans.</p>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Next Steps</strong>
          </div>
          <ol>
            <li>Contact your plan provider to request a loan application</li>
            <li>Complete the loan application form</li>
            <li>Submit the completed application to your plan administrator</li>
            <li>Once approved, receive loan proceeds</li>
            <li>Begin repayment according to the terms established in your loan agreement</li>
          </ol>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Reminders</strong>
          </div>
          <ul>
            <li>Outstanding loans reduce maximum borrowing amount</li>
            <li>Loans must be repaid with interest</li>
            <li>Early repayment may be available without penalty</li>
          </ul>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Citations</strong>
          </div>
          <ul class="citations">
            <li>tsa-plandoc-2022.pdf (Maximum loan amount: $50,000 or 50% of vested account balance)</li>
            <li>retirement_programs_spd.pdf (General loan provisions for 403(b) plans)</li>
          </ul>
        </div>
      </div>
    `
  },
  'eleanor-chen': {
    'borrowing': `
      <div class="ai-response">
        <div class="response-header">
          <strong>Answer</strong>
        </div>
        <p>Dr. Chen, based on your Harvard TDA - 403(b) plan, you can borrow a <strong>minimum of $1,000 up to a maximum of 50% of your account balance, not to exceed $50,000</strong>. The $50,000 limit would be reduced if you've had any other TDA loans outstanding in the past 12 months. You're currently showing no active loans in our system.</p>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Next Steps</strong>
          </div>
          <ol>
            <li>Verify loan eligibility (must be actively employed)</li>
            <li>Determine maximum loan amount (50% of TDA accumulations, up to $50,000)</li>
            <li>Select loan type (general-purpose or residential)</li>
            <li>Complete loan application with spousal consent if married</li>
            <li>Pay applicable loan fees ($75 for general-purpose, $125 for residential)</li>
          </ol>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Reminders</strong>
          </div>
          <ul>
            <li>Maximum of two outstanding loans allowed</li>
            <li>Loan repayment period: 5 years (general) or 10 years (residential)</li>
            <li>$25 annual maintenance fee applies</li>
          </ul>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Citations</strong>
          </div>
          <ul class="citations">
            <li>Harvard University Tax-Deferred Annuity (TDA) Plan Summary Plan Description</li>
            <li>Synthetic Participant Database (P00052 - Dr. Eleanor Chen)</li>
          </ul>
        </div>
      </div>
    `
  },
  'jessica-holmes': {
    'death-benefits': `
      <div class="ai-response">
        <div class="response-header">
          <strong>Answer</strong>
        </div>
        <p>Ms. Holmes, I understand you're dealing with the loss of your uncle. Based on your UT System Cash Balance Plan, there are specific procedures we must follow for death benefits. <strong>While you have power of attorney, this doesn't automatically authorize withdrawal of retirement funds after death, as POA authority typically ends at death</strong>. The account would need to go through proper beneficiary claim procedures.</p>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Next Steps</strong>
          </div>
          <ol>
            <li>Submit certified death certificate and estate documentation to verify your legal standing</li>
            <li>Complete beneficiary claim forms identifying you as the designated beneficiary or estate representative</li>
            <li>Review distribution options - lump sum or periodic payments</li>
            <li>If eligible for distribution, complete withholding election forms</li>
            <li>Receive distribution after processing (typically 7-10 business days after complete documentation)</li>
          </ol>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Reminders</strong>
          </div>
          <ul>
            <li>POA authority ends at death</li>
            <li>Death certificate required before any distribution</li>
            <li>No early withdrawal penalty exception for transferring to your 401(k)</li>
          </ul>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Citations</strong>
          </div>
          <ul class="citations">
            <li>INFOWAVE Estate Planning Document: "Temporary restriction placed on account immediately upon death notification"</li>
            <li>403(b) Plan Document: "When a Participant dies, the entire interest must be distributed to the Beneficiary according to specific timeframes"</li>
            <li>Harvard University Retirement Plan Distribution Guide: "The benefit is paid at your death to your beneficiary"</li>
          </ul>
        </div>
      </div>
    `,
    'rollover': `
      <div class="ai-response">
        <div class="response-header">
          <strong>Answer</strong>
        </div>
        <p>Ms. Holmes, <strong>as a non-spouse beneficiary of your uncle's 403(b), IRS regulations do not permit you to roll these funds directly into your personal 401(k)</strong>. The inherited 403(b) must remain a separate account designated as an "Inherited 403(b)" with its own distribution rules. You would need to take distributions from the inherited account according to the beneficiary rules.</p>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Next Steps</strong>
          </div>
          <ol>
            <li>Establish an inherited 403(b) account in your name as beneficiary</li>
            <li>Select distribution method that complies with IRS requirements (typically complete distribution within 10 years)</li>
            <li>Review distribution options - lump sum or periodic payments</li>
            <li>Separately contribute to your own 401(k) from personal funds if desired, subject to your plan's contribution limits</li>
          </ol>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Reminders</strong>
          </div>
          <ul>
            <li>Non-spouse beneficiaries cannot combine inherited accounts with personal retirement accounts</li>
            <li>Distributions from inherited accounts are generally taxable</li>
            <li>Death certificate and beneficiary verification required before any action</li>
          </ul>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Citations</strong>
          </div>
          <ul class="citations">
            <li>403(b) Plan Document: "A direct rollover of a distribution from a deceased Participant's account to an inherited IRA is permitted for non-spouse Beneficiaries"</li>
            <li>Harvard University Retirement Plan Distribution Guide: "Beneficiary distribution options depend on relationship to deceased"</li>
          </ul>
        </div>
      </div>
    `
  }
};

// Generate AI response based on message content and client
function generateAIResponse(message, clientId) {
  const lowerMessage = message.toLowerCase();
  
  // Check for rollover/transfer questions first (more specific)
  if (lowerMessage.includes('move') && (lowerMessage.includes('401k') || lowerMessage.includes('401(k)'))) {
    return aiResponses[clientId]?.['rollover'] || getGenericResponse();
  }
  
  // Check for death benefits/inheritance questions
  if (lowerMessage.includes('death') || lowerMessage.includes('died') || lowerMessage.includes('uncle') || 
      lowerMessage.includes('funeral') || lowerMessage.includes('inheritance') || lowerMessage.includes('estate') ||
      lowerMessage.includes('power of attorney') || lowerMessage.includes('beneficiary')) {
    return aiResponses[clientId]?.['death-benefits'] || getGenericResponse();
  }
  
  // Check for borrowing/loan questions
  if (lowerMessage.includes('borrow') || lowerMessage.includes('loan') || lowerMessage.includes('403b')) {
    return aiResponses[clientId]?.['borrowing'] || getGenericResponse();
  }
  
  return getGenericResponse();
}

function getGenericResponse() {
  return `
    <div class="ai-response">
      <div class="response-header">
        <strong>Answer</strong>
      </div>
      <p>I'd be happy to help you with that question. Based on the client's plan details, let me provide you with the most relevant information.</p>
      
      <div class="response-section">
        <div class="section-header">
          <strong>Recommendations</strong>
        </div>
        <ul>
          <li>Review the specific plan documentation for detailed provisions</li>
          <li>Consider scheduling a follow-up consultation if additional details are needed</li>
          <li>Ensure all regulatory compliance requirements are met</li>
        </ul>
      </div>
    </div>
  `;
}
