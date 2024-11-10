

function emailResetLink (token, user) {

    return `
    <table
        align="center"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="
            width: 100%;
            border-spacing: 0;
            table-layout: fixed;
            border-collapse: separate;
        "
    >
        <tbody>
            <tr>
                <td
                    align="center"
                    style="
                        padding: 32px 12px;
                        color: black!important;
                        font-family: monospace;
                        max-width: 400px;
                        background-color: #f6f6f6;
                    ">
                    <table 
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background-color: #ffffff;
                            border-radius: 50px;
                            border-spacing: 0;
                            table-layout: fixed;
                            max-width: 400px;
                            border-collapse: separate;
                        ">
                            <tbody>
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding: 34px;
                                        "
                                    >
                                    <table 
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                            style="
                                            width: 100%;
                                            background-color: #ffffff;
                                        ">
                                        <tbody>
                                            <tr>
                                                <td style="
                                                    padding-bottom: 24px;
                                                ">
                                                    <div style="
                                                        font-size: 18px;
                                                        font-weight: 600;
                                                        font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                    ">
                                                        Hey there,
                                                    </div>
                                                    <br/>
                                                    <div style="
                                                        font-size: 14px;
                                                        font-weight: 400;
                                                        font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                    ">
                                                        Someone requested a password reset for your account.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="
                                                    padding-bottom: 32px;
                                                    padding-top: 32px;
                                                    border-bottom: 1px solid #e9ecef;
                                                    border-top: 1px solid #e9ecef;
                                                ">
                                                    <a style="
                                                        font-size: 12px;
                                                        text-align: center;
                                                        font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                        color: #ff395c;
                                                    "
                                                    href="${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}"
                                                    target="_blank"
                                                    >
                                                        ${`${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}`}
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="
                                                    font-size: 12px;
                                                    padding: 32px 0;
                                                    color: #6c757d;
                                                    font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                    ">
                                                        If you didn’t make this request, please ignore this email.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="
                                                        height: 50px;
                                                    "
                                                >
                                                    <a
                                                        href="${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}"
                                                        style="
                                                            text-decoration: none;
                                                            color: #fff;
                                                            background: #000;
                                                            font-size: 16px;
                                                            font-weight: 600;
                                                            padding: 16px 0;
                                                            transition-duration: 0.3s;
                                                            line-height: 1.8;
                                                            border-radius: 50px;
                                                            height: 28px;
                                                            display: block;
                                                            text-align: center;
                                                            font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                        " target="_blank"
                                                    >
                                                        Reset Password
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="
                    color: black!important;
                    font-family: monospace;
                    width: max-content;
                    background-color: #f6f6f6;
                ">
                    <table 
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            width: 100%;
                            border-spacing: 0;
                            table-layout: fixed;
                            border-collapse: separate;
                            padding: 24px;
                        ">
                        <tbody>
                            <tr>
                                <td style="
                                    text-align: center;
                                    margin-bottom: 24px;
                                ">
                                    <div
                                        style="
                                            font-size: 16px;
                                            font-weight: 400;
                                            text-align: center;
                                            color: #6c757d;
                                            font-family: 'Google Sans';
                                        "
                                    >
                                        <a href="https://[domain-name]" target="_blank" style="color: #000; text-decoration: none;">[domain-name]</a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="
                                    text-align: center;
                                ">
                                    <div
                                        style="
                                            font-size: 10px;
                                            font-weight: 400;
                                            text-align: center;
                                            color: #6c757d;
                                            font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                        "
                                    >
                                        <a href="https://[domain-name]/privacy" target="_blank" style="color: #6c757d; text-decoration: none;">Privacy Policy</a> • <a href="https://[domain-name]/terms" target="_blank" style="color: #6c757d; text-decoration: none;">Terms of Service</a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    `
}

module.exports = emailResetLink;