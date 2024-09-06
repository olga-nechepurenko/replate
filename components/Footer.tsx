export default async function Footer() {
    return (
        <footer className="footer-copy">
            <small>
                rePlate&copy; {new Date().getFullYear()} created by{" "}
                <a href="https://github.com/olga-nechepurenko">
                    Olga Nechepurenko
                </a>
                :-:-:
                <a href="mailto:olga.nechepurenko@gmail.com?subject=contact">
                    kontaktieren
                </a>
            </small>
        </footer>
    );
}
