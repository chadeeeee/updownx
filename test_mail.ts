import nodemailer from 'nodemailer';

// Створюємо об'єкт для відправки, як бортовий самописець
const transporter = nodemailer.createTransport({
    host: 'mail.adm.tools',
    port: 465, // Рекомендований SSL порт з вашого скріншоту
    secure: true, // Використовуємо SSL
    auth: {
        user: 'verification@updownxpro.com', // Ваша нова пошта
        pass: '1234'
    }
});

async function sendSignal() {
    try {
        const info = await transporter.sendMail({
            from: 'UPDOWNX <verification@updownxpro.com>',
            to: 'esurginet2011@gmail.com', // Куди шлемо на Gmail
            subject: 'Verification code',
            text: 'This is the last call before entering the silent zone.',
            html: '<b>Last call:</b> the signal is strong and clear.'
        });

        console.log('Повідомлення відправлено успішно. ID:', info.messageId);
    } catch (error) {
        // Якщо літак збився з курсу (помилка)
        console.error('Помилка відправки:', error);
    }
}

sendSignal();