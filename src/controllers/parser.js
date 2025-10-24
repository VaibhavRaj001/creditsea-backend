const xml2js = require("xml2js");

/** Safely convert to number */
function safeNumber(v) {
  if (v == null || v === '') return 0;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return isNaN(n) ? 0 : n;
}

/** Safely get string */
function safeString(v) {
  return v ? String(v).trim() : "";
}

/** Format date from YYYYMMDD to DD/MM/YYYY */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const str = String(dateStr).trim();
  if (str.length !== 8) return str;
  
  const year = str.substring(0, 4);
  const month = str.substring(4, 6);
  const day = str.substring(6, 8);
  
  // Validate date components
  if (year === '0001' || day === '00' || month === '00') return "";
  
  return `${day}/${month}/${year}`;
}

/** Map gender codes */
function mapGender(code) {
  const genderMap = {
    '1': 'Male',
    '2': 'Female',
    '3': 'Transgender',
    'M': 'Male',
    'F': 'Female',
    'T': 'Transgender'
  };
  return genderMap[String(code).toUpperCase()] || safeString(code);
}

/** Map account status codes */
function getAccountStatusText(code) {
  const statusMap = {
    '11': 'Active',
    '12': 'Active - Delinquent',
    '13': 'Closed',
    '14': 'Written Off',
    '15': 'Settled',
    '16': 'Post Write-off Settled',
    '17': 'Closed - Transferred',
    '21': 'Active - SMA',
    '22': 'Active - Sub-Standard',
    '23': 'Active - Doubtful',
    '24': 'Active - Loss',
    '31': 'Closed - Written Off',
    '32': 'Closed - Settled',
    '33': 'Closed - Post Write-off Settled',
    '41': 'Wilful Default',
    '51': 'Active - SMA-0',
    '52': 'Active - SMA-1',
    '53': 'Active - SMA-2',
    '54': 'Active - Sub-Standard Asset',
    '55': 'Active - Doubtful Asset - 1',
    '56': 'Active - Doubtful Asset - 2',
    '57': 'Active - Doubtful Asset - 3',
    '58': 'Active - Loss Asset',
    '71': 'Active',
    '78': 'Closed',
    '80': 'Active - Written Off',
    '82': 'Active - Settled',
    '83': 'Active - Post Write-off Settled',
    '84': 'Active - Wilful Default'
  };
  return statusMap[String(code)] || `Status Code ${code}`;
}

/** Map account type codes */
function getAccountTypeText(code) {
  const typeMap = {
    '00': 'Other',
    '01': 'Auto Loan',
    '02': 'Housing Loan',
    '03': 'Property Loan',
    '04': 'Loan Against Shares/Securities',
    '05': 'Personal Loan',
    '06': 'Consumer Loan',
    '07': 'Gold Loan',
    '08': 'Educational Loan',
    '09': 'Loan to Professional',
    '10': 'Credit Card',
    '11': 'Leasing',
    '12': 'Overdraft',
    '13': 'Two-wheeler Loan',
    '14': 'Non-Funded Credit Facility',
    '15': 'Loan on Bank Deposits',
    '16': 'Fleet Card',
    '17': 'Commercial Vehicle Loan',
    '18': 'Telco - Wireless',
    '19': 'Telco - Broadband',
    '20': 'Telco - Landline',
    '31': 'Secured Credit Card',
    '32': 'Used Car Loan',
    '33': 'Construction Equipment Loan',
    '34': 'Tractor Loan',
    '35': 'Corporate Credit Card',
    '36': 'Kisan Credit Card',
    '37': 'Loan on Credit Card',
    '38': 'Prime Minister Jaan Dhan Yojana - Overdraft',
    '39': 'Mudra Loans - Shishu / Kishor / Tarun',
    '40': 'Microfinance - Business Loan',
    '41': 'Microfinance - Personal Loan',
    '42': 'Microfinance - Housing Loan',
    '43': 'Microfinance - Others',
    '44': 'Pradhan Mantri Awas Yojana - MAY',
    '45': 'P2P Personal Loan',
    '46': 'P2P Auto Loan',
    '47': 'P2P Education Loan',
    '51': 'Business Loan - General',
    '52': 'Business Loan - Priority Sector - Small Business',
    '53': 'Business Loan - Priority Sector - Agriculture',
    '54': 'Business Loan - Priority Sector - Others',
    '55': 'Business Non-Funded Credit Facility - General',
    '56': 'Business Non-Funded Credit Facility - Priority Sector - Small Business',
    '57': 'Business Non-Funded Credit Facility - Priority Sector - Agriculture',
    '58': 'Business Non-Funded Credit Facility - Priority Sector - Others',
    '59': 'Business Loan Against Bank Deposits',
    '61': 'Business Loan - Unsecured'
  };
  return typeMap[String(code)] || `Account Type ${code}`;
}

