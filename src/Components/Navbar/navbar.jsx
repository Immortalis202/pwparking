import { useState } from "react";
import styles from "./navbar.module.css";
import { Link } from "react-router-dom";

function Navbar() {
	// adding the states
	const [isActive, setIsActive] = useState(false);
	//add the active class
	const toggleActiveClass = () => {
		setIsActive(!isActive);
	};
	//clean up function to remove the active class
	const removeActive = () => {
		setIsActive(false);
	};
	return (
		<div className="App">
			<header className="App-header">
				<nav className={`${styles.navbar}`}>
					{/* logo */}
					<Link to="/" className={`${styles.logo}`}>
						Parking Manager
					</Link>
					<div className={styles.navMenuContainer}>
						<ul
							className={`${styles.navMenu} ${
								isActive ? styles.active : ""
							}`}
						>
							<li onClick={removeActive}>
								<Link
									to="/tariffario"
									className={`${styles.navLink}`}
								>
									Tariffario
								</Link>
							</li>
							<li onClick={removeActive}>
								<Link
									to="/maps"
									className={`${styles.navLink}`}
								>
									Parcheggi
								</Link>
							</li>
							<li onClick={removeActive}>
								<Link
									to="/dashboard"
									className={`${styles.navLink}`}
								>
									Area Personale
								</Link>
							</li>
							<li onClick={removeActive}>
								<Link
									to="/login"
									className={`${styles.navLink}`}
								>
									Log In
								</Link>
							</li>
						</ul>
						<div
							className={`${styles.hamburger} ${
								isActive ? styles.active : ""
							}`}
							onClick={toggleActiveClass}
						>
							<span className={`${styles.bar}`}></span>
							<span className={`${styles.bar}`}></span>
							<span className={`${styles.bar}`}></span>
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
}

export default Navbar;
