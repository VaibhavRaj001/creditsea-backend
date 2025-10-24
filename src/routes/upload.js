const express = require('express');
const multer = require('multer');
const router = express.Router();
const { parseExperianXml } = require('../controllers/parser');
const Report = require('../models/Report');

const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 10 * 1024 * 1024 } // Increased to 10MB
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!req.file.originalname.match(/\.xml$/i)) {
      return res.status(400).json({ error: 'Only XML files allowed' });
    }

    console.log('=== UPLOAD STARTED ===');
    console.log('File:', req.file.originalname);
    console.log('Size:', req.file.size, 'bytes');

    const xmlString = req.file.buffer.toString('utf8');
    const parsed = await parseExperianXml(xmlString);

    console.log('=== PARSED DATA ===');
    console.log('Name:', parsed.basicDetails?.name);
    console.log('Credit Score:', parsed.creditScore?.bureauScore);
    console.log('Total Accounts:', parsed.creditAccountsInformation?.accounts?.length);
    console.log('Credit Cards:', parsed.creditAccountsInformation?.totalCreditCards);
    console.log('Enquiries:', parsed.creditEnquiries?.length);

    const report = new Report({
      basicDetails: parsed.basicDetails,
      creditScore: parsed.creditScore,
      reportSummary: parsed.reportSummary,
      creditAccountsInformation: parsed.creditAccountsInformation,
      creditEnquiries: parsed.creditEnquiries,
      metadata: parsed.metadata,
      sourceFileName: req.file.originalname
    });

    await report.save();
    
    // Verify what was saved
    const savedReport = await Report.findById(report._id);
    console.log('=== SAVED TO DATABASE ===');
    console.log('Report ID:', savedReport._id);
    console.log('Accounts saved:', savedReport.creditAccountsInformation?.accounts?.length);

    return res.status(201).json({ 
      success: true,
      id: report._id,
      name: parsed.basicDetails?.name,
      creditScore: parsed.creditScore?.bureauScore,
      accountsCount: parsed.creditAccountsInformation?.accounts?.length,
      creditCardsCount: parsed.creditAccountsInformation?.totalCreditCards,
      enquiriesCount: parsed.creditEnquiries?.length,
      message: 'Report uploaded and parsed successfully' 
    });
  } catch (err) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    return res.status(500).json({ 
      error: 'Failed to parse or save XML',
      details: err.message 
    });
  }
});

module.exports = router;