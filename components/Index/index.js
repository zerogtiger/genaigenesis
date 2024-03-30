import styles from '../../styles/Pages.module.css';

export default function Index({setUserContent}) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>AIVA</h1>
        <textarea
          id='userIn'
          type="text"
          className={styles.textbox}
        />
        <p className={styles.code} onClick={() => setUserContent()}>{"Verify"}</p>
      </main>
    </div>
  );
}
