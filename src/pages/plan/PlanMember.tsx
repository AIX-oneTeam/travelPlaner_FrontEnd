import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PlanMember.module.css";
import { API_BASE_URL } from "../../config";
import useMemberStore from "../../stores/MemberStore";

interface SavedPlan {
  id: number;
  name: string;
  main_location: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

const PlanMember: React.FC = () => {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plans`, {
          withCredentials: true,
        });
        setPlans(response.data.data);
      } catch (error) {
        console.error("일정 목록 조회 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handlePlanClick = (planId: number) => {
    navigate(`/plan/${planId}`);
  };

  const handleEditClick = (e: React.MouseEvent, planId: number) => {
    e.stopPropagation();
    navigate(`/plan/edit/${planId}`);
  };

  const handleDeleteClick = async (e: React.MouseEvent, planId: number) => {
    e.stopPropagation();
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${API_BASE_URL}/plans/${planId}`);
        setPlans(plans.filter((plan) => plan.id !== planId));
      } catch (error) {
        console.error("일정 삭제 중 오류 발생:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loading_spinner}></div>
        <p>일정 목록을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className={styles.plan_member_container}>
      <h1 className={styles.title}>내 여행 일정</h1>
      {plans.length === 0 ? (
        <div className={styles.empty_plans}>저장된 여행 일정이 없습니다.</div>
      ) : (
        <div className={styles.plan_grid}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={styles.plan_card}
              onClick={() => handlePlanClick(plan.id)}
            >
              <div className={styles.plan_info}>
                <h2>{plan.name}</h2>
                <p className={styles.location}>{plan.main_location}</p>
                <p className={styles.date}>
                  {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                </p>
              </div>
              <div className={styles.created_at}>
                작성일: {new Date(plan.created_at).toLocaleDateString()}
              </div>
              <div className={styles.plan_actions}>
                <button
                  className={styles.edit_btn}
                  onClick={(e) => handleEditClick(e, plan.id)}
                >
                  수정
                </button>
                <button
                  className={styles.delete_btn}
                  onClick={(e) => handleDeleteClick(e, plan.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanMember;
