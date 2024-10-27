

function emailLoginLink (link) {

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
                                                    padding-bottom: 12px;
                                                    padding-top: 32px;
                                                ">
                                                    <div style="
                                                        font-size: 18px;
                                                        font-weight: 600;
                                                        font-family: esqmarket-medium,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif;
                                                    ">
                                                        Here's your login link:
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
                                                        color: #00c807;
                                                    "
                                                    href="${link}"
                                                    target="_blank"
                                                    >
                                                        <strong>${link}</strong>
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
                                                        If you received this email by mistake, please ignore this email. This link will expire in 30 days.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="
                                                        height: 50px;
                                                        padding-top: 32px;
                                                    "
                                                >
                                                    <a href="${link}"
                                                        style="
                                                            text-decoration: none;
                                                            color: #fff;
                                                            background: #00c807;
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
                                                        Login
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
                                        <a href="https://emplorex.com/privacy-policy" target="_blank" style="color: #6c757d; text-decoration: none;">Privacy Policy</a> • <a href="https://emplorex.com/terms-of-service" target="_blank" style="color: #6c757d; text-decoration: none;">Terms of Service</a>
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

module.exports = emailLoginLink;