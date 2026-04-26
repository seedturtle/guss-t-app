import type { GUSSItem, DirectTestItem } from './types';

export const INDIRECT_ITEMS: GUSSItem[] = [
  {
    id: 'awareness',
    question: '患者是否保持清醒至少 15 分鐘？',
    icon: '😴',
    description: '請確認患者意識清醒，可以配合檢查',
    cartoonHint: '👩‍⚕️ 醫護人員查看手錶計時，患者眼神清醒注視前方',
    options: [
      { label: '是', value: 1, score: 1 },
      { label: '否', value: 0, score: 0, next: 'stop' },
    ],
  },
  {
    id: 'cough',
    question: '患者可以自主咳嗽或清喉嚨兩次嗎？',
    icon: '😮‍💨',
    description: '觀察患者是否能夠主動咳嗽，以清除口腔或氣管中的物質',
    cartoonHint: '😮‍💨 患者做出咳嗽動作，說話框顯示兩次「咳、咳」',
    options: [
      { label: '是', value: 1, score: 1 },
      { label: '否', value: 0, score: 0, next: 'stop' },
    ],
  },
  {
    id: 'swallow_saliva',
    question: '患者可以成功吞嚥口水嗎？',
    icon: '💧',
    description: '觀察患者口腔非常乾燥時，先執行口腔清潔後再測試。如患者在吞口水時或吞口水後咳嗽，勾選「否」',
    cartoonHint: '💧 患者口腔放鬆口水順利嚥下，標註「吞嚥成功 ✓」',
    options: [
      { label: '成功吞嚥口水', value: 1, score: 1 },
      { label: '無法吞嚥（口腔乾燥、咳嗽）', value: 0, score: 0, next: 'stop' },
    ],
  },
  {
    id: 'drooling',
    question: '患者是否有長期嚴重流口水的問題？',
    icon: '💦',
    description: '觀察患者是否有持續流口水的現象',
    cartoonHint: '💦 患者下巴有口水痕跡，護理師拿紙巾輕拭',
    options: [
      { label: '是（長期嚴重流口水）', value: 0, score: 0, next: 'stop' },
      { label: '否（無流口水問題）', value: 1, score: 1 },
    ],
  },
  {
    id: 'voice_change',
    question: '患者的嗓音是否有改變（濕濡聲、沙啞）？',
    icon: '🗣️',
    description: '請患者說「哦」，聆聽吞嚥前後的嗓音是否有變化',
    cartoonHint: '🗣️ 患者發出「哦——」音，醫護聆聽嗓音並觀察聲波圖',
    options: [
      { label: '是（嗓音濕濡或沙啞）', value: 0, score: 0, next: 'stop' },
      { label: '否（嗓音正常）', value: 1, score: 1 },
    ],
  },
];

export const DIRECT_ITEMS_SEMI_SOLID: DirectTestItem[] = [
  {
    id: 'semi_swallow',
    question: '患者能否成功吞嚥增稠水（半固體）？',
    type: 'semi-solid',
    typeLabel: '半固體測試',
    typeIcon: '🥣',
    icon: '💧',
    description: '給予半茶匙（約 2.5 毫升）增稠水（IDDSI Level 3）。如果沒有吸入症狀出現，可以再給予 3 到 5 茶匙（約 5 毫升）。',
    volumeHint: '約 2.5 - 7.5 毫升（1-5 茶匙）',
    cartoonHint: '🥣 護理師以湯匙餵食增稠水（IDDSI Level 3），患者順利吞嚥',
    options: [
      { label: '無法吞嚥', value: '無法', score: 0 },
      { label: '延遲吞嚥（>2 秒）', value: '延遲', score: 1, stop: true },
      { label: '成功吞嚥', value: '成功', score: 2 },
    ],
  },
  {
    id: 'semi_cough',
    question: '吞嚥時或吞嚥後是否有非自主性咳嗽？',
    type: 'semi-solid',
    typeLabel: '半固體測試',
    typeIcon: '🥣',
    icon: '😮‍💨',
    description: '觀察患者在吞嚥前、吞嚥中、吞嚥後三分鐘內是否有咳嗽',
    cartoonHint: '😮‍💨 患者吞嚥時皺眉咳嗽，護理師表情擔憂並準備停止',
    options: [
      { label: '是（觀察到咳嗽）', value: '是', score: 0 },
      { label: '否（無咳嗽）', value: '否', score: 1 },
    ],
  },
  {
    id: 'semi_drool',
    question: '是否有流口水現象？',
    type: 'semi-solid',
    typeLabel: '半固體測試',
    typeIcon: '🥣',
    icon: '💦',
    description: '觀察患者口腔是否有流出液體的現象',
    cartoonHint: '💦 患者下巴有口水，護理師持纸巾輕輕擦拭並觀察',
    options: [
      { label: '是', value: '是', score: 0 },
      { label: '否', value: '否', score: 1 },
    ],
  },
  {
    id: 'semi_voice',
    question: '吞嚥後嗓音是否有改變？',
    type: 'semi-solid',
    typeLabel: '半固體測試',
    typeIcon: '🥣',
    icon: '🗣️',
    description: '請患者說「哦」，聆聽吞嚥後的嗓音是否有濕濡或沙啞聲',
    cartoonHint: '🗣️ 醫護仔細聆聽患者說「哦」的嗓音，觀察是否有異常',
    options: [
      { label: '是（嗓音改變）', value: '是', score: 0 },
      { label: '否（嗓音正常）', value: '否', score: 1 },
    ],
  },
];

