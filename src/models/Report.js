const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  basicDetails: {
    name: String,
    dateOfBirth: String,
    gender: String,
    mobile: String,
    email: String,
    pan: String,
    passportNumber: String,
    voterID: String,
    drivingLicense: String,
    rationCard: String,
    uidNumber: String
  },
  creditScore: {
    bureauScore: Number,
    scoreName: String,
    scoreDate: String,
    scoreCardName: String,
    scoreCardVersion: String,
    confidenceLevel: String,
    reasonCodes: [String]
  },
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    defaultAccounts: Number,
    overdueAccounts: Number,
    currentBalance: Number,
    securedAmount: Number,
    unsecuredAmount: Number,
    securedPercentage: Number,
    unsecuredPercentage: Number,
    zeroBalanceAccounts: Number,
    last7DaysEnquiries: Number,
    last30DaysEnquiries: Number,
    last90DaysEnquiries: Number,
    last180DaysEnquiries: Number,
    last365DaysEnquiries: Number
  },
  creditAccountsInformation: {
    totalCreditCards: Number,
    banksOfCreditCards: [String],
    addresses: [String],
    accounts: [{
      subscriberName: String,
      accountNumber: String,
      accountType: String,
      accountTypeCode: String,
      portfolioType: String,
      portfolioTypeCode: String,
      ownershipIndicator: String,
      ownershipCode: String,
      openDate: String,
      dateReported: String,
      dateClosed: String,
      dateOfLastPayment: String,
      dateOfFirstDelinquency: String,
      dateOfAddition: String,
      currentBalance: Number,
      amountOverdue: Number,
      creditLimit: Number,
      highestCredit: Number,
      sanctionedAmount: Number,
      drawingPower: Number,
      emi: Number,
      accountStatus: String,
      accountStatusCode: String,
      paymentRating: String,
      paymentRatingDescription: String,
      paymentHistory: String,
      paymentHistoryStartDate: String,
      paymentHistoryEndDate: String,
      suitFiled: String,
      suitFiledAmount: Number,
      wilfulDefault: String,
      writtenOffStatus: String,
      writtenOffAmount: Number,
      writtenOffPrincipal: Number,
      settlementAmount: Number,
      interestRate: Number,
      repaymentTenure: Number,
      termsDuration: Number,
      paymentFrequency: String,
      collateralType: String,
      collateralValue: Number,
      specialComment: String,
      subscriberComments: String,
      consumerComments: String,
      currencyCode: String,
      accountHistory: [{
        year: String,
        month: String,
        daysPastDue: Number,
        assetClassification: String,
        balance: Number,
        paymentStatus: String
      }],
      holderDetails: {
        firstName: String,
        middleName: String,
        lastName: String,
        fullName: String,
        pan: String,
        dateOfBirth: String,
        gender: String,
        alias: String
      },
      addressDetails: {
        fullAddress: String,
        addressLine1: String,
        addressLine2: String,
        addressLine3: String,
        city: String,
        state: String,
        stateCode: String,
        pinCode: String,
        country: String,
        category: String,
        residenceCode: String
      },
      phoneDetails: {
        telephone: String,
        mobile: String,
        fax: String,
        email: String
      }
    }]
  },
  creditEnquiries: [{
    enquiryDate: String,
    enquiryPurpose: String,
    enquiryPurposeCode: String,
    enquiryAmount: Number,
    subscriber: String,
    subscriberCode: String,
    enquiryStage: String,
    creditType: String
  }],
  metadata: {
    reportDate: String,
    reportTime: String,
    reportNumber: String,
    version: String,
    enquiryReason: String
  },
  sourceFileName: String,
  uploadedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add indexes for better query performance
reportSchema.index({ 'basicDetails.pan': 1 });
reportSchema.index({ 'basicDetails.name': 1 });
reportSchema.index({ uploadedAt: -1 });
reportSchema.index({ 'creditScore.bureauScore': 1 });

module.exports = mongoose.model('Report', reportSchema);