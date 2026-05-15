/** Cevap anahtarı ve puanlama — Technical_Consultant_AI_Yetkinlik_V1.txt */

// B1–B10: doğru seçenek indeksi (0 tabanlı)
export const B_CORRECT = [0, 1, 1, 0, 2, 0, 1, 1, 2, 1];

// S1–S4: doğru seçenek indeksi
export const S_CORRECT = [1, 1, 1, 1];

/** Güvenlik kritik: doğru cevap indeksleri */
export const SECURITY_CORRECT = {
  a10: 3,
  b4: 0,
  b9: 2,
  s2: 1,
};

export function scoreKnowledge(bAnswers) {
  let pts = 0;
  for (let i = 0; i < 10; i++) {
    const v = bAnswers[i];
    if (v === undefined || v === null) continue;
    if (Number(v) === B_CORRECT[i]) pts += 1;
  }
  return pts;
}

export function scoreScenario(sAnswers) {
  let pts = 0;
  for (let i = 0; i < 4; i++) {
    const v = sAnswers[i];
    if (v === undefined || v === null) continue;
    if (Number(v) === S_CORRECT[i]) pts += 1;
  }
  return pts;
}

/** Rol bazlı sorularda “bana uymuyor” şıkkı → davranış toplamına nötr katkı */
export const BEHAVIOR_NA_OPTION_INDEX = 4;
export const BEHAVIOR_NA_SCORE = 2;

/** A4 / A8: çoklu — noneIndex = AI kullanılmıyor; naIndex opsiyonel = soru rol için geçerli değil */
export function scoreMultiBehavior(selectedIndices, noneIndex, naIndex = -1) {
  const set = new Set(selectedIndices.map(Number));
  if (naIndex >= 0 && set.has(naIndex)) return BEHAVIOR_NA_SCORE;
  if (noneIndex >= 0 && set.has(noneIndex)) return 1;
  const positives = [...set].filter(
    (i) =>
      (noneIndex < 0 || i !== noneIndex) && (naIndex < 0 || i !== naIndex)
  ).length;
  if (positives <= 0) return 1;
  if (positives <= 2) return 2;
  if (positives <= 4) return 3;
  return 4;
}

/** Tek seçim; indeks 4 (BEHAVIOR_NA_OPTION_INDEX) = rol uyumsuzluğu → nötr */
export function scoreSingleBehavior(index) {
  if (index === undefined || index === null || index === "") return 0;
  return Number(index) + 1;
}

export function scoreSingleBehaviorWithNA(index) {
  if (index === undefined || index === null || index === "") return 0;
  if (String(index) === String(BEHAVIOR_NA_OPTION_INDEX)) return BEHAVIOR_NA_SCORE;
  return Number(index) + 1;
}

export function totalBehaviorScore(parts) {
  const { a1, a2, a3, a4, a5, a6, a7, a8, a9, a10 } = parts;
  let sum = 0;
  sum += scoreSingleBehaviorWithNA(a1);
  sum += scoreSingleBehaviorWithNA(a2);
  sum += scoreSingleBehaviorWithNA(a3);
  sum += scoreMultiBehavior(a4 || [], 5, 6);
  sum += scoreSingleBehaviorWithNA(a5);
  sum += scoreSingleBehaviorWithNA(a6);
  sum += scoreSingleBehaviorWithNA(a7);
  sum += scoreMultiBehavior(a8 || [], 6);
  sum += scoreSingleBehavior(a9);
  sum += scoreSingleBehavior(a10);
  return sum;
}

/** Güvenlik kritik: yanlış sayısı (düşük / yanlış) */
export function countSecurityFailures({ a10, b4, b9, s2 }) {
  let n = 0;
  if (a10 !== undefined && a10 !== null && Number(a10) !== SECURITY_CORRECT.a10)
    n += 1;
  if (b4 !== undefined && b4 !== null && Number(b4) !== SECURITY_CORRECT.b4)
    n += 1;
  if (b9 !== undefined && b9 !== null && Number(b9) !== SECURITY_CORRECT.b9)
    n += 1;
  if (s2 !== undefined && s2 !== null && Number(s2) !== SECURITY_CORRECT.s2)
    n += 1;
  return n;
}

const REC_SECURITY =
  "AI Güvenliği, Müşteri Verisi ve Danışmanlıkta Gizlilik Eğitimi (Zorunlu)";
const REC_BASIC = "Temel AI Okuryazarlığı ve Doğrulama (Zorunlu)";
const REC_WORKSHOP =
  "Pratik Atölye: Keşif Özeti, Karşılaştırma Tablosu ve Sunum Taslağı için AI";
const REC_ADVANCED =
  "İleri: Teknik İçerikte Prompt Tasarımı, Bağlam Yönetimi ve Agent / RAG Farkındalığı";
const REC_RISKY =
  "Riskli Profil: Taahhüt ve Kaynak Kontrolü Eğitimi (Öncelikli)";
const REC_HIGH_KNOW_LOW_USE =
  "Yüksek Bilgi / Düşük Kullanım: Araç Erişimi, Şablonlar ve Günlük Senaryolar";

/**
 * Matris öncelik sırası (ilk eşleşenler üstte; tüm eşleşenleri döndürür).
 */
export function getTrainingRecommendations({
  securityFailCount,
  knowledge,
  behavior,
  scenario,
}) {
  const out = [];
  const add = (priority, title, condition) => {
    if (condition) out.push({ priority, title });
  };

  add(1, REC_SECURITY, securityFailCount >= 2);
  add(2, REC_BASIC, knowledge < 5);
  add(
    3,
    REC_WORKSHOP,
    knowledge >= 5 && behavior < 22
  );
  add(
    4,
    REC_ADVANCED,
    knowledge >= 7 && behavior >= 30 && scenario >= 3
  );
  add(
    5,
    REC_RISKY,
    knowledge < 5 && behavior >= 28
  );
  add(
    6,
    REC_HIGH_KNOW_LOW_USE,
    knowledge >= 8 && behavior < 22
  );

  out.sort((a, b) => a.priority - b.priority);
  return out;
}

/** Özet seviye etiketi (yaklaşık — dokümanda sayısal eşik yok) */
export function getLevelLabel({ knowledge, behavior, scenario, securityFailCount }) {
  if (securityFailCount >= 2) return "Seviye 1: Başlangıç (güvenlik riski)";
  const norm =
    (knowledge / 10 + scenario / 4 + behavior / 40) / 3;
  if (norm < 0.35) return "Seviye 1: Başlangıç";
  if (norm < 0.5) return "Seviye 2: Temel Kullanıcı";
  if (norm < 0.65) return "Seviye 3: Uygulayıcı";
  if (norm < 0.8) return "Seviye 4: Güvenli ve Yetkin Kullanıcı";
  return "Seviye 5: AI Champion / İleri Kullanıcı";
}
