const express = require('express');
const Report = require('../models/Report');
const router = express.Router();

// Get all reports (list view with summary)
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ uploadedAt: -1 })
      .limit(50)
      .select('basicDetails uploadedAt reportSummary creditScore creditAccountsInformation.totalCreditCards creditAccountsInformation.accounts sourceFileName metadata')
      .lean(); // Use lean() for better performance
    
    console.log('=== FETCHING REPORTS LIST ===');
    console.log('Total reports:', reports.length);
    
    // Add computed fields for list view
    const reportsWithSummary = reports.map(r => ({
      _id: r._id,
      name: r.basicDetails?.name || 'Unknown',
      pan: r.basicDetails?.pan,
      creditScore: r.creditScore?.bureauScore || 0,
      totalAccounts: r.creditAccountsInformation?.accounts?.length || 0,
      totalCreditCards: r.creditAccountsInformation?.totalCreditCards || 0,
      activeAccounts: r.reportSummary?.activeAccounts || 0,
      currentBalance: r.reportSummary?.currentBalance || 0,
      uploadedAt: r.uploadedAt,
      fileName: r.sourceFileName,
      reportDate: r.metadata?.reportDate
    }));
    
    res.json(reportsWithSummary);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports', details: err.message });
  }
});

// Get single report (full details)
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).lean();
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    console.log('=== FETCHING SINGLE REPORT ===');
    console.log('Report ID:', req.params.id);
    console.log('Name:', report.basicDetails?.name);
    console.log('Accounts count:', report.creditAccountsInformation?.accounts?.length);
    
    res.json(report);
  } catch (err) {
    console.error('Error fetching report:', err);
    
    // Handle invalid MongoDB ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid report ID format' });
    }
    
    res.status(500).json({ error: 'Failed to fetch report', details: err.message });
  }
});

// Delete a report
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    console.log('=== DELETED REPORT ===');
    console.log('Report ID:', req.params.id);
    
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ error: 'Failed to delete report', details: err.message });
  }
});

// Search reports by PAN or name
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const reports = await Report.find({
      $or: [
        { 'basicDetails.pan': { $regex: query, $options: 'i' } },
        { 'basicDetails.name': { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ uploadedAt: -1 })
    .limit(20)
    .select('basicDetails uploadedAt creditScore reportSummary')
    .lean();
    
    res.json(reports);
  } catch (err) {
    console.error('Error searching reports:', err);
    res.status(500).json({ error: 'Failed to search reports', details: err.message });
  }
});

module.exports = router;