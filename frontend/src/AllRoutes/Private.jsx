import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Private = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  // If user is not logged in, show the GIF
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", width: "100%" }}>
        <Link to="/login">
        <img
          src="https://media.giphy.com/media/3ofSB9uejjzhZ5LPGg/giphy.gif?cid=790b7611tlpweb5a4v7m0shg71glyunetj3a4wdrj6n4rdvq&ep=v1_gifs_search&rid=giphy.gif&ct=g"
          alt="Please login to access this page"
        />
        </Link>
       
      </div>
    );
  }

  // If user is logged in, render the children components
  return <>{children}</>;
};

export default Private;
