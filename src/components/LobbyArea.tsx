import React, { useState } from 'react';
import { GameState } from '../types/game';
import { formatInspiration, formatRate } from '../utils/format';
import { Tooltip } from './Tooltip';
import { DEVICES, UPGRADES, GLOBAL_UPGRADES } from '../config/gameConfig';

interface LobbyAreaProps {
  gameState: GameState;
  finalProduction: number;
  onReturnToAtelier: () => void;
}

interface Masterwork {
  id: string;
  number: string;
  titleZh: string;
  titleFr: string;
  category: string;
  reqInspiration: number;
  description: string;
  quote: string;
  curatorNote: string;
}

const MASTERWORKS: Masterwork[] = [
  {
    id: 'mw-01',
    number: 'N° 01',
    titleZh: '第一幅構想原稿',
    titleFr: 'Premier Schéma d’Origine',
    category: 'DESSIN & MANUSCRIT',
    reqInspiration: 100,
    description: '在羊皮紙上以炭筆勾勒出的第一道弧線，為工坊奠定永恆之基。',
    quote: '“每一座偉大建築，皆始於一道不加掩飾的墨線。”',
    curatorNote: '保存完好的初期手稿，線條果斷俐落，展現了創作者對形式純粹性的本能追求。',
  },
  {
    id: 'mw-02',
    number: 'N° 02',
    titleZh: '幾何學的純粹宣言',
    titleFr: 'Manifeste de la Géométrie Pure',
    category: 'TRAITÉ THÉORIQUE',
    reqInspiration: 1000,
    description: '摒棄繁複多餘的裝飾色彩，將空間精煉為純黑白對比與直角交錯。',
    quote: '“形隨機能，而機能服從於心靈的秩序。”',
    curatorNote: '典藏誌的核心綱領文件，字裡行間散發出嚴格的幾何紀律與理性光芒。',
  },
  {
    id: 'mw-03',
    number: 'N° 03',
    titleZh: '夜間靈感交響曲',
    titleFr: 'Symphonie Nocturne d’Atelier',
    category: 'COMPOSITION SPATIALE',
    reqInspiration: 10000,
    description: '記錄當整個城市陷入沉睡時，工坊油燈下湧現的如浪思潮。',
    quote: '“黑夜是靈感最深邃的培養皿，萬物在暗中重新呼吸。”',
    curatorNote: '以建築剖面圖形式記錄的夜間創作手札，墨色濃淡對比鮮明。',
  },
  {
    id: 'mw-04',
    number: 'N° 04',
    titleZh: '理性與詩意的平衡柱',
    titleFr: 'Colonnes de Raison et Poésie',
    category: 'SCULPTURE MONOLITHE',
    reqInspiration: 50000,
    description: '以雙根大理石線條立柱象徵精密計算與藝術直覺的完美共存。',
    quote: '“極簡非貧瘠，而是去蕪存菁後的無邊豐富。”',
    curatorNote: '純粹垂直向度構成的紀念性模型，詮釋了工程與詩意的終極和解。',
  },
  {
    id: 'mw-05',
    number: 'N° 05',
    titleZh: '白立方體空間典藏',
    titleFr: 'L’Espace du Cube Blanc',
    category: 'ARCHITECTURE D’INTÉRIEUR',
    reqInspiration: 250000,
    description: '無陰影、無灰塵、唯有純光與空氣流動的無瑕思考室。',
    quote: '“空間本身即是內容，沉默即是最宏亮的宣告。”',
    curatorNote: '以 1:50 比例打造的微縮冥想空間，比例精確至微米級。',
  },
  {
    id: 'mw-06',
    number: 'N° 06',
    titleZh: '萬物互聯工作全覽圖',
    titleFr: 'Grand Atlas Mécanique de l’Atelier',
    category: 'CARTOGRAPHIE SYSTÉMIQUE',
    reqInspiration: 1000000,
    description: '串聯 8 種設備、16 項模組與全域典範的巨幅工坊運轉全覽圖。',
    quote: '“當體系自發運轉，靈感便化作永不停歇的洪流。”',
    curatorNote: '寬達三公尺的銅版蝕刻圖譜，詳載每一筆靈感從誕生到轉化為動能的路徑。',
  },
  {
    id: 'mw-07',
    number: 'N° 07',
    titleZh: '時間長河的永恆刻痕',
    titleFr: 'Sillons de l’Éternité',
    category: 'HORLOGE ARCHITECTURALE',
    reqInspiration: 10000000,
    description: '以每秒滴答的產能律動，在黑曜石碑上篆刻永不磨滅的創作成就。',
    quote: '“時間摧毀凡物，唯有經得起檢驗的理念長存。”',
    curatorNote: '結合鐘錶擒縱機理的純黑雕塑，象徵創作者對永恆的叩問。',
  },
  {
    id: 'mw-08',
    number: 'N° 08',
    titleZh: '無界理念星系',
    titleFr: 'Cosmos de la Création Infinie',
    category: 'INSTALLATION MONUMENTALE',
    reqInspiration: 100000000,
    description: '靈感達到究極境界，從個體工坊昇華為照亮整座文明的思想燈塔。',
    quote: '“讓每一個想法，都有機會發光；而眾光匯聚，即成宇宙。”',
    curatorNote: '工坊典藏的最高殿堂展品，代表靈感創造力的極致巔峰。',
  },
];

