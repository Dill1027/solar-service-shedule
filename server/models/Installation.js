const mongoose = require('mongoose');
const moment = require('moment');

const installationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  systemCapacity: {
    value: {
      type: Number,
      required: [true, 'System capacity is required'],
      min: [0.1, 'System capacity must be greater than 0']
    },
    unit: {
      type: String,
      default: 'kW',
      enum: ['kW', 'MW']
    }
  },
  inverterModel: {
    type: String,
    required: [true, 'Inverter model is required'],
    enum: ['Huawei', 'Solis', 'Other']
  },
  location: {
    district: {
      type: String,
      required: [true, 'District is required'],
      enum: [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
        'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
        'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
        'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
        'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
      ]
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    }
  },
  installationDate: {
    type: Date,
    required: [true, 'Installation date is required'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Installation date cannot be in the future'
    }
  },
  lastServiceDate: {
    type: Date,
    validate: {
      validator: function(value) {
        if (value) {
          return value >= this.installationDate && value <= new Date();
        }
        return true;
      },
      message: 'Last service date must be after installation date and not in the future'
    }
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'Note cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to calculate next service date
installationSchema.virtual('nextServiceDate').get(function() {
  const baseDate = this.lastServiceDate || this.installationDate;
  return moment(baseDate).add(6, 'months').toDate();
});

// Virtual field to format location
installationSchema.virtual('fullLocation').get(function() {
  if (this.location.address) {
    return `${this.location.address}, ${this.location.district}`;
  }
  return this.location.district;
});

// Virtual field to format system capacity
installationSchema.virtual('formattedCapacity').get(function() {
  return `${this.systemCapacity.value}${this.systemCapacity.unit}`;
});

// Index for search functionality
installationSchema.index({
  customerName: 'text',
  'location.district': 'text',
  'location.address': 'text'
});

// Index for filtering
installationSchema.index({ 'systemCapacity.value': 1 });
installationSchema.index({ 'location.district': 1 });
installationSchema.index({ installationDate: -1 });

// Pre-save middleware to validate dates
installationSchema.pre('save', function(next) {
  if (this.lastServiceDate && this.lastServiceDate < this.installationDate) {
    next(new Error('Last service date cannot be before installation date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Installation', installationSchema);
