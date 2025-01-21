import jwtDecode from "jwt-decode";
import { create } from "zustand";

// 디코드된 토큰 interface
interface MemberInfo {
  nickname: string;
  email: string;
  profile_url?: string;
  roles?: string[];
}

// 스토어 객체 interface
interface MemberStore {
  memberInfo: MemberInfo;
  // 디코드된 토큰 세터
  setAuth: (memberInfo: MemberInfo) => void;
  // 토큰 저장
  decodeToken: (accessToken: string) => MemberInfo;
  // 스토어 객체 초기화(로그아웃)
  initStore: () => void;
  // 익명 사용자 여부 확인
  isAnonymous: () => boolean;
  // 관리자 여부 확인
  isAdmin: () => boolean;
  //   로컬 스토리지 세터
  //  로컬 스토리지 게터
  getLocalStorage: () => MemberInfo | null;
}

const useMemberStore: any = create<MemberStore>((set, get) => ({
  //초깃값
  memberInfo: {
    nickname: "익명의 사용자",
    email: "",
    profile_url: "",
    roles: [],
  },

  decodeToken: (accessToken: string): any => {
    if (!accessToken || typeof accessToken !== "string") {
      console.log("올바른 토큰이 아닙니다.");
      return null;
    }

    try {
      const decodedToken = jwtDecode<MemberInfo>(accessToken);
      console.log(decodedToken);
      return decodedToken;
    } catch (error) {
      console.log("토큰 디코딩 에러");
      return null;
    }
  },

  setAuth: (newMemberInfo: MemberInfo) => {
    set({
      memberInfo: newMemberInfo,
    });
    localStorage.setItem("memberInfo", JSON.stringify(newMemberInfo));
  },

  initStore: () => {
    set({
      memberInfo: {
        nickname: "익명의 사용자",
        email: "",
        profile_url: "",
        roles: [],
      },
    });
    localStorage.removeItem("memberInfo");
  },

  isAnonymous: () => {
    const state = get();
    return state.memberInfo?.nickname === "익명의 사용자" || false;
  },

  isAdmin: () => {
    const state = get();
    return state.memberInfo?.roles?.includes("ROLE_ADMIN") || false;
  },

  getLocalStorage: () => {
    const memberInfo = localStorage.getItem("memberInfo");
    if (memberInfo) {
      return JSON.parse(memberInfo);
    }
    return null;
  },
}));

export default useMemberStore;
