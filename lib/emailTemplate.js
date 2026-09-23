// lib/emailTemplates.js
export function getOtpEmailHtml(otp) {
    return `
    <!DOCTYPE html>
    <html>
    <body style="background:#0a0a0a;font-family:Arial,sans-serif;margin:0;padding:40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="560" style="background:#111113;border-radius:16px;max-width:560px;width:100%;">
              <tr>
                <td style="padding:32px 40px 24px;border-bottom:1px solid #222224;">
                  <p style="margin:0;font-size:22px;font-weight:700;color:#facc15;">MovieVerse</p>
                  <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Movies and TV Series</p>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 40px 28px;">
                  <p style="margin:0 0 8px;font-size:20px;font-weight:600;color:#ffffff;">Reset your password</p>
                  <p style="margin:0 0 28px;font-size:14px;color:#9ca3af;line-height:1.6;">
                    We received a request to reset the password for your MovieVerse account.
                    Use the code below to continue. It expires in <strong style="color:#e5e7eb;">15 minutes</strong>.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:0 0 28px;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background:#1c1c1f;border:1px solid #2d2d30;border-radius:12px;padding:20px 40px;text-align:center;">
                              <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:1.5px;color:#6b7280;text-transform:uppercase;">Your reset code</p>
                              <p style="margin:0;font-size:36px;font-weight:700;letter-spacing:10px;color:#facc15;font-family:'Courier New',monospace;">${otp}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                    <tr>
                      <td style="background:#1c1c1f;border-left:3px solid #374151;border-radius:4px;padding:14px 16px;">
                        <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
                          <strong style="color:#9ca3af;">Didn't request this?</strong>
                          You can safely ignore this email — your password will not change.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 40px 32px;border-top:1px solid #222224;">
                  <p style="margin:0;font-size:11px;color:#4b5563;line-height:1.6;text-align:center;">
                    MovieVerse · This product uses the TMDB API but is not endorsed by TMDB.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}


export function getRegistrationEmailHtml(name){
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to MovieVerse</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#111113;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- header band -->
          <tr>
            <td style="background-color:#111113;padding:32px 40px 24px;border-bottom:1px solid #222224;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#facc15;letter-spacing:-0.3px;">MovieVerse</p>
              <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Movies and TV Series</p>
            </td>
          </tr>

          <!-- hero area -->
          <tr>
            <td style="padding:36px 40px 0px;">
              <p style="margin:0;font-size:32px;">🎬</p>
              <p style="margin:12px 0 8px;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                Welcome to MovieVerse, ${name}!
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#9ca3af;line-height:1.7;">
                Your account is all set. You're now part of a community that never runs out of things to watch.
                Here's what you can do right away:
              </p>

              <!-- feature list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">

                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1c1c1f;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;font-size:20px;vertical-align:top;">🔍</td>
                        <td>
                          <p style="margin:0;font-size:13px;font-weight:600;color:#e5e7eb;">Search & Discover</p>
                          <p style="margin:3px 0 0;font-size:12px;color:#6b7280;line-height:1.5;">Browse trending movies and top-rated TV series updated every week.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1c1c1f;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;font-size:20px;vertical-align:top;">❤️</td>
                        <td>
                          <p style="margin:0;font-size:13px;font-weight:600;color:#e5e7eb;">Save Favorites</p>
                          <p style="margin:3px 0 0;font-size:12px;color:#6b7280;line-height:1.5;">Heart any movie or series to save it to your personal favorites list.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1c1c1f;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;font-size:20px;vertical-align:top;">🎲</td>
                        <td>
                          <p style="margin:0;font-size:13px;font-weight:600;color:#e5e7eb;">Feeling Lucky?</p>
                          <p style="margin:3px 0 0;font-size:12px;color:#6b7280;line-height:1.5;">Can't decide what to watch? Let our random picker surprise you.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;font-size:20px;vertical-align:top;">🎬</td>
                        <td>
                          <p style="margin:0;font-size:13px;font-weight:600;color:#e5e7eb;">Watch Trailers</p>
                          <p style="margin:3px 0 0;font-size:12px;color:#6b7280;line-height:1.5;">Play YouTube trailers directly on any movie or series page.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="http://localhost:3000/"
                      style="display:inline-block;background-color:#facc15;color:#000000;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:0.2px;">
                      Start Exploring →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ignore notice -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#1c1c1f;border-left:3px solid #374151;border-radius:4px;padding:14px 16px;">
                    <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
                      <strong style="color:#9ca3af;">Didn't sign up?</strong>
                      You can safely ignore this email. No action is needed and your information will not be used.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #222224;">
              <p style="margin:0;font-size:11px;color:#4b5563;line-height:1.6;text-align:center;">
                You're receiving this because you created a MovieVerse account.<br/>
                MovieVerse &nbsp;·&nbsp; This product uses the TMDB API but is not endorsed or certified by TMDB.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}