const webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BP00REHkcdKveWrFYCaEkjZZr27iih2AR5n9dmxthfN1wzd-T7F6ZLMcZuVPcTJcCdZ3XutXfQeSVLNRKLr8tIk",
    "privateKey": "OEztQ1_C8bhOapZ7H9A4T1FAoyeRM7x2bA3B6YwtL1M"
};


webPush.setVapidDetails(
    'mailto:wahiid.ari@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/ei5_autVTm4:APA91bHs_R9_q7ZJn9monNoRv11D4sH_h840Heo1eRVPQIgjomXKReWUR78jGDqfJ7ZF5Lr3yo2vFzDyKEgpfofH0YBz8a3AmmawCjArapyirTjHrcT8IFtOGa2S5TtFL621KiWXBEZw",
    "keys": {
        "p256dh": "BOMSaN6R87SMTdvChi4NLV6CeWPZcSQplfvNIrZNXwjbY9DaPqNeaKR55PEF17KRo8F4neW3VoLvX4rEMHRg5jM=",
        "auth": "wT85FDQH3d0zQZHDbK2eWA=="
    }
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
const options = {
    gcmAPIKey: '900673455290',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);