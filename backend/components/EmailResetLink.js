

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
                        padding-top: 32px;
                        color: black!important;
                        font-family: monospace;
                        max-width: 600px;
                        background-color: #f6f6f6;
                    ">
                    <table 
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background-color: #ffffff;
                            border-spacing: 0;
                            table-layout: fixed;
                            border-collapse: separate;
                        ">
                            <tbody>
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding: 34px 24px;
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
                                                    padding-bottom: 8px;
                                                    text-align: center;
                                                    padding-bottom: 32px;
                                                ">
                                                    <div>
                                                        <img src="cid:logo" alt="logo" style="
                                                            width: 22px;
                                                        ">
                                                    </div>
                                                </td>
                                            <tr>
                                            <td style="
                                            ">
                                                <div style="
                                                    font-size: 30px;
                                                    font-weight: 700;
                                                    padding-bottom: 32px;
                                                    font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                ">
                                                    Reset Password
                                                </div>
                                            </tr>
                                            <tr>
                                                <td style="
                                                    padding-bottom: 24px;
                                                ">
                                                    <div style="
                                                        font-size: 14px;
                                                        font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                    ">
                                                        Hey there,
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="
                                                    font-size: 14px;
                                                    padding-bottom: 8px;
                                                    font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                    ">
                                                        Someone requested a password reset for your Emplorex account.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="
                                                    padding-bottom: 32px;
                                                ">
                                                    <div style="
                                                    font-size: 14px;
                                                    font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                    ">
                                                    If you didn’t make this request, please ignore this email.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="
                                                        height: 40px;
                                                    "
                                                >
                                                <a
                                                    href="${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}"
                                                    style="
                                                        text-decoration: none;
                                                        color: #fff;
                                                        background: #006aff;
                                                        font-size: 14px;
                                                        font-weight: 600;
                                                        padding: 16px;
                                                        transition-duration: 0.3s;
                                                        border-radius: 8px;
                                                        height: 40px;
                                                        font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                    " target="_blank"
                                                        onMouseOver="this.style.backgroundColor='#1976d2'"
                                                        onMouseOut="this.style.backgroundColor='#006aff'"
                                                    >
                                                        Reset my password
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
                                ">
                                    <div
                                        style="
                                            font-size: 12px;
                                            font-weight: 400;
                                            text-align: center;
                                            color: #6c757d;
                                            font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                        "
                                    >
                                        © 2024 Emplorex Inc.
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