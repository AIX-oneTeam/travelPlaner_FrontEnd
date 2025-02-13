import styles from "./TimeBar.module.css";

const TimeBar = () => {
  return (
    <div className={styles.time_bar_container}>
      <div className={styles.time_bar}>
        <div className={styles.time_marks}>
          {Array.from({ length: 26 }, (_, i) => (
            <div
              key={i}
              className={styles.time_mark}
              style={{ top: `${(i * 100) / 26}%` }}
            >
              {i % 2 === 0 &&
                `${(Math.floor(i / 2) + 8).toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeBar;
