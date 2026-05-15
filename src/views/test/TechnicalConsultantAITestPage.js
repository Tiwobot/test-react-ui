import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Container,
  Form,
  Input,
} from "reactstrap-compat";
import "./aiYetkinlikPage.css";
import {
  countSecurityFailures,
  getLevelLabel,
  getTrainingRecommendations,
  scoreKnowledge,
  scoreScenario,
  totalBehaviorScore,
} from "./aiYetkinlikScoring.js";

function RadioBlock({ name, value, onChange, options }) {
  return (
    <div className="ai-option-stack mb-3" role="radiogroup">
      {options.map((label, idx) => {
        const id = `${name}-${idx}`;
        const checked = value === String(idx);
        return (
          <label
            key={id}
            htmlFor={id}
            className={`ai-option ai-option--radio${checked ? " ai-option--checked" : ""}`}
          >
            <input
              className="ai-option__native"
              type="radio"
              name={name}
              id={id}
              value={String(idx)}
              checked={checked}
              onChange={() => onChange(String(idx))}
            />
            <span className="ai-option__control" aria-hidden />
            <span className="ai-option__text">{label}</span>
          </label>
        );
      })}
    </div>
  );
}

function CheckBlock({ values, onChange, options, noneIndex, naIndex = -1 }) {
  const set = new Set(values.map(String));
  const toggle = (idx) => {
    const s = new Set(values.map(String));
    const k = String(idx);
    if (noneIndex >= 0 && idx === noneIndex) {
      onChange(s.has(k) ? [] : [k]);
      return;
    }
    if (naIndex >= 0 && idx === naIndex) {
      onChange(s.has(k) ? [] : [k]);
      return;
    }
    if (noneIndex >= 0) s.delete(String(noneIndex));
    if (naIndex >= 0) s.delete(String(naIndex));
    if (s.has(k)) s.delete(k);
    else s.add(k);
    onChange([...s]);
  };
  return (
    <div className="ai-option-stack mb-3">
      {options.map((label, idx) => {
        const id = `cb-${noneIndex}-${naIndex}-${idx}`;
        const checked = set.has(String(idx));
        return (
          <label
            key={id}
            htmlFor={id}
            className={`ai-option ai-option--checkbox${checked ? " ai-option--checked" : ""}`}
          >
            <input
              className="ai-option__native"
              type="checkbox"
              id={id}
              checked={checked}
              onChange={() => toggle(idx)}
            />
            <span className="ai-option__control" aria-hidden />
            <span className="ai-option__text">{label}</span>
          </label>
        );
      })}
    </div>
  );
}

const initialForm = {
  d1: "",
  d2: "",
  d2Detail: "",
  d3: "",
  d4: [],
  d4Other: "",
  a1: "",
  a2: "",
  a3: "",
  a4: [],
  a5: "",
  a6: "",
  a7: "",
  a8: [],
  a9: "",
  a10: "",
  b1: "",
  b2: "",
  b3: "",
  b4: "",
  b5: "",
  b6: "",
  b7: "",
  b8: "",
  b9: "",
  b10: "",
  s1: "",
  s2: "",
  s3: "",
  s4: "",
  c1: "",
  c2: "",
  c3: "",
  c4: "",
  e1: "",
  e2: { 0: "", 1: "", 2: "", 3: "", 4: "" },
  e3: { 0: "", 1: "", 2: "", 3: "", 4: "" },
};

