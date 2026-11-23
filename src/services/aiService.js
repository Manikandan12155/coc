const GROQ_KEY = (import.meta.env.VITE_GROQ_KEY || "");
const GEMINI_KEY = (import.meta.env.VITE_GEMINI_KEY || "");

export async function askAI(userPrompt, playerProfile, history = [], provider = 'groq') {
  const heroesSummary = playerProfile?.heroes?.map(h => `${h.name}: Lvl ${h.level}/${h.maxLevel}`).join(', ') || 'N/A';
  
  const systemPrompt = `You are an elite Clash of Clans (CoC) Strategy and Fast Maxing Advisor.
The user is playing with the following live stats:
- Player Name: ${playerProfile?.name || 'Player'}
- Town Hall Level: ${playerProfile?.townHallLevel || '18'}
- Exp Level: ${playerProfile?.expLevel || 'N/A'}
- Clan: ${playerProfile?.clan?.name || 'None'}
- Heroes: ${heroesSummary}

Guidelines:
1. Always give ultra-clear, concise, bulleted advice for fast maxing, hero priority, builder allocation, or loot farming.
2. Reply ONLY in Tanglish (Tamil words written in English letters). Never use Tamil script.
3. Keep it punchy, practical, motivating, like an experienced CoC leader and coach.`;

  if (provider === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6),
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Groq API Error: ${res.status}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  } else {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [
          ...history.slice(-6).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: userPrompt }] }
        ]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API Error: ${res.status}`);
    }
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }
}

