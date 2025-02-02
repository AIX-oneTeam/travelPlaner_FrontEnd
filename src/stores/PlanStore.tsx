import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Companion {
  label: string;
  count: number;
}

interface PlanState {
  location: string;
  start_date: string;
  end_date: string;
  ageGroup: string;
  companions: Companion[];
  concepts: string[];
  // 상태 조회 및 수정을 위한 메서드들
  getPlan: () => Omit<
    PlanState,
    "getPlan" | "setPlan" | "resetPlan" | "initPlanInfo"
  >;
  setPlan: (plan: Partial<PlanState>) => void;
  resetPlan: () => void;
  initPlanInfo: () => void;
}

const initialState = {
  location: "",
  start_date: "",
  end_date: "",
  ageGroup: "",
  companions: [],
  concepts: [],
};

const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      ...initialState,
      // 현재 계획 정보를 가져오는 메서드
      getPlan: () => {
        const state = get();
        const { getPlan, setPlan, resetPlan, initPlanInfo, ...planInfo } =
          state;
        return planInfo;
      },
      setPlan: (plan) => set((state) => ({ ...state, ...plan })),
      // 상태만 초기화
      resetPlan: () => set(initialState),
      // 상태와 로컬스토리지 모두 초기화
      initPlanInfo: () => {
        set(initialState);
        localStorage.removeItem("planStorage");
      },
    }),
    {
      name: "planStorage",
    }
  )
);

export default usePlanStore;