const PHILOSOPHICAL_MAXIMS = [
  {
    author: 'Ludwig Mies van der Rohe',
    role: '建築巨擘 · 包浩斯校長',
    quote: '“Less is more.（少即是多）—— 唯有剔除所有多餘的修飾，事物的靈魂才得以顯現。”',
  },
  {
    author: 'Walter Gropius',
    role: '現代建築先驅',
    quote: '“心靈與雙手的結合，是一切偉大形式的起點。”',
  },
  {
    author: 'Coco Chanel',
    role: '當代時尚設計師',
    quote: '“Simplicity is the keynote of all true elegance.（簡約是一切真正優雅的基調）”',
  },
  {
    author: 'Paul Valéry',
    role: '法蘭西詩人與哲學家',
    quote: '“靈感是一連串微小的堅持與無比精確的凝視。”',
  },
  {
    author: 'Dieter Rams',
    role: '工業設計大師',
    quote: '“Weniger, aber besser.（少，但更好）—— 好的設計是盡可能無可增減的。”',
  },
];

export const LobbyArea: React.FC<LobbyAreaProps> = ({
  gameState,
  finalProduction,
  onReturnToAtelier,
}) => {
  const [selectedMasterwork, setSelectedMasterwork] = useState<Masterwork | null>(null);
  const [maximIndex, setMaximIndex] = useState(0);

  // Compute Atelier Rank / Title based on total lifetime inspiration
  const getAtelierRank = (total: number) => {
    if (total >= 100000000) return { title: 'LÉGENDE DU COSMOS / 傳奇宗師', level: 'VI', progress: 100, next: 'MAX' };
    if (total >= 10000000) return { title: 'MAÎTRE VISIONNAIRE / 遠見先鋒', level: 'V', progress: Math.min(100, (total / 100000000) * 100), next: '100M' };
    if (total >= 1000000) return { title: 'MAÎTRE D’ATELIER / 工坊大師', level: 'IV', progress: Math.min(100, (total / 10000000) * 100), next: '10M' };
    if (total >= 100000) return { title: 'ARCHITECTE DU CONCEPT / 概念建築家', level: 'III', progress: Math.min(100, (total / 1000000) * 100), next: '1M' };
    if (total >= 5000) return { title: 'ARTISAN DE L’IDÉE / 理念匠人', level: 'II', progress: Math.min(100, (total / 100000) * 100), next: '100K' };
    return { title: 'APPRENTI DU TRAIT / 見習筆觸學徒', level: 'I', progress: Math.min(100, (total / 5000) * 100), next: '5K' };
  };

  const rankInfo = getAtelierRank(gameState.totalInspiration);
  const unlockedCount = MASTERWORKS.filter((m) => gameState.totalInspiration >= m.reqInspiration).length;
  const totalOwnedDevices = DEVICES.reduce((sum, d) => sum + (gameState.devices[d.id]?.owned || 0), 0);
  const totalPurchasedUpgrades = Object.keys(gameState.purchasedUpgrades).length;
  const totalPurchasedGlobals = Object.keys(gameState.purchasedGlobalUpgrades).length;

  return (
    <div className="w-full my-4">
      {/* Heavy 4px Section Divider */}
      <div className="h-1 bg-black w-full mb-6" />

      {/* Lobby Hero Masthead */}
      <div className="border-4 border-black p-6 sm:p-10 bg-white relative overflow-hidden bg-monochrome-lines mb-8">
        {/* Architectural Coordinates */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#525252] border-b border-black pb-2 mb-6">
          <span>SALON D’HONNEUR & ARCHIVES OFFICIELLES</span>
          <span>ZONE D’EXPOSITION PERMANENTE</span>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block">
              ESPACE DE RÉCEPTION ET DE MÉMOIRE
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none mt-1">
              工坊大廳
            </h2>
            <p className="font-serif italic text-sm sm:text-base text-black mt-3 leading-relaxed">
              “每一件傑作在此銘刻，每一道筆觸在此凝結。歡迎步入靈感沉澱之殿堂。”
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReturnToAtelier}
              className="bg-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-none cursor-pointer flex items-center gap-2"
            >
              <span>← RETOUR À L'ATELIER</span>
              <span>/ 返回工坊創作</span>
            </button>
          </div>
        </div>

        {/* Master Honor Rank & Title Card */}
        <div className="mt-8 border-2 border-black p-4 bg-[#F5F5F5] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="text-[10px] text-[#525252] uppercase tracking-wider">
              TITRE ACADÉMIQUE ACTUEL / 當前創作者稱號
            </div>
            <div className="font-display text-lg sm:text-xl font-bold text-black uppercase tracking-tight">
              RANG {rankInfo.level} · {rankInfo.title}
            </div>
          </div>

          <div className="w-full md:w-72 space-y-1">
            <div className="flex justify-between text-[10px] text-[#525252] uppercase">
              <span>PROGRESSION VERS LE PROCHAIN RANG</span>
              <span>SUIVANT : {rankInfo.next}</span>
            </div>
            <div className="w-full h-3 border border-black bg-white p-[1px]">
              <div
                className="h-full bg-black transition-none"
                style={{ width: `${rankInfo.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Gallery of Masterworks (8 Exhibits) */}
      <section className="mb-10">
        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block">
              COLLECTION PERMANENTE DES CHEFS-D'ŒUVRE
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black">
              名作典藏陳列室 ({unlockedCount} / {MASTERWORKS.length})
            </h3>
          </div>
          <div className="font-mono text-xs text-[#525252]">
            ÉDITION ARCHITECTURALE MMXXVI
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MASTERWORKS.map((mw) => {
            const isUnlocked = gameState.totalInspiration >= mw.reqInspiration;
            const progress = Math.min(100, (gameState.totalInspiration / mw.reqInspiration) * 100);

            return (
              <div
                key={mw.id}
                onClick={() => isUnlocked && setSelectedMasterwork(mw)}
                className={`group p-4 border-2 border-black flex flex-col justify-between transition-none ${
                  isUnlocked
                    ? 'bg-white text-black hover:bg-black hover:text-white cursor-pointer'
                    : 'bg-[#F5F5F5] text-[#525252] border-[#525252] opacity-75'
                }`}
              >
                <div>
                  {/* Top Bar: Number & Category */}
                  <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase border-b border-current pb-1.5 mb-2">
                    <span className="font-bold">{mw.number}</span>
                    <span className="opacity-80">{mw.category}</span>
                  </div>

                  <h4 className="font-display font-bold text-sm uppercase tracking-tight leading-snug">
                    {mw.titleZh}
                  </h4>
                  <div className="font-serif italic text-xs opacity-75 truncate mt-0.5">
                    {mw.titleFr}
                  </div>

                  <p className="font-serif text-xs leading-relaxed mt-2.5 line-clamp-3">
                    {mw.description}
                  </p>
                </div>

                {/* Bottom Status / Inspection Button */}
                <div className="mt-4 pt-2.5 border-t border-current flex flex-col gap-2">
                  {isUnlocked ? (
                    <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-wider">
                      <span className="border border-current px-2 py-0.5 font-bold">
                        ✓ EXPOSÉ / 已常設展出
                      </span>
                      <span className="underline group-hover:text-white text-black">
                        VOIR FICHE ↗
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1 font-mono text-[10px]">
                      <div className="flex justify-between opacity-80">
                        <span>REQUIS : {formatInspiration(mw.reqInspiration)}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 border border-current p-[1px]">
                        <div
                          className="h-full bg-current transition-none"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Part 2: Atelier Archives & Statistics (Inverted Monograph Layout) */}
      <section className="border-4 border-black bg-black text-white p-6 sm:p-8 bg-inverted-lines mb-10">
        <div className="border-b border-[#525252] pb-3 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3] block">
              REGISTRE CENTRAL ET STATISTIQUES HISTORIQUES
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-1">
              工坊全史檔案紀要
            </h3>
          </div>
          <div className="font-mono text-xs text-[#A3A3A3] mt-2 sm:mt-0">
            DÉBIT ACTUEL : +{formatRate(finalProduction)} / SEC
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 font-mono text-xs">
          <div className="border-l-2 border-white pl-3">
            <span className="text-[10px] text-[#A3A3A3] uppercase block">TOTAL HISTORIQUE</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              {formatInspiration(gameState.totalInspiration)}
            </div>
            <span className="text-[10px] text-[#737373]">累計收穫靈感</span>
          </div>

          <div className="border-l-2 border-white pl-3">
            <span className="text-[10px] text-[#A3A3A3] uppercase block">ÉQUIPEMENTS</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              {formatInspiration(totalOwnedDevices)}
            </div>
            <span className="text-[10px] text-[#737373]">運轉中設備總數</span>
          </div>

          <div className="border-l-2 border-white pl-3">
            <span className="text-[10px] text-[#A3A3A3] uppercase block">MODULES ACTIFS</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              {totalPurchasedUpgrades} / 16
            </div>
            <span className="text-[10px] text-[#737373]">設備專屬升級解鎖</span>
          </div>

          <div className="border-l-2 border-white pl-3">
            <span className="text-[10px] text-[#A3A3A3] uppercase block">CANONS GLOBAUX</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              {totalPurchasedGlobals} / 4
            </div>
            <span className="text-[10px] text-[#737373]">大師級全域典範</span>
          </div>

          <div className="border-l-2 border-white pl-3">
            <span className="text-[10px] text-[#A3A3A3] uppercase block">PUISSANCE DE CLIC</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              +{formatInspiration(gameState.clickPower)}
            </div>
            <span className="text-[10px] text-[#737373]">每次筆觸產量</span>
          </div>

          <div className="border-l-2 border-white pl-3">
            <span className="text-[10px] text-[#A3A3A3] uppercase block">MULTIPLICATEUR</span>
            <div className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              ×{gameState.globalProductionMultiplier}
            </div>
            <span className="text-[10px] text-[#737373]">全域產能倍率</span>
          </div>
        </div>
      </section>

      {/* Part 3: Salon des Penseurs (Philosophical Lounge & Quotations) */}
      <section className="border-2 border-black p-6 sm:p-8 bg-white mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-black pb-3 mb-6 gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block">
              SALON DES PENSEURS ET CITATIONS D'AUTEURS
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-black">
              名家哲思沙龍
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setMaximIndex((prev) => (prev + 1) % PHILOSOPHICAL_MAXIMS.length)}
            className="border-2 border-black px-4 py-1.5 font-mono text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-none cursor-pointer flex items-center gap-2"
          >
            <span>[ ↻ TIRER UNE MAXIME / 抽取靈感哲言 ]</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 border border-black bg-[#F5F5F5] flex flex-col justify-center">
          <p className="font-serif italic text-base sm:text-lg text-black leading-relaxed">
            {PHILOSOPHICAL_MAXIMS[maximIndex].quote}
          </p>
          <div className="mt-3 flex items-center gap-3 font-mono text-xs text-[#525252]">
            <span className="font-bold text-black uppercase">
              — {PHILOSOPHICAL_MAXIMS[maximIndex].author}
            </span>
            <span>/</span>
            <span>{PHILOSOPHICAL_MAXIMS[maximIndex].role}</span>
          </div>
        </div>
      </section>

      {/* Masterwork Curator Detail Modal */}
      {selectedMasterwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-xl w-full text-black relative">
            <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block">
                  FICHE OFFICIELLE D'ACQUISITION · {selectedMasterwork.number}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight">
                  {selectedMasterwork.titleZh}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMasterwork(null)}
                className="font-mono text-xs border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-none cursor-pointer"
              >
                ✕ FERMER
              </button>
            </div>

            <div className="space-y-4 font-serif text-sm">
              <div className="font-serif italic text-xs text-[#525252] border-b border-black pb-2">
                TITRE ORIGINAL : {selectedMasterwork.titleFr}
              </div>

              <div className="p-4 bg-[#F5F5F5] border border-black font-serif italic text-base leading-relaxed text-black">
                {selectedMasterwork.quote}
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-black block">
                  NOTE DU CONSERVATEUR / 館長鑑賞題註：
                </span>
                <p className="font-serif text-xs text-[#000000] leading-relaxed">
                  {selectedMasterwork.curatorNote}
                </p>
              </div>

              <div className="pt-3 border-t border-black font-mono text-[11px] text-[#525252] flex justify-between">
                <span>CATÉGORIE : {selectedMasterwork.category}</span>
                <span>CONDITION : ATTEINT & DÉPASSÉ</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMasterwork(null)}
                className="bg-black text-white px-6 py-2 font-mono text-xs uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-none cursor-pointer"
              >
                RETOUR AU HALL →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
