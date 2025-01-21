import { create } from "zustand";

// 디코드된 토큰 interface
interface AuthToken {
  nickname: string;
  email: string;
  profile_url: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}

// 스토어 객체 interface
interface MemberStore {
  authToken: AuthToken | null;
  // 디코드된 토큰 세터
  setAuth: (decodedToken: AuthToken) => void;
  // 토큰 저장
  decodeToken: (accessToken: string) => AuthToken;
  // 스토어 객체 초기화(로그아웃)
  initStore: () => void;
  // 익명 사용자 여부 확인
  isAnonymous: () => boolean;
  // 관리자 여부 확인
  isAdmin: () => boolean;
  //   로컬 스토리지 세터
  setLocalStorage: (decodedToken: AuthToken) => void;
  //  로컬 스토리지 게터
  getLocalStorage: () => AuthToken | null;
}

const useMemberStore: any = create<MemberStore>((set) => ({
  authToken: null,

  decodeToken: (accessToken) => {
    const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
    return decodedToken;
  },

  setAuth: (accessToken) => {
    const decodedToken = useMemberStore.getState().decodeToken(accessToken);
    set({ authToken: decodedToken });
  },

  initStore: () => set({ authToken: null }),

  isAnonymous: () => {
    return !localStorage.getItem("accessToken");
  },

  isAdmin: () => {
    return useMemberStore.getState().authToken?.roles.includes("ROLE_ADMIN");
  },

  setLocalStorage: (decodedToken) => {
    localStorage.setItem("accessToken", JSON.stringify(decodedToken));
  },

  getLocalStorage: () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return JSON.parse(accessToken);
    }
    return null;
  },
}));

export default useMemberStore;