function TechnicalConsultantAITestPage() {
  const [form, setForm] = React.useState(initialForm);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    document.body.classList.add("ai-yetkinlik-body");
    return () => document.body.classList.remove("ai-yetkinlik-body");
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setE2 = (row, v) =>
    setForm((f) => ({ ...f, e2: { ...f.e2, [row]: v } }));
  const setE3 = (row, v) =>
    setForm((f) => ({ ...f, e3: { ...f.e3, [row]: v } }));

  const validate = () => {
    const need = [
      ["d2", "D2"],
      ["d3", "D3"],
      ["a1", "A1"],
      ["a2", "A2"],
      ["a3", "A3"],
      ["a5", "A5"],
      ["a6", "A6"],
      ["a7", "A7"],
      ["a9", "A9"],
      ["a10", "A10"],
      ["b1", "B1"],
      ["b2", "B2"],
      ["b3", "B3"],
      ["b4", "B4"],
      ["b5", "B5"],
      ["b6", "B6"],
      ["b7", "B7"],
      ["b8", "B8"],
      ["b9", "B9"],
      ["b10", "B10"],
      ["s1", "S1"],
      ["s2", "S2"],
      ["s3", "S3"],
      ["s4", "S4"],
    ];
    for (const [key, label] of need) {
      if (form[key] === "" || form[key] === undefined) {
        return `${label} zorunludur.`;
      }
    }
    if (form.d2 !== "" && form.d2 !== "0" && !String(form.d2Detail || "").trim()) {
      return "D2: AI kullandıysanız hangi araç veya kullanımı kısaca yazın.";
    }
    if (!form.a4 || form.a4.length === 0) return "A4 için en az bir seçenek işaretleyin.";
    if (!form.a8 || form.a8.length === 0) return "A8 için en az bir seçenek işaretleyin.";
    if (!form.c1.trim() || !form.c2.trim() || !form.c3.trim() || !form.c4.trim()) {
      return "Bölüm 4 (C1–C4) kısa cevapları doldurun.";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (err) {
      setResult(null);
      return;
    }
    const bArr = [
      form.b1,
      form.b2,
      form.b3,
      form.b4,
      form.b5,
      form.b6,
      form.b7,
      form.b8,
      form.b9,
      form.b10,
    ].map(Number);
    const sArr = [form.s1, form.s2, form.s3, form.s4].map(Number);
    const knowledge = scoreKnowledge(bArr);
    const scenario = scoreScenario(sArr);
    const behavior = totalBehaviorScore({
      a1: form.a1,
      a2: form.a2,
      a3: form.a3,
      a4: form.a4,
      a5: form.a5,
      a6: form.a6,
      a7: form.a7,
      a8: form.a8,
      a9: form.a9,
      a10: form.a10,
    });
    const securityFailCount = countSecurityFailures({
      a10: Number(form.a10),
      b4: Number(form.b4),
      b9: Number(form.b9),
      s2: Number(form.s2),
    });
    const recommendations = getTrainingRecommendations({
      securityFailCount,
      knowledge,
      behavior,
      scenario,
    });
    const level = getLevelLabel({
      knowledge,
      behavior,
      scenario,
      securityFailCount,
    });
    setResult({
      knowledge,
      scenario,
      behavior,
      securityFailCount,
      recommendations,
      level,
    });
    setTimeout(() => {
      document.getElementById("ai-test-results")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="ai-yetkinlik">
      <header className="ai-yetkinlik__header">
        <Container>
          <div className="ai-yetkinlik__header-inner">
            <div className="ai-yetkinlik__brand">
              <div className="ai-yetkinlik__logo" aria-hidden>
                AI
              </div>
              <div className="ai-yetkinlik__title-block">
                <h1>Yetkinlik değerlendirmesi</h1>
                <p>Teknik danışman · tahmini 12–16 dk · tarayıcıda hesaplama</p>
                <span className="ai-yetkinlik__badge">Baseline v1</span>
              </div>
            </div>
            <Button
              tag={Link}
              to="/index"
              className="ai-yetkinlik__btn-back"
              outline
            >
              ← Ana sayfa
            </Button>
          </div>
        </Container>
      </header>

      <Container className="py-4">
        <div className="ai-yetkinlik__intro">
          <p>
            Bu değerlendirme bireysel performans ölçümü için değil; şirket içi AI
            dönüşümünde olgunluk <strong>baseline</strong> ve eğitim ihtiyaçlarını
            anlamak içindir. Hesaplama yalnızca tarayıcınızda çalışır; yanıtlar
            kaydedilmez (demo).
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* BÖLÜM 0 */}
          <Card className="ai-panel mb-4">
            <CardHeader>
              <CardTitle tag="h4">Bölüm 0 — Bağlam (segmentasyon)</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="ai-section-hint">
                Bu sorular skora girmez; sizi ve günlük işinizi tanımak için sorulur.
              </p>
              <label className="form-label">
                D1. Danışmanlıkta en çok hangi alanda çalışıyorsunuz? (tek satırda özetleyin)
              </label>
              <Input
                type="textarea"
                rows={2}
                className="mb-3 ai-field"
                value={form.d1}
                onChange={(e) => set("d1", e.target.value)}
                placeholder="Örn. bulut ve altyapı, veri ve analitik, uygulama entegrasyonu, siber güvenlik…"
              />
              <h6 className="ai-q">
                D2. AI araçlarını iş bağlamında daha önce kullandınız mı?
              </h6>
              <p className="ai-d2-hint">
                Çoktan seçmeli ile işaretleyin. Kullandıysanız aşağıda hangi araç
                veya nasıl kullandığınızı (ör. Copilot, ChatGPT, şirket içi asistan,
                kod asistanı) kısaca yazın; Evet seçeneklerinde bu alan zorunludur.
              </p>
              <RadioBlock
                name="d2"
                value={form.d2}
                onChange={(v) => {
                  set("d2", v);
                  if (v === "0") set("d2Detail", "");
                }}
                options={[
                  "Hayır",
                  "Evet, birkaç kez denedim",
                  "Evet, belirli görevlerde kullanıyorum",
                  "Evet, günlük iş akışımın parçası haline geldi",
                ]}
              />
              <label className="form-label" htmlFor="d2-detail">
                Kullandıysanız yazınız
              </label>
              <Input
                id="d2-detail"
                type="textarea"
                rows={3}
                className="mb-3 ai-field"
                value={form.d2Detail}
                onChange={(e) => set("d2Detail", e.target.value)}
                placeholder="Örn. Microsoft Copilot ile teklif taslağı, ChatGPT ile SQL açıklaması…"
              />
              <h6 className="ai-q">D3. Kişisel / iş dışı hayatta yapay zekâ araçlarını ne sıklıkla kullanıyorsunuz?</h6>
              <RadioBlock
                name="d3"
                value={form.d3}
                onChange={(v) => set("d3", v)}
                options={[
                  "Hiç",
                  "Ayda 1-2 kez",
                  "Haftada 1-2 kez",
                  "Neredeyse her gün",
                ]}
              />
              <h6 className="ai-q">
                D4. Günlük işinizde en çok hangi tür işlerle uğraşıyorsunuz? (birden fazla seçebilirsiniz)
              </h6>
              <CheckBlock
                values={form.d4}
                onChange={(v) => set("d4", v)}
                noneIndex={-1}
                options={[
                  "Keşif toplantısı ve gereksinim dokümantasyonu",
                  "Çözüm mimarisi veya hedef mimariyi anlatma",
                  "Teklif yazımı, POC / pilot planı veya kapsam netleştirme",
                  "Workshop, eğitim materyali veya demo senaryosu hazırlama",
                  "Runbook, geçiş planı veya kontrol listesi",
                  "Ürün veya yaklaşım karşılaştırması ve öneri özeti",
                  "Uygulama desteği ve sorun giderme notları",
                  "Diğer (kısa açıklama alanında belirtin)",
                ]}
              />
              <Input
                className="ai-field mt-2"
                placeholder="D4 diğer: kısa açıklama"
                value={form.d4Other}
                onChange={(e) => set("d4Other", e.target.value)}
              />
            </CardBody>
          </Card>

          {/* BÖLÜM 1 */}
          <Card className="ai-panel mb-4">
            <CardHeader>
              <CardTitle tag="h4">Bölüm 1 — İş akışında yapay zekâ kullanımı</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="ai-section-hint">
                Bu bölümdeki sorular, danışmanlık işinizde kullandığınız{" "}
                <strong>yapay zekâ araçlarıyla</strong> (ör. şirket asistanı, ChatGPT, kod
                asistanı) ne yaptığınızı ölçer. Her soruda size en yakın{" "}
                <strong>tek</strong> seçeneği işaretleyin; <strong>A4</strong> ve{" "}
                <strong>A8</strong> dışında çoklu seçim yoktur. Bazı sorularda rolünüze göre
                ilgili çıktıyı hiç üretmiyorsanız son şıkkı seçebilirsiniz; bu seçenek toplam
                davranış puanına <strong>nötr</strong> (ne ceza ne ödül) yansır.
              </p>
              <h6 className="ai-q">A1 — Keşif sonrası gereksinim özeti veya user story</h6>
              <p className="ai-q-desc">
                Müşteri keşfi veya workshop’tan sonra gereksinim özeti / user story taslağı
                yazarken yapay zekâyı kullanımınız hangisine en yakın? Bu çıktıları hiç üretmiyorsanız son şıkkı seçin.
              </p>
              <RadioBlock
                name="a1"
                value={form.a1}
                onChange={(v) => set("a1", v)}
                options={[
                  "Yapay zekâ kullanmıyorum; notları doğrudan kendi şablonuma aktarıyorum",
                  "Ham notları verip yapay zekâdan yalnızca genel özet veya madde listesi istiyorum",
                  "Öncelik sırası, kapsam dışı maddeler, varsayımlar ve açık soruların da yer aldığı bir çıktı istiyorum",
                  "Müşteri bağlamını (hedef, kısıtlar, mevcut sistem özeti) veriyorum; yapay zekâ çıktısını kaynak notlar ve paydaşlarla birlikte kontrol ederek netleştiriyorum",
                  "Rolümde keşif sonrası gereksinim özeti veya user story taslağı yazmıyorum; soru bana uymuyor",
                ]}
              />
              <h6 className="ai-q">A2 — Mimari veya çözüm anlatımı (doküman / sunum)</h6>
              <p className="ai-q-desc">
                Teknik mimariyi veya çözüm yaklaşımını yazılı metin veya slaytlara dökerken
                yapay zekâdan nasıl yararlanıyorsunuz? Mimari / çözüm dokümanı hazırlamıyorsanız son şıkkı seçin.
              </p>
              <RadioBlock
                name="a2"
                value={form.a2}
                onChange={(v) => set("a2", v)}
                options={[
                  "Yapay zekâ kullanmıyorum; tamamen kendim yazıyorum",
                  "Taslak cümleleri veya slayt başlıklarını yapay zekâdan alıp kendim düzenliyorum",
                  "Bileşenler, entegrasyon noktaları ile güvenlik ve operasyon notlarını içeren yapılandırılmış bir anlatım istiyorum",
                  "Hedef kitle (teknik / karma), riskler, fonksiyonel olmayan gereksinimler ve “henüz net değil” dediğim noktaları belirterek adım adım ilerliyorum; iddiaları referans mimari veya standartlarla hizalıyorum",
                  "Rolümde mimari veya çözüm anlatımı dokümanı / sunumu hazırlamıyorum; soru bana uymuyor",
                ]}
              />
              <h6 className="ai-q">A3 — Teklif metni, POC kapsamı veya teklif dışı (out of scope) yazımı</h6>
              <p className="ai-q-desc">
                Bu tür metinleri hazırlarken yapay zekâyı hangi düzeyde ve nasıl kullanıyorsunuz?
                (Soru, yapay zekânın çıktısının kalitesi ve bağlama uygunluğu ile ilgilidir.)
                Teklif veya POC metni yazmayan roller için son şıkkı kullanın.
              </p>
              <RadioBlock
                name="a3"
                value={form.a3}
                onChange={(v) => set("a3", v)}
                options={[
                  "Bu işlerde yapay zekâ kullanmıyorum",
                  "Yapay zekâdan az bağlamlı veya içi boş metin alıyorum: genel laflar, pazarlama klişeleri; müşteri veya teklife özgü detay az",
                  "Teslimat fazları, varsayımlar ve bağımlılıkları içeren bir iskelet (çerçeve) istiyorum; üzerinde kendim çalışıyorum",
                  "Şirket şablonu, yasal/ticari sınırlar ve müşteriye özel maskelenmiş bağlamla çalışıyorum; taahhütleri ve rakamları yapay zekâya bırakmıyorum, mutlaka kendim kontrol ediyorum",
                  "Rolümde teklif, POC kapsamı veya teklif dışı (out of scope) metni yazmıyorum; soru bana uymuyor",
                ]}
              />
              <h6 className="ai-q">A4 — Workshop ve demo hazırlığı (birden fazla işaretleyebilirsiniz)</h6>
              <p className="ai-q-desc">
                Workshop veya demo için yapay zekâdan hangi tür çıktılar alıyorsunuz? Workshop/demo hazırlamıyorsanız son şıkkı seçin (diğer kutularla birlikte işaretlenmez).
              </p>
              <CheckBlock
                values={form.a4}
                onChange={(v) => set("a4", v)}
                noneIndex={5}
                naIndex={6}
                options={[
                  "Ajanda ve zaman çizelgesi taslağı",
                  "Soru listesi veya beklenen itirazlar için senaryo taslağı",
                  "Lab adımları veya komut dizisi taslağı (ortama göre uyarlanır)",
                  "Katılımcı seviyesine göre sadeleştirilmiş teknik açıklama metni",
                  "Sunum sonrası bilgi kontrolü veya eksik kalan konular listesi",
                  "Bunların hiçbirinde yapay zekâ kullanmıyorum",
                  "Workshop veya demo hazırlığı rolümde yok; soru bana uymuyor",
                ]}
              />
              <h6 className="ai-q">A5 — Ürün veya bulut yaklaşımı karşılaştırması</h6>
              <p className="ai-q-desc">
                İki seçeneği karşılaştırırken yapay zekâyı nasıl kullanıyorsunuz? Karşılaştırma
                raporu hazırlamayan roller için son şıkkı kullanın.
              </p>
              <RadioBlock
                name="a5"
                value={form.a5}
                onChange={(v) => set("a5", v)}
                options={[
                  "Karşılaştırmada yapay zekâ kullanmıyorum; yalnızca dokümantasyon okuyorum",
                  "Yapay zekâdan genel artı / eksi listesi istiyorum",
                  "Maliyet, operasyon, güvenlik, yol haritası gibi kendi kriterlerimi verip tablo halinde çıktı istiyorum",
                  "Resmi doküman, ürün sürümü ve bölge bilgisini referans göstererek analiz istiyorum; kritik iddiaları kaynakla doğruluyorum",
                  "Rolümde ürün veya yaklaşım karşılaştırması / öneri özeti üretmiyorum; soru bana uymuyor",
                ]}
              />
              <h6 className="ai-q">A6 — Runbook, geçiş planı veya operasyon adımları</h6>
              <p className="ai-q-desc">
                Bu operasyonel içerikleri yazarken yapay zekâ kullanımınız hangisine yakın?
                Runbook veya geçiş planı yazmayan roller için son şıkkı kullanın.
              </p>
              <RadioBlock
                name="a6"
                value={form.a6}
                onChange={(v) => set("a6", v)}
                options={[
                  "Bu tip içeriklerde yapay zekâ kullanmıyorum",
                  "Genel bir adım listesi alıyorum; gerçek ortama göre kendim uyarlıyorum",
                  "Geri alma (rollback), doğrulama adımları ve iletişim noktalarını da içeren bir taslağı yapay zekâyla oluşturuyorum",
                  "Üretim adları hariç gerçek sürece uygun taslağı yapay zekâ ile oluşturup sahada mutlaka doğrulatıyorum",
                  "Rolümde runbook, geçiş planı veya operasyon adım listesi yazmıyorum; soru bana uymuyor",
                ]}
              />
              <h6 className="ai-q">A7 — Arıza / sorun giderme ve müşteriye yazılı yanıt</h6>
              <p className="ai-q-desc">
                Sorun çözerken veya müşteriye durum yazarken yapay zekâdan nasıl yararlanıyorsunuz?
                Müşteriye doğrudan arıza / sorun giderme yazışması yapmayan roller için son şıkkı
                kullanın.
              </p>
              <RadioBlock
                name="a7"
                value={form.a7}
                onChange={(v) => set("a7", v)}
                options={[
                  "Bu süreçte yapay zekâ kullanmıyorum",
                  "Hata mesajından yola çıkarak olası nedenler listesi istiyorum",
                  "Köprüleme (geçiş) adımları ve şu ana kadar ne kontrol edildiğinin özeti için yararlanıyorum",
                  "Maskelenmiş log veya yapılandırma özetinden hipotez ve doğrulama planı çıkarıyorum; müşteriye gidecek metnin tonunu kendim gözden geçiriyorum",
                  "Rolümde müşteriye yönelik sorun giderme veya durum yazışması yapmıyorum; soru bana uymuyor",
                ]}
              />
              <h6 className="ai-q">A8 — Yapay zekâya talimat verirken (prompt) nelere dikkat ediyorsunuz?</h6>
              <p className="ai-q-desc">
                Aşağıdakilerden hangilerini bilinçli olarak sık sık belirtiyorsunuz? Birden fazla seçebilirsiniz.
              </p>
              <CheckBlock
                values={form.a8}
                onChange={(v) => set("a8", v)}
                noneIndex={6}
                options={[
                  "Hedef kitle ve sunum / doküman bağlamı",
                  "İstenen çıktı formatı (ör. tablo, RACI, risk kaydı, karar özeti)",
                  "Kısıtlar: uyumluluk, bütçe, süre, lisans veya platform sınırları",
                  "Yapılmaması gerekenler: spekülatif özellik, kesin SLA iddiası vb.",
                  "Örnek: şirket şablonundan kısa parça veya madde yapısı",
                  "İterasyon: önce taslak analiz veya plan, sonra detay",
                  "Bu maddelerin hiçbirini bilinçli olarak kullanmıyorum",
                ]}
              />
              <h6 className="ai-q">A9 — Yapay zekâ çıktısını paylaşmadan önce kontrol</h6>
              <p className="ai-q-desc">
                AI ürettiği metni müşteri veya ekip ile paylaşmadan önce kontrol düzeyiniz?
              </p>
              <RadioBlock
                name="a9"
                value={form.a9}
                onChange={(v) => set("a9", v)}
                options={[
                  "Genelde olduğu gibi kullanırım; ayrıntılı kontrol etmem",
                  "Dil, üslup ve uzunluğu kontrol ederim",
                  "Teknik iddialar, tarihler, sürümler, maliyet ve kapsamı kaynaklarla doğrularım",
                  "Taahhüt, uyumluluk ve kişisel veri riski taşıyan hiçbir şeyi kontrol etmeden paylaşmam; gerekirse hukuk veya satış ile hizalarım",
                ]}
              />
              <h6 className="ai-q">A10 — Müşteri verisi ve hassas bilgiler</h6>
              <p className="ai-q-desc">
                Yapay zekâ araçlarına müşteri veya iç ortam bilgisi verirken yaklaşımınız?
              </p>
              <RadioBlock
                name="a10"
                value={form.a10}
                onChange={(v) => set("a10", v)}
                options={[
                  "Gerekirse tanımlayıcı ayrıntıları olduğu gibi yazarım veya dosya yüklerim",
                  "Yalnızca birkaç ismi kısaltırım; başka maskeleme yapmam",
                  "IP, makine adı, lisans ve kişisel veriyi çıkarır veya maskelerim; kullandığım aracın şirket politikasına uygunluğunu kontrol ederim",
                  "Veri sınıfı, sözleşme yükümlülükleri, şirketin AI politikası ve en az paylaşım ilkesine göre hareket ederim; onaylı veya tamamen kapalı ortam tercih ederim",
                ]}
              />
            </CardBody>
          </Card>

          {/* BÖLÜM 2 */}
          <Card className="ai-panel mb-4">
            <CardHeader>
              <CardTitle tag="h4">Bölüm 2 — Bilgi testi (tek doğru)</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="ai-section-hint">
                Her soruda yalnızca bir doğru cevap vardır. Sorular güvenli ve doğru yapay zekâ
                kullanımı, prompt ve doğrulama alışkanlıklarıyla ilgilidir.
              </p>
              {[
                {
                  id: "b1",
                  t: "B1. Aşağıdakilerden hangisi yapay zekâ “halüsinasyonu”na (yanlış ama ikna edici uydurma) örnektir?",
                  o: [
                    "Var olmayan bir kaynak, özellik veya politika varmış gibi anlatmak",
                    "Modelin “bu konuda kesin bilgim yok” demesi",
                    "Yanıtın geç gelmesi",
                    "Yanıtın kısa olması",
                  ],
                },
                {
                  id: "b2",
                  t: "B2. Müşteri X’in SLA özetini yapay zekâ ile hazırlamak istediğinizde en güvenilir yaklaşım hangisi?",
                  o: [
                    "Yalnızca soruyu yazmak; ek belge vermemek",
                    "Yetkili sözleşme veya SLA dokümanını metne eklemek veya açıkça referans göstermek",
                    "“Genelde sektörde böyle olur” diye tahmini metin yazdırmak",
                    "Yalnızca müşteri adını yazmak",
                  ],
                },
                {
                  id: "b3",
                  t: "B3. Danışmanlıkta “prompt mühendisliği” (prompt engineering) ne anlama gelir?",
                  o: [
                    "Modelin eğitim verisini kendimiz değiştirmek",
                    "İstediğimiz çıktıya ulaşmak için girdiyi (talimat, bağlam, format) bilinçli tasarlamak",
                    "Modelin her cevabını doğru kabul etmek",
                    "Müşteri sunumunu yapay zekâya otomatik onaylatmak",
                  ],
                },
                {
                  id: "b4",
                  t: "B4. İç ağ topolojisini gösteren bir diyagramı “herkese açık” genel yapay zekâ hizmetine yüklemeden önce ne yapmalısınız?",
                  o: [
                    "Şirket politikasını okuyup maskelemek veya onaylı araç kullanmak",
                    "Sadece slayda “gizli” yazmak",
                    "Yapay zekâya “bunu kimseyle paylaşma” demek",
                    "Ekstra bir şey yapmaya gerek yok",
                  ],
                },
                {
                  id: "b5",
                  t: "B5. Teknik bir danışmanlık çıktısı için aşağıdaki talimatlardan hangisi en az faydalıdır?",
                  o: [
                    "Değerlendirme kriterlerini tablo sütunları olarak yazmak",
                    "Hedef kitleyi ve alınacak kararı kısaca anlatmak",
                    "“Şunu çok etkileyici anlat” gibi belirsiz, ölçülemez bir istek",
                    "Örnek madde yapısı veya şablondan kısa bir parça vermek",
                  ],
                },
                {
                  id: "b6",
                  t: "B6. Uzun keşif notlarını yapay zekâ ile özetlerken en yaygın riske örnek hangisidir?",
                  o: [
                    "Kapsam sınırını veya bağımlılıkları yanlış vurgulamak ya da tamamen atlamak",
                    "Metnin her zaman gerçektekinden daha doğru olması",
                    "Özetin her zaman kaynak göstermesi",
                    "Yapay zekânın hiç hata yapmaması",
                  ],
                },
                {
                  id: "b7",
                  t: "B7. Karmaşık bir teslimat için yapay zekâdan “aşamalı geçiş planı” veya “doğrulama kontrol listesi” istemenin ana faydası nedir?",
                  o: [
                    "Her zaman daha hızlı cevap almak",
                    "Yapılandırılmış, gözden geçirilebilir ve sahada adım adım doğrulanabilir bir çıktı elde etmek",
                    "Gizli verilerin otomatik silinmesi",
                    "Müşteri imzasının otomatik alınması",
                  ],
                },
                {
                  id: "b8",
                  t: "B8. Üçüncü parti bir ürün hakkında yapay zekâ ile hızlı araştırma yaparken en sağlıklı yaklaşım hangisi?",
                  o: [
                    "Tüm teknik iddiaları doğru kabul etmek",
                    "Sürüm, bölge, dokümantasyon tarihi ve resmi kaynakla teknik iddiaları doğrulamak",
                    "En uzun yanıtı seçmek",
                    "“Daha ikna edici yaz” demek",
                  ],
                },
                {
                  id: "b9",
                  t: "B9. Genel amaçlı bir sohbet yapay zekâsına doğrudan yapıştırılmaması gereken bilgi hangisi?",
                  o: [
                    "Herkese açık ürün tanıtım sayfasının bağlantısı",
                    "Yayımlanmış, genel bir referans mimari şeması",
                    "Müşteriye özel canlı ortam şifresi, API anahtarı veya lisans bilgisi",
                    "Herkesin kullandığı genel bir bulut hizmeti tanımı",
                  ],
                },
                {
                  id: "b10",
                  t: "B10. Müşteri iletişiminde “%99,99 kullanılabilirlik” gibi kesin bir iddiayı yapay zekâ metnine koymadan önce neyi kontrol etmelisiniz?",
                  o: [
                    "Yalnızca cümlenin akıcı okunup okunmadığını",
                    "Kaynak doküman, sözleşme veya resmi SLA ile uyumu; yanlış taahhüt riskini",
                    "Metnin daha çok jargon içerip içermediğini",
                    "Metnin yapay zekâ tarafından yazılmış olup olmadığını",
                  ],
                },
              ].map(({ id, t, o }) => (
                <div key={id} className="mb-4">
                  <h6 className="ai-q">{t}</h6>
                  <RadioBlock
                    name={id}
                    value={form[id]}
                    onChange={(v) => set(id, v)}
                    options={o}
                  />
                </div>
              ))}
            </CardBody>
          </Card>

          {/* BÖLÜM 3 */}
          <Card className="ai-panel mb-4">
            <CardHeader>
              <CardTitle tag="h4">Bölüm 3 — Senaryo (tek doğru)</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="ai-section-hint">
                Gerçek iş durumlarına yakın kısa senaryolar. En uygun yaklaşımı seçin.
              </p>
              <h6 className="ai-q">S1 — Kırk sayfalık bir RFP / ihale dokümanından gereksinim çıkarma</h6>
              <p className="ai-q-desc">
                Yapay zekâ kullanarak bu işi yaparken yaklaşımınız hangisine en yakın?
              </p>
              <RadioBlock
                name="s1"
                value={form.s1}
                onChange={(v) => set("s1", v)}
                options={[
                  "Tüm PDF metnini yapıştırıp tek özet alıyorum ve doğrudan teklife koyuyorum",
                  "Bölüm yapısı ve şirket şablonuyla hizalı taslağı yapay zekâ ile çıkarıyorum; belirsiz maddeleri listeliyorum ve kritik satırları kendim kontrol ediyorum",
                  "Yalnızca ilk bölümü özetletiyorum",
                  "Yalnızca “daha resmi yaz” diye düzeltme istiyorum",
                ]}
              />
              <h6 className="ai-q">S2 — Müşteriye özel vaka özeti ile workshop hazırlığı</h6>
              <p className="ai-q-desc">
                Yapay zekâya not hazırlatırken hangi yaklaşımı tercih edersiniz?
              </p>
              <RadioBlock
                name="s2"
                value={form.s2}
                onChange={(v) => set("s2", v)}
                options={[
                  "Kişisel ve kurumsal tanımlayıcıları olduğu gibi yapay zekâya veririm",
                  "Gereksiz tanımlayıcıları çıkarır veya maskelerim; hedef katılımcı ve süreyi belirtirim; dağıtmadan önce çıktıyı kontrol ederim",
                  "İlk üretilen metni doğrudan katılımcılara gönderirim",
                  "Yalnızca “kısa not yaz” derim; bağlam vermem",
                ]}
              />
              <h6 className="ai-q">S3 — Yapay zekânın ürettiği bir script “çalışıyor gibi” görünüyor</h6>
              <p className="ai-q-desc">
                Üretim ortamına almadan önce ne yaparsınız?
              </p>
              <RadioBlock
                name="s3"
                value={form.s3}
                onChange={(v) => set("s3", v)}
                options={[
                  "Doğrudan üretimde çalıştırırım",
                  "Önce test veya sandbox’ta küçük kapsamda doğrularım",
                  "Yalnızca yapay zekânın yazdığı açıklama paragrafını okurum",
                  "Daha uzun bir script üretmesini isterim",
                ]}
              />
              <h6 className="ai-q">S4 — Rakip karşılaştırması ürettiniz; yapay zekâ kaynak göstermiyor</h6>
              <p className="ai-q-desc">
                Müşteri sunumuna eklemeden önce ne yaparsınız?
              </p>
              <RadioBlock
                name="s4"
                value={form.s4}
                onChange={(v) => set("s4", v)}
                options={[
                  "Olduğu gibi müşteri sunumuna alırım",
                  "Kaynak ve ürün sürümü isterim; kritik iddiaları resmi dokümantasyonla doğrularım",
                  "Daha kısa yazdırırım",
                  "Farklı dilde yazdırırım",
                ]}
              />
            </CardBody>
          </Card>

          {/* BÖLÜM 4 */}
          <Card className="ai-panel mb-4">
            <CardHeader>
              <CardTitle tag="h4">Bölüm 4 — Açık uçlu yanıtlar (2–4 cümle)</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="ai-section-hint">
                Bu alanlar puanlamaya dahil edilmez; deneyiminizi yazılı geri bildirim olarak kayda
                geçirmeniz içindir.
              </p>
              {[
                [
                  "c1",
                  "C1. Yapay zekâ kullanırken zaman kaybettiğiniz veya sonuçtan memnun kalmadığınız somut bir örnek yazın.",
                ],
                [
                  "c2",
                  "C2. “Keşke yapay zekâ şunu da güvenli ve doğru yapabilseydi” dediğiniz bir iş görevi nedir?",
                ],
                [
                  "c3",
                  "C3. Paydaşlara (müşteri veya iç ekip) göndermeden önce yapay zekâ çıktısında mutlaka kontrol ettiğiniz noktalar neler?",
                ],
                [
                  "c4",
                  "C4. Müşteri verisi veya sözleşme / taahhüt riski açısından sizi en çok düşündüren konu nedir?",
                ],
              ].map(([key, label]) => (
                <div key={key} className="mb-3">
                  <label className="form-label">{label}</label>
                  <Input
                    type="textarea"
                    rows={3}
                    className="ai-field"
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                  />
                </div>
              ))}
            </CardBody>
          </Card>

          {/* BÖLÜM 5 */}
          <Card className="ai-panel mb-4">
            <CardHeader>
              <CardTitle tag="h4">Bölüm 5 — Ek: AI olgunluğu (opsiyonel)</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="ai-section-hint">
                Bu bölüm isteğe bağlıdır; skora dahil edilmez. İsterseniz boş bırakıp gönderebilirsiniz.
              </p>
              <h6 className="ai-q">E1. Teknik danışmanlık işlerinde yapay zekâ araçlarını ne sıklıkla kullanıyorsunuz?</h6>
              <RadioBlock
                name="e1"
                value={form.e1}
                onChange={(v) => set("e1", v)}
                options={[
                  "Hiç kullanmıyorum",
                  "Ayda birkaç kez",
                  "Haftada birkaç kez",
                  "Her gün",
                  "Gün içinde sürekli aktif",
                ]}
              />
              <h6 className="ai-q mt-3">
                E2. Yapay zekâya görev tarif ederken şu unsurları ne sıklıkla ekliyorsunuz?
              </h6>
              {[
                "Hedef kitle ve sunum bağlamı",
                "Kısıtlar (uyumluluk, bütçe, zaman)",
                "Çıktı formatı (tablo, RACI vb.)",
                "“Yapılmaması gerekenler”",
                "Maskelemiş örnek veya şablon",
              ].map((label, row) => (
                <div key={row} className="mb-2">
                  <span className="ai-subcap d-block">{label}</span>
                  <RadioBlock
                    name={`e2-${row}`}
                    value={form.e2[row]}
                    onChange={(v) => setE2(row, v)}
                    options={["Hiç", "Nadiren", "Bazen", "Sık", "Her zaman"]}
                  />
                </div>
              ))}
              <h6 className="ai-q mt-3">E3. Kavramları bilme düzeyiniz ve sahada kullanımınız</h6>
              {[
                "RAG",
                "MCP (Model Context Protocol)",
                "Tool / function calling",
                "Context window sınırları",
                "AI agent vs sohbet",
              ].map((label, row) => (
                <div key={row} className="mb-2">
                  <span className="ai-subcap d-block">{label}</span>
                  <RadioBlock
                    name={`e3-${row}`}
                    value={form.e3[row]}
                    onChange={(v) => setE3(row, v)}
                    options={[
                      "Bilmiyorum",
                      "Kavramsal biliyorum",
                      "Deneme / POC",
                      "Gerçek müşteri veya projede kullandım",
                    ]}
                  />
                </div>
              ))}
            </CardBody>
          </Card>

          {error ? <div className="ai-yetkinlik__error">{error}</div> : null}
          <Button type="submit" className="ai-yetkinlik__submit mb-5">
            Sonuçları hesapla
          </Button>
        </Form>

        {result ? (
          <Card id="ai-test-results" className="ai-results mb-5">
            <CardHeader>
              <CardTitle tag="h4" className="mb-0">
                Özet sonuç · yalnızca bu oturum
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p className="ai-level">{result.level}</p>
              <div className="ai-stat-grid">
                <div className="ai-stat">
                  <div className="ai-stat__val">{result.knowledge}</div>
                  <div className="ai-stat__label">Bilgi (B) / 10</div>
                </div>
                <div className="ai-stat">
                  <div className="ai-stat__val">{result.scenario}</div>
                  <div className="ai-stat__label">Senaryo (S) / 4</div>
                </div>
                <div className="ai-stat">
                  <div className="ai-stat__val">{result.behavior}</div>
                  <div className="ai-stat__label">Davranış (A) / 40</div>
                </div>
                <div className="ai-stat">
                  <div className="ai-stat__val">{result.securityFailCount}</div>
                  <div className="ai-stat__label">Güvenlik kritik / 4</div>
                </div>
              </div>
              <h6>Eğitim önerileri (matris)</h6>
              {result.recommendations.length === 0 ? (
                <p className="text-muted">Ek öneri koşulu eşleşmedi.</p>
              ) : (
                <ol>
                  {result.recommendations.map((r) => (
                    <li key={r.priority}>
                      <strong>Öncelik {r.priority}:</strong> {r.title}
                    </li>
                  ))}
                </ol>
              )}
              <p className="text-muted small mb-0">
                Güvenlik: A10, B4, B9, S2 maddelerinden 2 veya daha fazlası yanlışsa
                güvenlik eğitimi zorunlu önerilir (metin şartı uygulanmıştır).
              </p>
            </CardBody>
          </Card>
        ) : null}
      </Container>
    </div>
  );
}

export default TechnicalConsultantAITestPage;
