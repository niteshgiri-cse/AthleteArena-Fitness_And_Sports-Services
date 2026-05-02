package com.niteshgiri.AthleteArena.util;

import com.niteshgiri.AthleteArena.model.Event;
import com.niteshgiri.AthleteArena.model.Registration;
import com.niteshgiri.AthleteArena.model.User;

public class EmailTemplateUtil {

    public static String buildSuccessEmail(User user, Event event, Registration reg) {

        return """
        <html>
        <body style="font-family: Arial; background:#f4f6f8; padding:20px;">
            <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:10px;">
                
                <h2 style="color:#4CAF50;">Booking Confirmed 🎉</h2>

                <p>Hi %s,</p>
                <p>Your registration is confirmed.</p>

                <hr/>

                <p><b>Event:</b> %s</p>
                <p><b>Date:</b> %s</p>
                <p><b>Location:</b> %s</p>
                <p><b>Amount Paid:</b> ₹%.2f</p>
                <p><b>Booking ID:</b> %s</p>

                <hr/>

                <p>Show this email at entry.</p>

                <p style="color:gray;font-size:12px;">
                    AthleteArena Team
                </p>
            </div>
        </body>
        </html>
        """.formatted(
                user.getName(),
                event.getTitle(),
                event.getDataAndTime(),
                event.getLocation(),
                reg.getAmount(),
                reg.getId()
        );
    }
}