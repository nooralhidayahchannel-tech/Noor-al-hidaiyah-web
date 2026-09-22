import { createServerClient } from "@quranjs/api/server";

const client = createServerClient({
  clientId: process.env.QF_CLIENT_ID,
    clientSecret: process.env.QF_CLIENT_SECRET,
      services: {
          gatewayUrl: "https://apis-prelive.quran.foundation",
              oauth2BaseUrl: "https://prelive-oauth2.quran.foundation",
                },
                });

                const result = await client.content.v4.verses.byKey("1:1", {
                  translations: [85],
                  });

                  console.log(JSON.stringify(result, null, 2));