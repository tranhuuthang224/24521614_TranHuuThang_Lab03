/**
 * situationshipTypes.js - Domain definitions for Bonus Creative Exercise (Slide 31)
 * Inspired by Wendy Thảo's hit song: "Hẹn Hò Nhưng Không Yêu"
 * Solves 'Situationship' Boolean Soup & Asymmetric State.
 */

export const RELATIONSHIP_PHASES = {
  STRANGERS: 'STRANGERS',
  DATING_NO_LOVE: 'DATING_NO_LOVE', // 'Hẹn hò nhưng không yêu'
  COMMITTED: 'COMMITTED',           // Verified mutual commitment
  GHOSTED_EXIT: 'GHOSTED_EXIT',     // Self-respect exit & memory freed
};

export const PHASE_METADATA = {
  STRANGERS: {
    label: 'Bạn Bè / Người Dưng',
    description: 'Chưa bước vào mối quan hệ mập mờ. Trạng thái an toàn.',
    badgeColor: '#64748b',
    icon: '☕',
  },
  DATING_NO_LOVE: {
    label: 'Hẹn Hò Nhưng Không Yêu',
    description: 'Mối quan hệ không tên (Situationship). Em cố trăm lần, chẳng bằng ai đó một phần.',
    badgeColor: '#f43f5e',
    icon: '💔',
  },
  COMMITTED: {
    label: 'Chính Thức Yêu Thương',
    description: 'Cam kết rõ ràng, nỗ lực tương xứng hai chiều.',
    badgeColor: '#10b981',
    icon: '💖',
  },
  GHOSTED_EXIT: {
    label: 'Giải Phóng Bộ Nhớ (Self-Respect Exit)',
    description: 'Đã cắt đứt situationship độc hại. Bộ nhớ và tài nguyên Fiber được giải phóng hoàn toàn.',
    badgeColor: '#8b5cf6',
    icon: '✨',
  },
};

export const EM_WEIGHT = 0.1;       // 'Em cố trăm lần' -> impact = 100 * 0.1 = 10
export const RIVAL_WEIGHT = 50.0;   // 'Ai đó một phần' -> impact = 1 * 50.0 = 50

export const DEFAULT_PRESET_SCENARIOS = [
  {
    title: 'Lời bài hát Wendy Thảo (Red-Flag 100%)',
    myTries: 100,
    rivalTries: 1,
    phase: 'DATING_NO_LOVE',
  },
  {
    title: 'Nỗ lực cân bằng (Fair Mutual)',
    myTries: 50,
    rivalTries: 0,
    phase: 'COMMITTED',
  },
  {
    title: 'Giai đoạn bắt đầu tìm hiểu',
    myTries: 10,
    rivalTries: 0,
    phase: 'STRANGERS',
  },
];
