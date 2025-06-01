const cron = require('node-cron');
const HalfDayLeaveRequests = require('../models/HalfDayLeaveRequest');
const FullDayLeaveRequests = require('../models/FullDayLeaveRequest');

cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const halfDayResult = await HalfDayLeaveRequests.updateMany(
            {
                date: { $lt: today },
                status: { $nin: ['Approved', 'Rejected', 'Expired'] }
            },
            { $set: { status: 'Expired' } }
        );

        console.log(`[CRON] Auto-rejected ${halfDayResult.modifiedCount} outdated half-day leave requests.`);

        const fullDayResult = await FullDayLeaveRequests.updateMany(
            {
                toDate: { $lt: today },
                status: { $nin: ['Approved', 'Rejected', 'Expired'] }
            },
            { $set: { status: 'Expired' } }
        );

        console.log(`[CRON] Auto-rejected ${fullDayResult.modifiedCount} outdated full-day leave requests.`);
    } catch (err) {
        console.error('[CRON] Failed to auto-reject leave requests:', err);
    }
});
