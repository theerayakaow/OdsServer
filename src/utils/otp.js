
const fs = require('fs');
const path = require('path');

const otpPath = path.resolve(__dirname, '../data/otp_entries.json');
const { OTP_EXPIRE_MINUTES } = require('./helper');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const writeJson = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
const getNow = () => new Date();

const generateOtpRefId = () => {
    const number = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `REF-${number}`;
};

const getLatestEntry = (phoneNumber) => {
    const data = readJson(otpPath);
    const entries = data.otp_entries
        .filter(e => e.phone_number === phoneNumber)
        .sort((a, b) => new Date(b.last_sent_at) - new Date(a.last_sent_at));

    const latest = entries[0];
    return latest
};

const markEntryAsVerified = (phoneNumber, otpRefId) => {
    const data = readJson(otpPath);

    const index = data.otp_entries.findIndex(
        (e) => e.phone_number === phoneNumber && e.otp_ref_id === otpRefId
    );

    if (index !== -1) {
        data.otp_entries[index].is_verified = true;
        writeJson(otpPath, data);
    }
};

const createOtpRequest = (phoneNumber) => {
    const data = readJson(otpPath);
    const now = getNow();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpRefId = generateOtpRefId();
    const expire = new Date(now.getTime() + OTP_EXPIRE_MINUTES * 60000);

    const newEntry = {
        phone_number: phoneNumber,
        last_sent_at: now.toISOString(),
        otp_ref_id: otpRefId,
        otp_code: otpCode,
        otp_expire_at: expire.toISOString(),
        is_verified: false,
    };

    data.otp_entries.push(newEntry);
    writeJson(otpPath, data);

    return { otpCode };
};

const verifyOtp = (phoneNumber, otpCode) => {
    const data = readJson(otpPath);
    const now = getNow();

    const entries = data.otp_entries.filter((e) => e.phone_number === phoneNumber);
    const latest = getLatestEntry(phoneNumber); // ใช้เพื่อความสะอาด

    if (!latest) return { valid: false, reason: 'not_found' };

    if (latest.otp_code !== otpCode) {
        const used = entries.find((e) => e.otp_code === otpCode && e.is_verified);
        if (used) return { valid: false, reason: 'used' };

        const matching = entries.find(
            (e) =>
                e.otp_code === otpCode &&
                !e.is_verified &&
                new Date(e.otp_expire_at) > now
        );
        if (matching) return { valid: false, reason: 'not_latest' };

        return { valid: false, reason: 'incorrect' };
    }

    if (latest.is_verified) return { valid: false, reason: 'already_verified' };
    if (new Date(latest.otp_expire_at) < now) return { valid: false, reason: 'expired' };

    markEntryAsVerified(phoneNumber, latest.otp_ref_id);

    return { valid: true, ref_id: latest.otp_ref_id };
};

const clearExpiredEntries = () => {
    const data = readJson(otpPath);
    const now = getNow();

    data.otp_entries = data.otp_entries.filter((e) => new Date(e.otp_expire_at) > now);
    writeJson(otpPath, data);
};

module.exports = {
    createOtpRequest,
    verifyOtp,
    getLatestEntry,
    clearExpiredEntries,
};
