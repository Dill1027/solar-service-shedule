const express = require('express');
const router = express.Router();
const Installation = require('../models/Installation');
const moment = require('moment');

// GET /api/installations - Get all installations with optional search and filter
router.get('/', async (req, res) => {
  try {
    const { search, capacity, district, page = 1, limit = 10 } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { 'location.district': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by capacity
    if (capacity && capacity !== 'all') {
      query['systemCapacity.value'] = parseFloat(capacity);
    }

    // Filter by district
    if (district && district !== 'all') {
      query['location.district'] = district;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const installations = await Installation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Installation.countDocuments(query);

    res.status(200).json({
      success: true,
      data: installations,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching installations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching installations',
      error: error.message
    });
  }
});

// GET /api/installations/:id - Get single installation
router.get('/:id', async (req, res) => {
  try {
    const installation = await Installation.findById(req.params.id);
    
    if (!installation) {
      return res.status(404).json({
        success: false,
        message: 'Installation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: installation
    });
  } catch (error) {
    console.error('Error fetching installation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching installation',
      error: error.message
    });
  }
});

// POST /api/installations - Create new installation
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      systemCapacity,
      inverterModel,
      location,
      installationDate,
      lastServiceDate,
      note
    } = req.body;

    // Validate required fields
    if (!customerName || !systemCapacity || !inverterModel || !location?.district || !installationDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['customerName', 'systemCapacity', 'inverterModel', 'location.district', 'installationDate']
      });
    }

    const installationData = {
      customerName,
      systemCapacity,
      inverterModel,
      location,
      installationDate: new Date(installationDate),
      note
    };

    // Handle lastServiceDate - allow null/empty to mean no service yet
    if (lastServiceDate && lastServiceDate.trim() !== '') {
      installationData.lastServiceDate = new Date(lastServiceDate);
    }

    const installation = new Installation(installationData);

    const savedInstallation = await installation.save();

    res.status(201).json({
      success: true,
      message: 'Installation created successfully',
      data: savedInstallation
    });
  } catch (error) {
    console.error('Error creating installation:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating installation',
      error: error.message
    });
  }
});

// PUT /api/installations/:id - Update installation
router.put('/:id', async (req, res) => {
  try {
    console.log('Update request for ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      customerName,
      systemCapacity,
      inverterModel,
      location,
      installationDate,
      lastServiceDate,
      note
    } = req.body;

    const updateData = {
      customerName,
      systemCapacity,
      inverterModel,
      location,
      installationDate: installationDate ? new Date(installationDate) : undefined,
      note
    };

    // Handle lastServiceDate separately to allow clearing it
    if (lastServiceDate === '' || lastServiceDate === null) {
      updateData.lastServiceDate = null;
    } else if (lastServiceDate) {
      updateData.lastServiceDate = new Date(lastServiceDate);
    }

    // Remove undefined fields (but keep null values)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const installation = await Installation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!installation) {
      return res.status(404).json({
        success: false,
        message: 'Installation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Installation updated successfully',
      data: installation
    });
  } catch (error) {
    console.error('Error updating installation:', error);
    
    if (error.name === 'ValidationError') {
      console.log('Validation Error Details:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating installation',
      error: error.message
    });
  }
});

// DELETE /api/installations/:id - Delete installation
router.delete('/:id', async (req, res) => {
  try {
    const installation = await Installation.findByIdAndDelete(req.params.id);

    if (!installation) {
      return res.status(404).json({
        success: false,
        message: 'Installation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Installation deleted successfully',
      data: installation
    });
  } catch (error) {
    console.error('Error deleting installation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting installation',
      error: error.message
    });
  }
});

// GET /api/installations/stats/overview - Get overview statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalInstallations = await Installation.countDocuments();
    
    const capacityStats = await Installation.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$systemCapacity.value' },
          avgCapacity: { $avg: '$systemCapacity.value' }
        }
      }
    ]);

    const serviceStats = await Installation.aggregate([
      {
        $project: {
          hasService: { $cond: [{ $ne: ['$lastServiceDate', null] }, 1, 0] },
          nextServiceDate: {
            $dateAdd: {
              startDate: {
                $cond: [
                  { $ne: ['$lastServiceDate', null] },
                  '$lastServiceDate',
                  '$installationDate'
                ]
              },
              unit: 'month',
              amount: 6
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          servicedCount: { $sum: '$hasService' },
          upcomingServices: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$nextServiceDate', new Date()] },
                    { $gte: ['$nextServiceDate', moment().subtract(30, 'days').toDate()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalInstallations,
        totalCapacity: capacityStats[0]?.totalCapacity || 0,
        averageCapacity: capacityStats[0]?.avgCapacity || 0,
        servicedInstallations: serviceStats[0]?.servicedCount || 0,
        upcomingServices: serviceStats[0]?.upcomingServices || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;
