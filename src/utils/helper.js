const fs = require('fs');
const path = require('path');

const formatTimeAMPM = (isoTime) => {
    const date = new Date(isoTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 = 12
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${hours}:${paddedMinutes} ${ampm}`;
};

const COOL_DOWN = 15;
const OTP_EXPIRE_MINUTES = 5;

const getAvatarBase64 = (userUid) => {
    const imagePath = path.join(__dirname, '../../assets', `${userUid}.png`);

    try {
        const imageBuffer = fs.readFileSync(imagePath);
        return `data:image/png;base64,${imageBuffer.toString('base64')}`;
    } catch (err) {
        console.warn(`Avatar not found for ${userUid}`);
        return null;
    }
};

module.exports = {
    formatTimeAMPM,
    getAvatarBase64,
    COOL_DOWN,
    OTP_EXPIRE_MINUTES,
};
