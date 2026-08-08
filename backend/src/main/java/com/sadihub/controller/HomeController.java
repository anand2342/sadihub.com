package com.sadihub.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Shadi Hub Java 21 Spring Boot Backend</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: #1a0508;
                        color: #fce7f3;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-h-screen;
                        height: 100vh;
                        margin: 0;
                    }
                    .card {
                        background: #2d0b10;
                        border: 2px solid #d4af37;
                        border-radius: 24px;
                        padding: 40px;
                        max-width: 600px;
                        text-align: center;
                        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
                    }
                    h1 { color: #ffd700; margin-bottom: 10px; font-family: serif; }
                    p { color: #f3d8a6; line-height: 1.6; }
                    .badge {
                        display: inline-block;
                        padding: 6px 16px;
                        background: rgba(212, 175, 55, 0.2);
                        border: 1px solid #d4af37;
                        border-radius: 50px;
                        color: #ffd700;
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
                    .links { margin-top: 25px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
                    a {
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #d4af37, #aa7c11);
                        color: #1a0508;
                        text-decoration: none;
                        font-weight: bold;
                        border-radius: 12px;
                        transition: transform 0.2s;
                    }
                    a:hover { transform: scale(1.05); }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="badge">॥ श्री गणेशाय नमः ॥</div>
                    <h1>👑 Shadi Hub Backend Active 👑</h1>
                    <p>Java 21 Spring Boot 3.x REST API Engine is running live on <strong>port 8080</strong>.</p>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; margin: 15px 0; text-align: left; font-size: 14px;">
                        <p style="margin: 4px 0; color: #ffd700;"><strong>🔑 H2 Console Login Credentials:</strong></p>
                        <p style="margin: 4px 0;"><strong>JDBC URL:</strong> <code>jdbc:h2:file:./data/sadihubdb</code></p>
                        <p style="margin: 4px 0;"><strong>User Name:</strong> <code>sa</code> | <strong>Password:</strong> (leave empty)</p>
                    </div>
                    <div class="links">
                        <a href="http://localhost:5173" target="_blank">Open Frontend Web Portal (Port 5173)</a>
                        <a href="/h2-console" target="_blank">Open H2 DB Console</a>
                        <a href="/api/v1/wedding/family-default" target="_blank">Test Wedding API</a>
                    </div>
                </div>
            </body>
            </html>
            """;
    }
}
