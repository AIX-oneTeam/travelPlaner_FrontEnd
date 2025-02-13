import styles from "./TimeBar.module.css";

const TimeBar = () => {
  return (
    <div className={styles.time_bar_container}>
      <div className={styles.time_bar}>
        <img
          src="/icons/morning_sun.jpg"
          alt="morning"
          className={`${styles.time_icon} ${styles.morning_icon}`}
        />
        <img
          src="/icons/day_sun.jpg"
          alt="noon"
          className={`${styles.time_icon} ${styles.noon_icon}`}
        />
        <img
          src="/icons/night_moon.jpg"
          alt="night"
          className={`${styles.time_icon} ${styles.night_icon}`}
        />
        <div className={styles.time_marks}>
          {Array.from({ length: 48 }, (_, i) => (
            <div
              key={i}
              className={styles.time_mark}
              style={{ top: `${(i * 100) / 48}%` }}
            >
              {i % 2 === 0 &&
                `${Math.floor(i / 2)
                  .toString()
                  .padStart(2, "0")}:00`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeBar;