/** Map portfolio type codes */
function getPortfolioTypeText(code) {
  const portfolioMap = {
    'C': 'Cash',
    'R': 'Revolving',
    'I': 'Installment',
    'M': 'Mortgage',
    'O': 'Open',
    'U': 'Unsecured',
    'S': 'Secured',
    'X': 'Not Categorized'
  };
  return portfolioMap[String(code).toUpperCase()] || safeString(code);
}

/** Map account holder type */
function mapAccountHolderType(code) {
  const holderMap = {
    '1': 'Individual',
    '2': 'Authorized User',
    '3': 'Guarantor',
    '4': 'Joint',
    '5': 'Deceased'
  };
  return holderMap[String(code)] || `Holder Type ${code}`;
}

/** Map payment rating */
function mapPaymentRating(rating) {
  const ratingMap = {
    '0': 'Standard/Current',
    '1': '1-30 days overdue',
    '2': '31-60 days overdue',
    '3': '61-90 days overdue',
    '4': '91-120 days overdue',
    '5': '121-150 days overdue',
    '6': '151-180 days overdue',
    '7': '180+ days overdue',
    '8': 'Written off',
    '9': 'Settled'
  };
  return ratingMap[String(rating)] || rating;
}

/** Map enquiry purpose */
function mapEnquiryPurpose(code) {
  const purposeMap = {
    '1': 'Personal Loan',
    '2': 'Auto Loan',
    '3': 'Housing Loan',
    '4': 'Credit Card',
    '5': 'Business Loan',
    '6': 'Consumer Loan',
    '7': 'Gold Loan',
    '8': 'Educational Loan',
    '9': 'Commercial Vehicle Loan',
    '10': 'Microfinance',
    '00': 'Other',
    'XX': 'Not Categorized'
  };
  return purposeMap[String(code)] || `Purpose ${code}`;
}

/** Map state codes to names */
function mapStateCode(code) {
  const stateMap = {
    '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab',
    '04': 'Chandigarh', '05': 'Uttarakhand', '06': 'Haryana',
    '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
    '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
    '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram',
    '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam',
    '19': 'West Bengal', '20': 'Jharkhand', '21': 'Odisha',
    '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
    '25': 'Daman & Diu', '26': 'Dadra & Nagar Haveli', '27': 'Maharashtra',
    '28': 'Andhra Pradesh', '29': 'Karnataka', '30': 'Goa',
    '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu',
    '34': 'Puducherry', '35': 'Andaman & Nicobar Islands', '36': 'Telangana',
    '37': 'Andhra Pradesh (New)'
  };
  return stateMap[String(code)] || code;
}

/** Safely access nested object properties */
function safeGet(obj, path, defaultValue = null) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
}

/**
 * Production-ready Experian XML parser
 * Handles all variations and edge cases
 */