export const DIRECT_ITEMS_LIQUID: DirectTestItem[] = [
  {
    id: 'liquid_swallow',
    question: '患者能否成功吞嚥液體？',
    type: 'liquid',
    typeLabel: '液體測試',
    typeIcon: '💧',
    icon: '💧',
    description: '使用杯子，依序給予 3、5、10、20 毫升的水，隨後再給予 50 毫升的水（連續吞嚥）',
    volumeHint: '3 → 5 → 10 → 20 → 50 毫升',
    cartoonHint: '💧 護理師以有刻度的杯子餵水，患者逐步增加攝取量',
    options: [
      { label: '無法吞嚥', value: '無法', score: 0 },
      { label: '延遲吞嚥（>2 秒）', value: '延遲', score: 1, stop: true },
      { label: '成功吞嚥', value: '成功', score: 2 },
    ],
  },
  {
    id: 'liquid_cough',
    question: '吞嚥時或吞嚥後是否有非自主性咳嗽？',
    type: 'liquid',
    typeLabel: '液體測試',
    typeIcon: '💧',
    icon: '😮‍💨',
    description: '觀察患者在吞嚥前、吞嚥中、吞嚥後三分鐘內是否有咳嗽',
    cartoonHint: '😮‍💨 患者嗆咳，水珠噴出，立即停止餵水並記錄',
    options: [
      { label: '是（觀察到咳嗽）', value: '是', score: 0 },
      { label: '否（無咳嗽）', value: '否', score: 1 },
    ],
  },
  {
    id: 'liquid_drool',
    question: '是否有流口水現象？',
    type: 'liquid',
    typeLabel: '液體測試',
    typeIcon: '💧',
    icon: '💦',
    description: '觀察患者口腔是否有流出液體的現象',
    cartoonHint: '💦 患者口腔有液體流出，護理師觀察並記錄情形',
    options: [
      { label: '是', value: '是', score: 0 },
      { label: '否', value: '否', score: 1 },
    ],
  },
  {
    id: 'liquid_voice',
    question: '吞嚥後嗓音是否有改變？',
    type: 'liquid',
    typeLabel: '液體測試',
    typeIcon: '💧',
    icon: '🗣️',
    description: '請患者說「哦」，聆聽吞嚥後的嗓音是否有濕濡或沙啞聲',
    cartoonHint: '🗣️ 醫護使用聽診器聆聽患者嗓音，確認是否有濕濡聲',
    options: [
      { label: '是（嗓音改變）', value: '是', score: 0 },
      { label: '否（嗓音正常）', value: '否', score: 1 },
    ],
  },
];

