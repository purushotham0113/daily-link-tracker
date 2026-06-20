const Link = require('../models/Link');
const validator = require('validator');
const xss = require('xss');

// Helper to format timezone offset in minutes (e.g. -330) to MongoDB timezone string (+HH:MM or -HH:MM)
const formatTimezoneOffset = (offsetMinutes) => {
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  const sign = offsetMinutes <= 0 ? '+' : '-';
  return `${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// @desc    Add a new link
// @route   POST /api/links
const addLink = async (req, res, next) => {
  try {
    let { url } = req.body;

    // Trim whitespace
    url = url.trim();

    // Auto-prepend https:// if no protocol
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    // Validate URL format
    if (
      !validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
      })
    ) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid URL (http:// or https://)',
      });
    }

    // Sanitize against XSS
    url = xss(url);

    const link = await Link.create({ url });

    res.status(201).json({
      success: true,
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get links by date
// @route   GET /api/links?date=YYYY-MM-DD
const getLinksByDate = async (req, res, next) => {
  try {
    let { date, tz } = req.query;
    const tzOffset = parseInt(tz, 10) || 0; // in minutes (UTC - Local)

    // Default to today in client's timezone if no date provided
    if (!date) {
      const now = new Date();
      const clientLocalTime = new Date(now.getTime() - tzOffset * 60 * 1000);
      const y = clientLocalTime.getUTCFullYear();
      const m = String(clientLocalTime.getUTCMonth() + 1).padStart(2, '0');
      const d = String(clientLocalTime.getUTCDate()).padStart(2, '0');
      date = `${y}-${m}-${d}`;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }

    const [year, month, day] = date.split('-').map(Number);
    const utcStart = Date.UTC(year, month - 1, day);

    // Calculate startOfDay and endOfDay in UTC adjusting for client's timezone offset
    const startOfDay = new Date(utcStart + tzOffset * 60 * 1000);
    const endOfDay = new Date(utcStart + tzOffset * 60 * 1000 + 24 * 60 * 60 * 1000 - 1);

    // Validate the dates are valid
    if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date provided.',
      });
    }

    const links = await Link.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct dates that have links
// @route   GET /api/links/dates
const getActiveDates = async (req, res, next) => {
  try {
    const tzOffset = parseInt(req.query.tz, 10) || 0;
    const timezoneString = formatTimezoneOffset(tzOffset);

    const dates = await Link.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: timezoneString
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: dates.map((d) => ({ date: d._id, count: d.count })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a link by ID
// @route   DELETE /api/links/:id
const deleteLink = async (req, res, next) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Link not found',
      });
    }

    await link.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addLink, getLinksByDate, getActiveDates, deleteLink };
