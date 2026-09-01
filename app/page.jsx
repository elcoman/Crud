import styles from "./page.module.css";
import TaskList from '../components/TaskList';
export default  function Home() {

 
  return (
      <div className={styles.main}>
       <TaskList />
      </div>
  );
}