export const DIRECT_ITEMS_SOLID: DirectTestItem[] = [
  {
    id: 'solid_swallow',
    question: '患者能否成功吞嚥固體食物？',
    type: 'solid',
    typeLabel: '固體測試',
    typeIcon: '🍞',
    icon: '🍞',
    description: '給予去邊吐司、去皮饅頭或餅乾（尺寸不超過 1.5 公分 × 1.5 公分）',
    volumeHint: '一小塊（不超過 1.5cm × 1.5cm）',
    cartoonHint: '🍞 護理師提供小塊去邊吐司，患者咀嚼後順利吞嚥',
    options: [
      { label: '無法吞嚥', value: '無法', score: 0 },
      { label: '延遲吞嚥（>10 秒）', value: '延遲', score: 1 },
      { label: '成功吞嚥', value: '成功', score: 2 },
    ],
  },
  {
    id: 'solid_cough',
    question: '吞嚥時或吞嚥後是否有非自主性咳嗽？',
    type: 'solid',
    typeLabel: '固體測試',
    typeIcon: '🍞',
    icon: '😮‍💨',
    description: '觀察患者在吞嚥前、吞嚥中、吞嚥後三分鐘內是否有咳嗽',
    cartoonHint: '😮‍💨 患者吃完麵包後嗆咳，護理師輕拍背部輔助',
    options: [
      { label: '是（觀察到咳嗽）', value: '是', score: 0 },
      { label: '否（無咳嗽）', value: '否', score: 1 },
    ],
  },
  {
    id: 'solid_drool',
    question: '是否有流口水現象？',
    type: 'solid',
    typeLabel: '固體測試',
    typeIcon: '🍞',
    icon: '💦',
    description: '觀察患者口腔是否有流出液體的現象',
    cartoonHint: '💦 患者進食時流口水，護理師協助清理口腔',
    options: [
      { label: '是', value: '是', score: 0 },
      { label: '否', value: '否', score: 1 },
    ],
  },
  {
    id: 'solid_voice',
    question: '吞嚥後嗓音是否有改變？',
    type: 'solid',
    typeLabel: '固體測試',
    typeIcon: '🍞',
    icon: '🗣️',
    description: '請患者說「哦」，聆聽吞嚥後的嗓音是否有濕濡或沙啞聲',
    cartoonHint: '🗣️ 醫護請患者說「哦」，確認嗓音是否正常改變',
    options: [
      { label: '是（嗓音改變）', value: '是', score: 0 },
      { label: '否（嗓音正常）', value: '否', score: 1 },
    ],
  },
];

export function calculateResult(
  indirectScore: number,
  semiSolidScore: number,
  liquidScore: number,
  solidScore: number,
  stopReason?: string
): { severity: 'normal' | 'mild' | 'moderate' | 'severe'; iddsiLevels: string[]; recommendations: string[] } {
  const total = indirectScore + semiSolidScore + liquidScore + solidScore;

  if (stopReason || indirectScore < 5 || semiSolidScore < 5) {
    return {
      severity: 'severe',
      iddsiLevels: ['禁止由口進食任何食物或液體 (NPO)'],
      recommendations: [
        '禁止由口進食任何食物或液體（NPO）',
        '建議接受進一步功能性吞嚥評估（FEES / VFSS）',
        '建議轉介語言治療師',
        '可考虑经皮内镜胃造口（PEG）或鼻胃管补充营养',
      ],
    };
  }

  if (total >= 20) {
    return {
      severity: 'normal',
      iddsiLevels: ['正常飲食 (IDDSI Level 7)', '一般液體 (Level 0)'],
      recommendations: [
        '正常飲食（IDDSI Level 7）',
        '一般液體（IDDSI Level 0）',
        '在語言治療師或吞嚥專科護理師監督下進食第一份正常餐',
        '評估患者吞嚥混合質地食物的能力',
      ],
    };
  }

  if (total >= 15) {
    return {
      severity: 'mild',
      iddsiLevels: ['吞嚥障礙飲食（剁碎、濕潤或軟質、小塊）(IDDSI Level 5 或 6)', '增稠液體（IDDSI Level 1 或 2）'],
      recommendations: [
        '吞嚥障礙飲食（剁碎、濕潤或軟質、小塊）（IDDSI Level 5 或 6）',
        '增稠液體（IDDSI Level 1 或 2）',
        '水（Level 0）：經「Frazier Free Water Protocol」確認後才可飲用',
        '可選擇：接受進一步功能性吞嚥評估（FEES / VFSS）',
        '可選擇：轉介語言治療師',
        '可通過PEG、鼻胃管或腸道外方式補充營養',
      ],
    };
  }

  return {
    severity: 'moderate',
    iddsiLevels: ['泥狀質地食物（IDDSI Level 3 - 4）', '所有液體都必須增稠（IDDSI Level 2 - 3）'],
    recommendations: [
      '泥狀質地食物（IDDSI Level 3 - 4）',
      '所有液體都必須增稠（IDDSI Level 2 - 3）',
      '藥丸應磨碎並與泥狀質地食物混合服用',
      '不能服用液體藥物！',
      '建議接受進一步功能性吞嚥評估（FEES / VFSS）',
      '建議轉介語言治療師',
      '可通過PEG、鼻胃管或腸道外方式補充營養',
    ],
  };
}

export function getScoreLabel(score: number, max: number): string {
  if (score >= max) return '✅ 完全正常';
  if (score >= max * 0.75) return '⚠️ 輕度異常';
  if (score >= max * 0.5) return '🔴 中度異常';
  return '🚫 重度異常';
}