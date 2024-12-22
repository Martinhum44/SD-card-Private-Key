
import styles from "./style.module.css"
import PropTypes from 'prop-types';
import image from "../assets/default.png"
var none = "none"
 
function Smartcard(props) {
    const defaultSource = props.image || image

    const styley = {
        color: props.contact ? "#0169D8" : "black",
        textDecoration: "none"
    } 

    return (
      <>
        <div className={styles.container}>
          <h1 className={styles.title}>{props.name || "No Name"}</h1>
          <img className={styles.photo} src={defaultSource} alt="Smartcard" /><br></br><br></br>
          <a className={styles.contact} style={styley} href={props.contact ? props.contact : "#"}>
            {props.contact ? props.contact : "No contact was specified"}
          </a><br></br><br></br>
          <button className={styles.button} onClick={props.onclick || (() => {alert("Default onclick behaviour")})}>Click Me!</button>
        </div>
      </>
    );
}

Smartcard.propTypes = {
    name: PropTypes.string,
    photo: PropTypes.string,
    contact: PropTypes.string,
    onclick: PropTypes.func
}

export default Smartcard