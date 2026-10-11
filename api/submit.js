export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1558842247301042268/qOvWoS9aAXznKULTvtDyoLCMOFKmWRYo3enZmehQQJjBAfUkrnb1o23hFUqlSkBguM3k";

    const { email, discordId, contactOther, nameOOC, nameIC, ageOOC, ageIC, genderOOC, genderIC } = req.body;

    const embedData = {
        embeds: [{
            title: "📋 มีใบสมัครเข้าร่วมค่ายใหม่เข้ามา!",
            color: 0xF8B2B2,
            fields: [
                { name: "📧 Email", value: email || "-", inline: true },
                { name: "💬 Discord ID", value: discordId || "-", inline: true },
                { name: "🌐 ติดต่ออื่นๆ", value: contactOther || "-", inline: true },
                { name: "👤 ชื่อ OOC", value: nameOOC || "-", inline: true },
                { name: "🎂 อายุ OOC", value: `${ageOOC} ปี`, inline: true },
                { name: "⚧ เพศ OOC", value: genderOOC || "-", inline: true },
                { name: "🎭 ชื่อ IC", value: nameIC || "-", inline: true },
                { name: "🎂 อายุ IC", value: `${ageIC} ปี`, inline: true },
                { name: "⚧ เพศ IC", value: genderIC || "-", inline: true }
            ],
            footer: { text: "RAIBAN Studio Application Log" },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embedData)
        });

        if (discordResponse.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, error: 'Discord webhook error' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}