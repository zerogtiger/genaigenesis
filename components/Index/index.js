import styles from '../../styles/Pages.module.css';

export default function Index({ setUserContent, finalPercent }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>VerifAi</h1>
        <textarea
          id='userIn'
          type="text"
          className={styles.textbox}
        />
        <p className={styles.code} onClick={() => setUserContent()}>{"Verify"}</p>
        <textarea
          id='out'
          type="text"
          className={styles.textbox}
          readOnly={true}
        >{finalPercent}</textarea>
      </main>
    </div>
  );
}
