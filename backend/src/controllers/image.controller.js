const asyncHandler = require("express-async-handler");
const axios = require("axios");

const analyzeFoodImage = asyncHandler(async (req, res) => {
  const { image } = req.body;

  if (!image) {
    res.status(400);
    throw new Error("Image required");
  }

  const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    res.status(400);
    throw new Error("Invalid image format");
  }

  const mimeType = matches[1]; 
  const base64Data = matches[2]; 

  const promptText = `
    Analyze this food image.
    1. Identify foods
    2. Estimate calories
    3. Tell healthy/unhealthy
    4. Give short response
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
      }
    );

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not analyze image.";

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    // Google ले पठाएको सक्कली एरर म्यासेज तान्ने
    const googleError = error.response?.data?.error?.message || error.message;
    console.error("Gemini Error:", googleError);
    
    res.status(500).json({
      message: `Gemini API Error: ${googleError}`
    });
  }
});

module.exports = {
  analyzeFoodImage,
};