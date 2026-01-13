const PDFDocument = require('pdfkit');
const KickCounter = require('../models/KickCounter');

// Get kick counter data for a user
const getKickData = async (req, res) => {
  try {
    const userId = req.userId; // From JWT token
    
    let kickData = await KickCounter.findOne({ userId });
    
    if (!kickData) {
      kickData = new KickCounter({ userId, name: '', count: [] });
      await kickData.save();
    }
    
    res.json({
      name: kickData.name || '',
      count: kickData.count || [],
      createdAt: kickData.createdAt,
      updatedAt: kickData.updatedAt,
    });
  } catch (error) {
    console.error('Error getting kick data:', error);
    res.status(500).json({ error: 'Failed to get kick data' });
  }
};

// Save kick counter data
const saveKickData = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, count } = req.body;
    
    if (!Array.isArray(count)) {
      return res.status(400).json({ error: 'Count must be an array' });
    }
    
    await KickCounter.findOneAndUpdate(
      { userId },
      { name: name || '', count: count },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: 'Kick data saved successfully' });
  } catch (error) {
    console.error('Error saving kick data:', error);
    res.status(500).json({ error: 'Failed to save kick data' });
  }
};

// Get notification data
const getNotificationData = async (req, res) => {
  try {
    const userId = req.userId;
    
    let kickData = await KickCounter.findOne({ userId });
    
    if (!kickData) {
      return res.json({ notification: [] });
    }
    
    res.json({
      notification: kickData.notifications || []
    });
  } catch (error) {
    console.error('Error getting notification data:', error);
    res.status(500).json({ error: 'Failed to get notification data' });
  }
};

// Save notification data
const saveNotificationData = async (req, res) => {
  try {
    const userId = req.userId;
    const { notification } = req.body;
    
    if (!Array.isArray(notification)) {
      return res.status(400).json({ error: 'Notification must be an array' });
    }
    
    await KickCounter.findOneAndUpdate(
      { userId },
      { notifications: notification, setNotification: false },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: 'Notification data saved successfully' });
  } catch (error) {
    console.error('Error saving notification data:', error);
    res.status(500).json({ error: 'Failed to save notification data' });
  }
};

// Delete notification data
const deleteNotificationData = async (req, res) => {
  try {
    const userId = req.userId;
    
    await KickCounter.findOneAndUpdate(
      { userId },
      { notifications: [], setNotification: true },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: 'Notifications disabled successfully' });
  } catch (error) {
    console.error('Error deleting notification data:', error);
    res.status(500).json({ error: 'Failed to delete notification data' });
  }
};

// Generate and share PDF
const sharePdf = async (req, res) => {
  try {
    const userId = req.userId;
    const { duration } = req.body;
    
    // Get kick data
    const kickData = await KickCounter.findOne({ userId });
    
    if (!kickData) {
      return res.status(404).json({ error: 'No kick data found' });
    }
    
    const userList = kickData.count || [];
    let selectedList = [];
    
    const now = Date.now();
    
    // Filter data based on duration
    switch (duration) {
      case 0: // Last 24 hours
        selectedList = userList.filter(item => item.time >= now - 86400000);
        break;
      case 1: // Past week
        selectedList = userList.filter(item => item.time >= now - 604800000);
        break;
      case 2: // Complete list
      default:
        selectedList = userList;
        break;
    }
    
    // Create PDF
    const doc_pdf = new PDFDocument();
    const chunks = [];
    
    doc_pdf.on('data', chunk => chunks.push(chunk));
    doc_pdf.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=kick_counter.pdf');
      res.send(pdfBuffer);
    });
    
    // Add content to PDF
    doc_pdf.fontSize(20).text('Kick Counter Report', { align: 'center' });
    doc_pdf.moveDown();
    doc_pdf.fontSize(16).text(`Total Kicks: ${selectedList.length}`, { align: 'center' });
    doc_pdf.moveDown();
    
    // Add kick entries
    const itemsPerPage = 45;
    let currentPage = 1;
    let itemsOnCurrentPage = 0;
    
    selectedList.forEach((entry, index) => {
      if (itemsOnCurrentPage >= itemsPerPage) {
        doc_pdf.addPage();
        currentPage++;
        doc_pdf.fontSize(16).text(`Page ${currentPage}`, { align: 'center' });
        doc_pdf.moveDown();
        itemsOnCurrentPage = 0;
      }
      
      doc_pdf.fontSize(12).text(`${index + 1}. ${entry.display}`);
      itemsOnCurrentPage++;
    });
    
    doc_pdf.end();
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

// Clear all kick data
const clearKickData = async (req, res) => {
  try {
    const userId = req.userId;
    await KickCounter.findOneAndUpdate(
      { userId },
      { count: [] },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing kick data:', error);
    res.status(500).json({ error: 'Failed to clear kick data' });
  }
};

module.exports = {
  getKickData,
  saveKickData,
  getNotificationData,
  saveNotificationData,
  deleteNotificationData,
  sharePdf,
  clearKickData,
};
