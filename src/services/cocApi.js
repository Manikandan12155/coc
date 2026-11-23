const COC_TOKEN = import.meta.env.VITE_COC_TOKEN || "";
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

    if (!res.ok) {
      const directUrl = "https://cocproxy.royaleapi.dev/v1/players/" + cleanTag;
      const res2 = await fetch(directUrl, {
        headers: {
          'Authorization': 'Bearer ' + COC_TOKEN,
          'Accept': 'application/json'
        }
      });
      if (!res2.ok) throw new Error("API Error: " + res2.status);
      return await res2.json();
    }

    return await res.json();
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