async function parseExperianXml(xmlString) {
  try {
    const parser = new xml2js.Parser({ 
      explicitArray: false, 
      mergeAttrs: true,
      trim: true,
      normalize: true,
      normalizeTags: false
    });
    
    const result = await parser.parseStringPromise(xmlString);
    const root = result?.INProfileResponse || result?.EXPERIAN || result?.CreditReport || result;

    // ---------------- BASIC DETAILS ----------------
    const applicant = safeGet(root, 'Current_Application.Current_Application_Details.Current_Applicant_Details', {});
    
    // Try multiple possible locations for first account holder details as fallback
    const firstAccountHolder = (() => {
      const caisDetails = root?.CAIS_Account?.CAIS_Account_DETAILS;
      const firstAccount = Array.isArray(caisDetails) ? caisDetails[0] : caisDetails;
      return firstAccount?.CAIS_Holder_Details || {};
    })();

    const basicDetails = {
      name: [
        applicant?.First_Name || firstAccountHolder?.First_Name_Non_Normalized,
        applicant?.Middle_Name1 || applicant?.Middle_Name_1 || firstAccountHolder?.Middle_Name_1_Non_Normalized,
        applicant?.Middle_Name2 || applicant?.Middle_Name_2,
        applicant?.Middle_Name3 || applicant?.Middle_Name_3,
        applicant?.Last_Name || firstAccountHolder?.Surname_Non_Normalized,
      ]
        .filter(Boolean)
        .join(" ")
        .trim() || "Name Not Available",
      dateOfBirth: formatDate(applicant?.Date_Of_Birth_Applicant || firstAccountHolder?.Date_of_birth),
      gender: mapGender(applicant?.Gender_Code || applicant?.Gender || firstAccountHolder?.Gender_Code),
      mobile: safeString(applicant?.MobilePhoneNumber || applicant?.Mobile_Phone_Number),
      email: safeString(applicant?.EMailId || applicant?.Email_Id),
      pan: safeString(applicant?.IncomeTaxPan || applicant?.Income_TAX_PAN || firstAccountHolder?.Income_TAX_PAN),
      passportNumber: safeString(applicant?.Passport_number || applicant?.Passport_Number),
      voterID: safeString(applicant?.Voter_s_Identity_Card || applicant?.Voter_ID_Number),
      drivingLicense: safeString(applicant?.Driver_License_Number),
      rationCard: safeString(applicant?.Ration_Card_Number),
      uidNumber: safeString(applicant?.Universal_ID_Number),
    };

    // ---------------- CREDIT SCORE ----------------
    const scoreInfo = root?.SCORE || root?.Score || {};
    const creditScore = {
      bureauScore: safeNumber(scoreInfo?.BureauScore || scoreInfo?.Bureau_Score),
      scoreName: safeString(scoreInfo?.ScoreName || scoreInfo?.Score_Name),
      scoreDate: formatDate(scoreInfo?.ScoreDate || scoreInfo?.Score_Date),
      scoreCardName: safeString(scoreInfo?.ScoreCardName || scoreInfo?.Score_Card_Name),
      scoreCardVersion: safeString(scoreInfo?.ScoreCardVersion),
      confidenceLevel: safeString(scoreInfo?.BureauScoreConfidLevel || scoreInfo?.Score_Confid_Level),
      reasonCodes: (() => {
        const codes = scoreInfo?.ReasonCode || scoreInfo?.Reason_Code;
        if (!codes) return [];
        return Array.isArray(codes) ? codes.map(r => safeString(r)) : [safeString(codes)];
      })(),
    };

    // ---------------- REPORT SUMMARY ----------------
    const summary = safeGet(root, 'CAIS_Account.CAIS_Summary.Credit_Account', {});
    const balance = safeGet(root, 'CAIS_Account.CAIS_Summary.Total_Outstanding_Balance', {});
    const caps = root?.TotalCAPS_Summary || root?.Total_CAPS_Summary || {};

    const reportSummary = {
      totalAccounts: safeNumber(summary?.CreditAccountTotal || summary?.Credit_Account_Total),
      activeAccounts: safeNumber(summary?.CreditAccountActive || summary?.Credit_Account_Active),
      closedAccounts: safeNumber(summary?.CreditAccountClosed || summary?.Credit_Account_Closed),
      defaultAccounts: safeNumber(summary?.CreditAccountDefault || summary?.Credit_Account_Default),
      overdueAccounts: safeNumber(summary?.CreditAccountOverdue),
      currentBalance: safeNumber(balance?.Outstanding_Balance_All || balance?.Total_Outstanding_Balance),
      securedAmount: safeNumber(balance?.Outstanding_Balance_Secured),
      unsecuredAmount: safeNumber(balance?.Outstanding_Balance_UnSecured),
      securedPercentage: safeNumber(balance?.Outstanding_Balance_Secured_Percentage),
      unsecuredPercentage: safeNumber(balance?.Outstanding_Balance_UnSecured_Percentage),
      zeroBalanceAccounts: safeNumber(summary?.CreditAccountZeroBalance),
      last7DaysEnquiries: safeNumber(caps?.TotalCAPSLast7Days || caps?.Total_CAPS_Last_7_Days),
      last30DaysEnquiries: safeNumber(caps?.TotalCAPSLast30Days || caps?.Total_CAPS_Last_30_Days),
      last90DaysEnquiries: safeNumber(caps?.TotalCAPSLast90Days || caps?.Total_CAPS_Last_90_Days),
      last180DaysEnquiries: safeNumber(caps?.TotalCAPSLast180Days || caps?.Total_CAPS_Last_180_Days),
      last365DaysEnquiries: safeNumber(caps?.TotalCAPSLast365Days || caps?.Total_CAPS_Last_365_Days),
    };

    // ---------------- ACCOUNT DETAILS ----------------
    const caisDetails = root?.CAIS_Account?.CAIS_Account_DETAILS || root?.CAIS_Account?.CAIS_Account_Details;
    const caisArray = Array.isArray(caisDetails) ? caisDetails : (caisDetails ? [caisDetails] : []);

    const accounts = caisArray.map((a) => {
      const holder = a?.CAIS_Holder_Details || a?.CAIS_Holder_Id_Details || {};
      const address = a?.CAIS_Holder_Address_Details || {};
      const phone = a?.CAIS_Holder_Phone_Details || {};
      
      const accountHistory = a?.CAIS_Account_History;
      const historyArray = Array.isArray(accountHistory) ? accountHistory : (accountHistory ? [accountHistory] : []);

      const accountTypeCode = safeString(a?.Account_Type);
      const portfolioTypeCode = safeString(a?.Portfolio_Type);
      const statusCode = safeString(a?.Account_Status);

      return {
        // Basic Account Info
        subscriberName: safeString(a?.Subscriber_Name).replace(/^\s+/, ''),
        accountNumber: safeString(a?.Account_Number),
        accountType: getAccountTypeText(accountTypeCode),
        accountTypeCode: accountTypeCode,
        portfolioType: getPortfolioTypeText(portfolioTypeCode),
        portfolioTypeCode: portfolioTypeCode,
        ownershipIndicator: mapAccountHolderType(a?.AccountHoldertypeCode || a?.Account_Holder_type_Code),
        ownershipCode: safeString(a?.AccountHoldertypeCode || a?.Account_Holder_type_Code),
        
        // Dates
        openDate: formatDate(a?.Open_Date),
        dateReported: formatDate(a?.Date_Reported),
        dateClosed: formatDate(a?.Date_Closed),
        dateOfLastPayment: formatDate(a?.Date_of_Last_Payment),
        dateOfFirstDelinquency: formatDate(a?.Date_of_First_Delinquency),
        dateOfAddition: formatDate(a?.DateOfAddition || a?.Date_Of_Addition),
        
        // Financial Info
        currentBalance: safeNumber(a?.Current_Balance),
        amountOverdue: safeNumber(a?.Amount_Past_Due || a?.Amount_Overdue),
        creditLimit: safeNumber(a?.Credit_Limit_Amount || a?.Highest_Credit_or_Original_Loan_Amount),
        highestCredit: safeNumber(a?.Highest_Credit_or_Original_Loan_Amount),
        sanctionedAmount: safeNumber(a?.Sanctioned_Amount),
        drawingPower: safeNumber(a?.Drawing_Power),
        emi: safeNumber(a?.Scheduled_Monthly_Payment_Amount || a?.EMI_Amount),
        
        // Status & Rating
        accountStatus: getAccountStatusText(statusCode),
        accountStatusCode: statusCode,
        paymentRating: safeString(a?.Payment_Rating),
        paymentRatingDescription: mapPaymentRating(a?.Payment_Rating),
        paymentHistory: safeString(a?.Payment_History_Profile),
        paymentHistoryStartDate: formatDate(a?.Payment_History_Start_Date),
        paymentHistoryEndDate: formatDate(a?.Payment_History_End_Date),
        
        // Legal & Write-off Info
        suitFiled: safeString(a?.SuitFiled_WilfulDefault || a?.Suit_Filed_Wilful_Default) === '01' ? 'Yes' : safeString(a?.SuitFiled_WilfulDefault) === '02' ? 'No' : 'Unknown',
        suitFiledAmount: safeNumber(a?.Suit_Filed_Amount),
        wilfulDefault: safeString(a?.Wilful_Default),
        writtenOffStatus: safeString(a?.Written_off_Settled_Status),
        writtenOffAmount: safeNumber(a?.Written_Off_Amt_Total),
        writtenOffPrincipal: safeNumber(a?.Written_Off_Amt_Principal),
        settlementAmount: safeNumber(a?.Settlement_Amount),
        
        // Loan Details
        interestRate: safeNumber(a?.Rate_of_Interest || a?.Interest_Rate),
        repaymentTenure: safeNumber(a?.Repayment_Tenure),
        termsDuration: safeNumber(a?.Terms_Duration),
        paymentFrequency: safeString(a?.Terms_Frequency || a?.Payment_Frequency),
        
        // Collateral Info
        collateralType: safeString(a?.Type_of_Collateral || a?.Collateral_Type),
        collateralValue: safeNumber(a?.Value_of_Collateral),
        
        // Additional Info
        specialComment: safeString(a?.Special_Comment),
        subscriberComments: safeString(a?.Subscriber_comments),
        consumerComments: safeString(a?.Consumer_comments),
        currencyCode: safeString(a?.CurrencyCode || a?.Currency_Code),
        
        // Account History
        accountHistory: historyArray.map(h => ({
          year: safeString(h?.Year),
          month: safeString(h?.Month),
          daysPastDue: safeNumber(h?.Days_Past_Due),
          assetClassification: safeString(h?.Asset_Classification),
          balance: safeNumber(h?.Balance),
          paymentStatus: safeString(h?.Payment_Status),
        })),
        
        // Holder Details
        holderDetails: {
          firstName: safeString(holder?.First_Name_Non_Normalized || holder?.First_Name),
          middleName: safeString(holder?.Middle_Name_1_Non_Normalized || holder?.Middle_Name_1),
          lastName: safeString(holder?.Surname_Non_Normalized || holder?.Surname),
          fullName: [
            safeString(holder?.First_Name_Non_Normalized || holder?.First_Name),
            safeString(holder?.Middle_Name_1_Non_Normalized || holder?.Middle_Name_1),
            safeString(holder?.Middle_Name_2_Non_Normalized || holder?.Middle_Name_2),
            safeString(holder?.Middle_Name_3_Non_Normalized || holder?.Middle_Name_3),
            safeString(holder?.Surname_Non_Normalized || holder?.Surname),
          ].filter(Boolean).join(' '),
          pan: safeString(holder?.Income_TAX_PAN || holder?.Income_Tax_PAN),
          dateOfBirth: formatDate(holder?.Date_of_birth || holder?.Date_Of_Birth),
          gender: mapGender(holder?.Gender_Code || holder?.Gender),
          alias: safeString(holder?.Alias),
        },
        
        // Address Details
        addressDetails: {
          fullAddress: [
            safeString(address?.First_Line_Of_Address_non_normalized || address?.Address_Line_1),
            safeString(address?.Second_Line_Of_Address_non_normalized || address?.Address_Line_2),
            safeString(address?.Third_Line_Of_Address_non_normalized || address?.Address_Line_3),
            safeString(address?.Fourth_Line_Of_Address_non_normalized || address?.Address_Line_4),
            safeString(address?.Fifth_Line_Of_Address_non_normalized || address?.Address_Line_5),
            safeString(address?.City_non_normalized || address?.City),
            mapStateCode(address?.State_non_normalized || address?.State),
            safeString(address?.ZIP_Postal_Code_non_normalized || address?.Postal_Code || address?.PIN_Code),
          ].filter(Boolean).join(", "),
          addressLine1: safeString(address?.First_Line_Of_Address_non_normalized || address?.Address_Line_1),
          addressLine2: safeString(address?.Second_Line_Of_Address_non_normalized || address?.Address_Line_2),
          addressLine3: safeString(address?.Third_Line_Of_Address_non_normalized || address?.Address_Line_3),
          city: safeString(address?.City_non_normalized || address?.City),
          state: mapStateCode(address?.State_non_normalized || address?.State),
          stateCode: safeString(address?.State_non_normalized || address?.State),
          pinCode: safeString(address?.ZIP_Postal_Code_non_normalized || address?.Postal_Code || address?.PIN_Code),
          country: safeString(address?.CountryCode_non_normalized || address?.Country_Code),
          category: safeString(address?.Address_indicator_non_normalized || address?.Address_Category),
          residenceCode: safeString(address?.Residence_code_non_normalized || address?.Residence_Code),
        },
        
        // Phone Details
        phoneDetails: {
          telephone: safeString(phone?.Telephone_Number),
          mobile: safeString(phone?.Mobile_Telephone_Number || phone?.Mobile_Number),
          fax: safeString(phone?.FaxNumber || phone?.Fax_Number),
          email: safeString(phone?.EMailId || phone?.Email_Id),
        },
      };
    });

    // ---------------- CREDIT CARDS & BANKS ----------------
    // Credit cards: Account Type = 10, 31 (Secured Credit Card), 35 (Corporate Credit Card)
    const creditCardTypes = ['10', '31', '35'];
    const creditCards = accounts.filter(a => creditCardTypes.includes(a.accountTypeCode));
    const banksOfCreditCards = [...new Set(creditCards.map(a => a.subscriberName).filter(Boolean))];

    // ---------------- ADDRESS LIST (Unique) ----------------
    const allAddresses = [...new Set(accounts.map(a => a.addressDetails.fullAddress).filter(Boolean))];

    // ---------------- ENQUIRIES (CAPS) ----------------
    const capsEnquiry = root?.CAPS?.CAPS_Application_Details || 
                       root?.CAPS_Enquiry || 
                       root?.CAPS?.CAPS_Details;
    const capsArray = Array.isArray(capsEnquiry) ? capsEnquiry : (capsEnquiry ? [capsEnquiry] : []);

    const creditEnquiries = capsArray.map((e) => ({
      enquiryDate: formatDate(e?.Date_Of_Application || e?.Enquiry_Date || e?.Application_Date),
      enquiryPurpose: mapEnquiryPurpose(e?.Enquiry_Reason || e?.Enquiry_Purpose),
      enquiryPurposeCode: safeString(e?.Enquiry_Reason || e?.Enquiry_Purpose),
      enquiryAmount: safeNumber(e?.Amount_Financed || e?.Enquiry_Amount),
      subscriber: safeString(e?.Subscriber_Name || e?.Member_Name).replace(/^\s+/, ''),
      subscriberCode: safeString(e?.Member_Short_Name || e?.Subscriber_Code),
      enquiryStage: safeString(e?.Enquiry_Stage),
      creditType: safeString(e?.Credit_Type),
    }));

    // ---------------- FINAL STRUCTURED OUTPUT ----------------
    return {
      basicDetails,
      creditScore,
      reportSummary,
      creditAccountsInformation: {
        totalCreditCards: creditCards.length,
        banksOfCreditCards,
        addresses: allAddresses,
        accounts,
      },
      creditEnquiries,
      // Metadata
      metadata: {
        reportDate: formatDate(root?.Header?.ReportDate || root?.CreditProfileHeader?.ReportDate),
        reportTime: safeString(root?.Header?.ReportTime || root?.CreditProfileHeader?.ReportTime),
        reportNumber: safeString(root?.CreditProfileHeader?.ReportNumber || root?.Header?.ReportNumber),
        version: safeString(root?.CreditProfileHeader?.Version),
        enquiryReason: mapEnquiryPurpose(safeGet(root, 'Current_Application.Current_Application_Details.Enquiry_Reason')),
      }
    };
  } catch (error) {
    console.error('Error parsing Experian XML:', error);
    throw new Error(`Failed to parse XML: ${error.message}`);
  }
}

module.exports = { parseExperianXml };