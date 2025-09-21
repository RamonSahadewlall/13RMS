const mailjet = require('node-mailjet').connect(
    '28cf1ac30b6d42974bc4d597fdd8f02e',
    'e094725a2a26adbf0a8bd77ce7f39ca0',
    {
        version: 'v3.1', // specify the version
        perform_api_call: true, // default to true
    }
);

const sendEmail = async () => {
    try {
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: '13rms@curant24.com',
                            Name: '13RMS',
                        },
                        To: [
                            {
                                Email: 'abishek17703@gmail.com',
                                Name: 'Abishek R',
                            },
                        ],
                        Subject: 'New Form Request',
                        HTMLPart: '<h3>Email Content</h3>',
                    },
                ],
            });

        const response = await request;
        console.log(response.body);
    } catch (error) {
        console.error(error.statusCode, error.message);
    }
};

// Call the function to send an email
sendEmail();