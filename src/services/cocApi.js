const DEFAULT_COC_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImEzZTI3OTM3LWIwOGUtNDY5ZS05NzZiLWM0MDZkYzdkOWEzOCIsImlhdCI6MTc5NTQxMTUxMiwic3ViIjoiZGV2ZWxvcGVyLzY4MzRiMmVmLTlhNTQtNGE4Yi1iZDg0LTVhYWVkODc4NjlmOCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjQ1Ljc5LjIxOC43OSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.JFce7rrbJAfAPNhRAADf1sRod5kiRIvA6CHS43PjpmeeeOtQtEK96aV5bTsFHBqi9IPqmiMDcVLx-QINXxydXA";
const COC_TOKEN = import.meta.env.VITE_COC_TOKEN || DEFAULT_COC_TOKEN;
const DEFAULT_TAG = "#L9R2LJ9RG";

export async function fetchCoCPlayerData(tag = DEFAULT_TAG) {
  const cleanTag = encodeURIComponent(tag.trim().replace(/^#/, '#'));
  const url = "/coc-api/players/" + cleanTag;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + COC_TOKEN,
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      return await res.json();
    }

    // Direct proxy fallback
    const directUrl = "https://cocproxy.royaleapi.dev/v1/players/" + cleanTag;
    const res2 = await fetch(directUrl, {
      headers: {
        'Authorization': 'Bearer ' + COC_TOKEN,
        'Accept': 'application/json'
      }
    });
    if (!res2.ok) {
      const errJson = await res2.json().catch(() => ({}));
      throw new Error(errJson.message || ("HTTP " + res2.status));
    }
    return await res2.json();
  } catch (err) {
    console.error("fetchCoCPlayerData error", err);
    throw err;
  }
}

export async function fetchClanData(clanTag) {
  if (!clanTag) return null;
  const cleanTag = encodeURIComponent(clanTag.trim().replace(/^#/, '#'));
  const url = "/coc-api/clans/" + cleanTag;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + COC_TOKEN,
        'Accept': 'application/json'
      }
    });
    if (res.ok) return await res.json();

    const directUrl = "https://cocproxy.royaleapi.dev/v1/clans/" + cleanTag;
    const res2 = await fetch(directUrl, {
      headers: {
        'Authorization': 'Bearer ' + COC_TOKEN,
        'Accept': 'application/json'
      }
    });
    if (res2.ok) return await res2.json();
    return null;
  } catch (err) {
    return null;
  }
}

export function calculateMaxStats(player) {
  if (!player) return null;

  const heroes = player.heroes || [];
  let totalHeroLevels = 0;
  let currentHeroLevels = 0;

  heroes.forEach(h => {
    totalHeroLevels += h.maxLevel || 0;
    currentHeroLevels += h.level || 0;
  });

  const heroPct = totalHeroLevels > 0 ? Math.round((currentHeroLevels / totalHeroLevels) * 100) : 0;

  const deHeroes = heroes.filter(h => ['Barbarian King', 'Archer Queen', 'Royal Champion', 'Minion Prince'].includes(h.name));
  let remainingLevels = 0;
  deHeroes.forEach(h => {
    remainingLevels += Math.max(0, (h.maxLevel || 0) - (h.level || 0));
  });

  const estDarkElixirNeeded = remainingLevels * 260000;
  const estDaysWithOneBuilder = remainingLevels * 7.5;
  const estDaysWithThreeBuilders = Math.round(estDaysWithOneBuilder / 3);

  return {
    heroPct,
    remainingLevels,
    estDarkElixirNeeded,
    estDaysWithThreeBuilders,
    heroes
  };
}